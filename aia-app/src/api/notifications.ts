// 🔌 Real network call — aia-call-intelligence-service, the proactive
// call-intent notification feed (see ../../../aia-call-intelligence-service
// and ../../../AIA-CallIntent-Prediction for how the feed is produced).
//
// The service returns structured fields (amounts, dates, intent, product
// type) rather than pre-rendered copy, so this file owns turning that into
// the bilingual title/body/CTA shape NotificationsScreen renders — mirroring
// the style of the STUB_NOTIFICATIONS this replaces.

import { Notification, NotificationIntent } from '../screens/notifications/notificationTypes';
import { fetchWithTimeout } from './http';

const NOTIFICATIONS_BASE_URL = process.env.EXPO_PUBLIC_NOTIFICATIONS_URL;

// No auth/session layer exists yet to know the real logged-in customer's ID
// (see aia-call-intelligence-service README, "Path to production" ->
// Auth) -- pinned to a synthetic customer with active notifications until
// that lands.
export const DEMO_CUSTOMER_ID = 'C102221';

export type RemoteNotification = {
  id: string;
  customerId: string;
  policyNo: string;
  productType: string;
  intent: NotificationIntent;
  message: string;
  confidence: number;
  snapshotDate: string;
  premiumAmount: number;
  lastPaymentStatus: string;
  loanBalance: number;
  dueDate: string | null;
  lastDueDate: string | null;
  loanRepaymentDate: string | null;
  createdAt: string;
  read: boolean;
  dismissed: boolean;
};

const INTENT_ROUTE: Record<NotificationIntent, { route: string; labelTh: string; labelEn: string }> = {
  due_date_amount: { route: 'PaySelect', labelTh: 'ชำระเบี้ยเลย', labelEn: 'Pay Now' },
  payment_status: { route: 'PayChecking', labelTh: 'ตรวจสอบสถานะ', labelEn: 'Check Status' },
  autopay: { route: 'PayMethod', labelTh: 'แก้ไขการชำระ', labelEn: 'Fix Payment' },
  loan_repayment: { route: 'Costs', labelTh: 'ดูรายละเอียดเงินกู้', labelEn: 'View Loan Details' },
  tax_consent: { route: 'Support', labelTh: 'ดำเนินการเซ็นชื่อ', labelEn: 'Sign Now' },
};

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

function formatBaht(amount: number): string {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function buildCopy(n: RemoteNotification): Pick<Notification, 'titleTh' | 'titleEn' | 'bodyTh' | 'bodyEn'> {
  const amount = formatBaht(n.premiumAmount);
  const dueTh = formatDate(n.dueDate, 'th');
  const dueEn = formatDate(n.dueDate, 'en');
  const lastDueTh = formatDate(n.lastDueDate, 'th');
  const lastDueEn = formatDate(n.lastDueDate, 'en');

  switch (n.intent) {
    case 'due_date_amount':
      return {
        titleTh: `เบี้ยประกันครบกำหนดใน ${dueTh}`,
        titleEn: `Premium due ${dueEn}`,
        bodyTh: `กรมธรรม์ ${n.policyNo} เบี้ย ฿${amount} ครบกำหนด ${dueTh} ชำระก่อนเพื่อหลีกเลี่ยงการขาดความคุ้มครอง`,
        bodyEn: `Policy ${n.policyNo} premium ฿${amount} is due ${dueEn}. Pay now to avoid a coverage lapse.`,
      };
    case 'payment_status': {
      const resolved = n.lastPaymentStatus === 'paid_on_time' || n.lastPaymentStatus === 'paid_late';
      return resolved
        ? {
            titleTh: 'การชำระเงินสำเร็จ',
            titleEn: 'Payment received',
            bodyTh: `การชำระ ฿${amount} ของกรมธรรม์ ${n.policyNo} (ครบกำหนด ${lastDueTh}) ได้รับเรียบร้อยแล้ว`,
            bodyEn: `Your ฿${amount} payment on policy ${n.policyNo} (due ${lastDueEn}) has been received.`,
          }
        : {
            titleTh: 'การชำระเงินรอการยืนยัน',
            titleEn: 'Payment needs attention',
            bodyTh: `การชำระ ฿${amount} ของกรมธรรม์ ${n.policyNo} ยังอยู่ในสถานะ "${n.lastPaymentStatus}" กรุณาตรวจสอบ`,
            bodyEn: `Your ฿${amount} payment on policy ${n.policyNo} is still showing "${n.lastPaymentStatus}". Tap to resolve.`,
          };
    }
    case 'autopay':
      return {
        titleTh: 'ระบบตัดชำระอัตโนมัติล้มเหลว',
        titleEn: 'Auto-pay debit failed',
        bodyTh: `การตัดชำระอัตโนมัติสำหรับ ${n.policyNo} ไม่สำเร็จเมื่อเร็ว ๆ นี้ กรุณาตรวจสอบบัญชีธนาคาร`,
        bodyEn: `Auto-pay debit for ${n.policyNo} failed recently. Check your bank account details.`,
      };
    case 'loan_repayment': {
      const repayTh = formatDate(n.loanRepaymentDate, 'th');
      const repayEn = formatDate(n.loanRepaymentDate, 'en');
      return {
        titleTh: `ชำระคืนเงินกู้กรมธรรม์ใน ${repayTh}`,
        titleEn: `Policy loan repayment due ${repayEn}`,
        bodyTh: `ยอดเงินกู้กรมธรรม์ ${n.policyNo} จำนวน ฿${formatBaht(n.loanBalance)} ครบกำหนดชำระคืน ${repayTh}`,
        bodyEn: `Policy loan on ${n.policyNo} (balance ฿${formatBaht(n.loanBalance)}) has a repayment due ${repayEn}.`,
      };
    }
    case 'tax_consent':
    default:
      return {
        titleTh: 'รอลายเซ็นยินยอมลดหย่อนภาษี',
        titleEn: 'Tax consent awaiting signature',
        bodyTh: `คำขอยินยอมภาษีสำหรับ ${n.policyNo} ยังรอลายเซ็นของคุณอยู่`,
        bodyEn: `Tax consent request for ${n.policyNo} is still pending your e-signature.`,
      };
  }
}

function toAppNotification(n: RemoteNotification): Notification {
  const { route, labelTh, labelEn } = INTENT_ROUTE[n.intent];
  return {
    id: n.id,
    intent: n.intent,
    policyNo: n.policyNo,
    productName: n.productType,
    confidence: n.confidence,
    ...buildCopy(n),
    actionRoute: route,
    actionLabelTh: labelTh,
    actionLabelEn: labelEn,
    isRead: n.read,
    createdAt: n.createdAt,
  };
}

export async function fetchNotifications(customerId: string): Promise<Notification[]> {
  if (!NOTIFICATIONS_BASE_URL) {
    throw new Error('Missing EXPO_PUBLIC_NOTIFICATIONS_URL');
  }
  const res = await fetchWithTimeout(`${NOTIFICATIONS_BASE_URL}/api/notifications?customerId=${encodeURIComponent(customerId)}`);
  if (!res.ok) {
    throw new Error(`Notifications API error: ${res.status}`);
  }
  const remote: RemoteNotification[] = await res.json();
  if (!Array.isArray(remote)) {
    throw new Error('Malformed notifications response: expected an array');
  }
  // Skip intents this app version doesn't know — a newer server intent would
  // otherwise crash toAppNotification's INTENT_ROUTE lookup.
  return remote.filter((n) => n.intent in INTENT_ROUTE).map(toAppNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!NOTIFICATIONS_BASE_URL) return;
  try {
    await fetchWithTimeout(`${NOTIFICATIONS_BASE_URL}/api/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  } catch {
    // best-effort: local UI state already updated optimistically by the caller
  }
}

export async function dismissNotification(id: string): Promise<void> {
  if (!NOTIFICATIONS_BASE_URL) return;
  try {
    await fetchWithTimeout(`${NOTIFICATIONS_BASE_URL}/api/notifications/${encodeURIComponent(id)}/dismiss`, { method: 'POST' });
  } catch {
    // best-effort: local UI state already updated optimistically by the caller
  }
}
