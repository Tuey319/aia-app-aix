// ---------------------------------------------------------------------------
// Notification types for AIA Call-Intent Prediction proactive push stubs
//
// In production: replace STUB_NOTIFICATIONS with an API call to the
// prediction service that returns { intent, confidence, policyNo, features }
// and renders this same Notification shape.
// ---------------------------------------------------------------------------

export type NotificationIntent =
  | 'due_date_amount'
  | 'payment_status'
  | 'autopay'
  | 'loan_repayment'
  | 'tax_consent';

export interface Notification {
  id: string;
  intent: NotificationIntent;
  policyNo: string;
  productName: string;
  /** 0–1 softmax probability from the prediction model */
  confidence: number;
  titleTh: string;
  titleEn: string;
  bodyTh: string;
  bodyEn: string;
  /** Deep-link route inside the app */
  actionRoute: string;
  actionLabelTh: string;
  actionLabelEn: string;
  isRead: boolean;
  createdAt: string; // ISO 8601
}

export const INTENT_META: Record<
  NotificationIntent,
  { icon: string; colorBg: string; colorIcon: string; labelTh: string; labelEn: string }
> = {
  due_date_amount: {
    icon: 'event',
    colorBg: '#EAF1FB',
    colorIcon: '#1976D2',
    labelTh: 'ครบกำหนดชำระ',
    labelEn: 'Payment Due',
  },
  payment_status: {
    icon: 'error-outline',
    colorBg: '#FDECEA',
    colorIcon: '#D32F2F',
    labelTh: 'สถานะการชำระ',
    labelEn: 'Payment Status',
  },
  autopay: {
    icon: 'autorenew',
    colorBg: '#FFF8E1',
    colorIcon: '#F57C00',
    labelTh: 'ชำระอัตโนมัติ',
    labelEn: 'Auto-Pay',
  },
  loan_repayment: {
    icon: 'account-balance',
    colorBg: '#F3E5F5',
    colorIcon: '#7B1FA2',
    labelTh: 'ชำระคืนเงินกู้',
    labelEn: 'Loan Repayment',
  },
  tax_consent: {
    icon: 'description',
    colorBg: '#E8F5E9',
    colorIcon: '#2E7D32',
    labelTh: 'ยินยอมลดหย่อนภาษี',
    labelEn: 'Tax Consent',
  },
};

export function confidenceLabel(score: number): 'high' | 'medium' | 'low' {
  if (score >= 0.70) return 'high';
  if (score >= 0.55) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// STUB DATA — replace with real prediction API response in production
// ---------------------------------------------------------------------------
export const STUB_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    intent: 'due_date_amount',
    policyNo: 'T1000000001',
    productName: 'AIA Health Happy',
    confidence: 0.72,
    titleTh: 'เบี้ยประกันครบกำหนดใน 3 วัน',
    titleEn: 'Premium due in 3 days',
    bodyTh: 'กรมธรรม์ T1000000001 เบี้ย ฿4,250 ครบกำหนด 4 ก.ค. 2569 ชำระก่อนเพื่อหลีกเลี่ยงการขาดความคุ้มครอง',
    bodyEn: 'Policy T1000000001 premium ฿4,250 is due 4 Jul 2026. Pay now to avoid a coverage lapse.',
    actionRoute: 'PaySelect',
    actionLabelTh: 'ชำระเบี้ยเลย',
    actionLabelEn: 'Pay Now',
    isRead: false,
    createdAt: '2026-07-01T08:00:00+07:00',
  },
  {
    id: 'notif-002',
    intent: 'payment_status',
    policyNo: 'T1000000005',
    productName: 'AIA Life Protect',
    confidence: 0.68,
    titleTh: 'การชำระเงินรอการยืนยัน',
    titleEn: 'Payment pending confirmation',
    bodyTh: 'การชำระ ฿7,850 ของกรมธรรม์ T1000000005 ยังอยู่ในสถานะ "รอตรวจสอบ" กรุณายืนยันผล',
    bodyEn: 'Your ฿7,850 payment on policy T1000000005 is still showing "failed_pending". Tap to resolve.',
    actionRoute: 'PayChecking',
    actionLabelTh: 'ตรวจสอบสถานะ',
    actionLabelEn: 'Check Status',
    isRead: false,
    createdAt: '2026-07-01T07:30:00+07:00',
  },
  {
    id: 'notif-003',
    intent: 'autopay',
    policyNo: 'T1000000003',
    productName: 'AIA Health Happy',
    confidence: 0.55,
    titleTh: 'ระบบตัดชำระอัตโนมัติล้มเหลว',
    titleEn: 'Auto-pay debit failed',
    bodyTh: 'การตัดชำระอัตโนมัติสำหรับ T1000000003 ไม่สำเร็จเมื่อ 2 วันที่แล้ว กรุณาตรวจสอบบัญชีธนาคาร',
    bodyEn: 'Auto-pay debit for T1000000003 failed 2 days ago. Check your bank account details.',
    actionRoute: 'PayMethod',
    actionLabelTh: 'แก้ไขการชำระ',
    actionLabelEn: 'Fix Payment',
    isRead: false,
    createdAt: '2026-06-30T14:00:00+07:00',
  },
  {
    id: 'notif-004',
    intent: 'loan_repayment',
    policyNo: 'T1000000077',
    productName: 'AIA Whole Life',
    confidence: 0.81,
    titleTh: 'ชำระคืนเงินกู้กรมธรรม์ใน 5 วัน',
    titleEn: 'Policy loan repayment in 5 days',
    bodyTh: 'ยอดเงินกู้กรมธรรม์ T1000000077 จำนวน ฿32,500 ครบกำหนดชำระคืน 6 ก.ค. 2569',
    bodyEn: 'Policy loan on T1000000077 (balance ฿32,500) has a repayment due 6 Jul 2026.',
    actionRoute: 'Costs',
    actionLabelTh: 'ดูรายละเอียดเงินกู้',
    actionLabelEn: 'View Loan Details',
    isRead: true,
    createdAt: '2026-06-29T09:00:00+07:00',
  },
  {
    id: 'notif-005',
    intent: 'tax_consent',
    policyNo: 'T1000000011',
    productName: 'AIA Health Happy',
    confidence: 0.64,
    titleTh: 'รอลายเซ็นยินยอมลดหย่อนภาษี',
    titleEn: 'Tax consent awaiting signature',
    bodyTh: 'คำขอยินยอมภาษีสำหรับ T1000000011 ยังรอลายเซ็นของคุณอยู่ ดำเนินการก่อนสิ้นปีภาษี',
    bodyEn: 'Tax consent request for T1000000011 is still pending your e-signature. Complete before tax year end.',
    actionRoute: 'Support',
    actionLabelTh: 'ดำเนินการเซ็นชื่อ',
    actionLabelEn: 'Sign Now',
    isRead: true,
    createdAt: '2026-06-28T11:00:00+07:00',
  },
];

export function timeAgo(isoDate: string, language: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === 'en') {
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } else {
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชม. ที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
  }
}
