import apiClient from "@/services/api/api-client";
import type { ApiResponse } from "@/types/api.types";

import type {
  CreateSupplierData,
  Supplier,
  SupplierFilters,
  UpdateSupplierData,
} from "@/types/supplier.types";

const SUPPLIER_API = {
  suppliers: "/suppliers",

  supplierById: (supplierId: string) =>
    `/suppliers/${supplierId}`,

  supplierStatus: (supplierId: string) =>
    `/suppliers/${supplierId}/status`,
};

function unwrap<T>(response: ApiResponse<T>): T {
  return response.data;
}

export async function getSuppliers(
  filters?: SupplierFilters,
): Promise<Supplier[]> {
  const response = await apiClient.get<
    ApiResponse<Supplier[]>
  >(SUPPLIER_API.suppliers, {
    params: filters,
  });

  return unwrap(response.data);
}

export async function getSupplierById(
  supplierId: string,
): Promise<Supplier> {
  const response = await apiClient.get<
    ApiResponse<Supplier>
  >(
    SUPPLIER_API.supplierById(supplierId),
  );

  return unwrap(response.data);
}

export async function createSupplier(
  data: CreateSupplierData,
): Promise<Supplier> {
  const response = await apiClient.post<
    ApiResponse<Supplier>
  >(
    SUPPLIER_API.suppliers,
    data,
  );

  return unwrap(response.data);
}

export async function updateSupplier(
  supplierId: string,
  data: UpdateSupplierData,
): Promise<Supplier> {
  const response = await apiClient.patch<
    ApiResponse<Supplier>
  >(
    SUPPLIER_API.supplierById(supplierId),
    data,
  );

  return unwrap(response.data);
}

export async function updateSupplierStatus(
  supplierId: string,
  isActive: boolean,
): Promise<Supplier> {
  const response = await apiClient.patch<
    ApiResponse<Supplier>
  >(
    SUPPLIER_API.supplierStatus(supplierId),
    {
      isActive,
    },
  );

  return unwrap(response.data);
}

export async function deleteSupplier(
  supplierId: string,
): Promise<Supplier> {
  const response = await apiClient.delete<
    ApiResponse<Supplier>
  >(
    SUPPLIER_API.supplierById(supplierId),
  );

  return unwrap(response.data);
}