import apiClient from "@/services/api/api-client";

import type {
  CreateEmployeeData,
  Employee,
  EmployeeApiResponse,
  UpdateEmployeeData,
  UpdateEmployeeStatusData,
} from "@/types/employee.types";

export async function getAllEmployees(): Promise<
  Employee[]
> {
  const response =
    await apiClient.get<
      EmployeeApiResponse<Employee[]>
    >("/employees");

  return response.data.data;
}

export async function getEmployee(
  employeeId: string,
): Promise<Employee> {
  const response =
    await apiClient.get<
      EmployeeApiResponse<Employee>
    >(`/employees/${employeeId}`);

  return response.data.data;
}

export async function getEmployeesByRestaurant(
  restaurantId: string,
): Promise<Employee[]> {
  const response =
    await apiClient.get<
      EmployeeApiResponse<Employee[]>
    >(
      `/employees/restaurant/${restaurantId}`,
    );

  return response.data.data;
}

export async function getEmployeesByBranch(
  branchId: string,
): Promise<Employee[]> {
  const response =
    await apiClient.get<
      EmployeeApiResponse<Employee[]>
    >(`/employees/branch/${branchId}`);

  return response.data.data;
}

export async function createEmployee(
  data: CreateEmployeeData,
): Promise<Employee> {
  const response =
    await apiClient.post<
      EmployeeApiResponse<Employee>
    >("/employees", data);

  return response.data.data;
}

export async function updateEmployee(
  employeeId: string,
  data: UpdateEmployeeData,
): Promise<Employee> {
  const response =
    await apiClient.patch<
      EmployeeApiResponse<Employee>
    >(`/employees/${employeeId}`, data);

  return response.data.data;
}

export async function updateEmployeeStatus(
  employeeId: string,
  data: UpdateEmployeeStatusData,
): Promise<Employee> {
  const response =
    await apiClient.patch<
      EmployeeApiResponse<Employee>
    >(
      `/employees/${employeeId}/status`,
      data,
    );

  return response.data.data;
}

export async function deleteEmployee(
  employeeId: string,
): Promise<void> {
  await apiClient.delete(
    `/employees/${employeeId}`,
  );
}