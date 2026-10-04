export const QR_TYPES = {
  TABLE: "TABLE",
} as const;

export type QRType =
  (typeof QR_TYPES)[keyof typeof QR_TYPES];

export interface QRCode {
  _id: string;
  restaurantId: string;
  branchId: string;
  floorId: string;
  tableId: string;
  tableNumber: string;
  type: QRType;
  qrToken: string;
  redirectUrl: string;
  qrImage?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQRData {
  restaurantId: string;
  branchId: string;
  floorId: string;
  tableId: string;
}

export interface UpdateQRStatusData {
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}