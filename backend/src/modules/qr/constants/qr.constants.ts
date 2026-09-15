export const QR_TYPES = {
  TABLE: "TABLE",
} as const;

export type QRType =
  (typeof QR_TYPES)[keyof typeof QR_TYPES];