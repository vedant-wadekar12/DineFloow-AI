import apiClient from "@/services/api/api-client";

import type {
  ApiResponse,
  CreateQRData,
  QRCode,
  UpdateQRStatusData,
} from "@/types/qr.types";

export async function getAllQRs(): Promise<QRCode[]> {
  const response =
    await apiClient.get<ApiResponse<QRCode[]>>("/qr");

  return response.data.data;
}

export async function getQRById(
  qrId: string,
): Promise<QRCode> {
  const response =
    await apiClient.get<ApiResponse<QRCode>>(
      `/qr/${qrId}`,
    );

  return response.data.data;
}

export async function getQRsByRestaurant(
  restaurantId: string,
): Promise<QRCode[]> {
  const response =
    await apiClient.get<ApiResponse<QRCode[]>>(
      `/qr/restaurant/${restaurantId}`,
    );

  return response.data.data;
}

export async function getQRsByBranch(
  branchId: string,
): Promise<QRCode[]> {
  const response =
    await apiClient.get<ApiResponse<QRCode[]>>(
      `/qr/branch/${branchId}`,
    );

  return response.data.data;
}

export async function getQRByTable(
  tableId: string,
): Promise<QRCode> {
  const response =
    await apiClient.get<ApiResponse<QRCode>>(
      `/qr/table/${tableId}`,
    );

  return response.data.data;
}

export async function createQR(
  data: CreateQRData,
): Promise<QRCode> {
  const response =
    await apiClient.post<ApiResponse<QRCode>>(
      "/qr",
      data,
    );

  return response.data.data;
}

export async function regenerateQR(
  tableId: string,
): Promise<QRCode> {
  const response =
    await apiClient.patch<ApiResponse<QRCode>>(
      `/qr/table/${tableId}/regenerate`,
    );

  return response.data.data;
}

export async function updateQRStatus(
  qrId: string,
  data: UpdateQRStatusData,
): Promise<QRCode> {
  const response =
    await apiClient.patch<ApiResponse<QRCode>>(
      `/qr/${qrId}/status`,
      data,
    );

  return response.data.data;
}

export async function deleteQR(
  qrId: string,
): Promise<void> {
  await apiClient.delete(`/qr/${qrId}`);
}