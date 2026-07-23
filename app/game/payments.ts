export type PaymentBoundary = {
  enabled: false;
  note: string;
};

export const paymentBoundary: PaymentBoundary = {
  enabled: false,
  note: "V1 uses fictional in-game balances only. Keep real payment providers outside gameplay until age, compliance, account, and refund rules are designed.",
};
