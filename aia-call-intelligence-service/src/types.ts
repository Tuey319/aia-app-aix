export type CallIntent =
  | "due_date_amount"
  | "payment_status"
  | "autopay"
  | "loan_repayment"
  | "tax_consent";

export type Notification = {
  id: string;
  customerId: string;
  policyNo: string;
  productType: string;
  intent: CallIntent;
  /** Pre-rendered English fallback string; the app builds its own bilingual copy from the structured fields below. */
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
