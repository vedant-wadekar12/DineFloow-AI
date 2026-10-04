export const EMPLOYEE_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
  "TERMINATED",
] as const;

export type EmployeeStatus =
  (typeof EMPLOYEE_STATUSES)[number];

export interface EmployeeUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export interface EmployeeBranch {
  _id: string;
  name?: string;
}

export interface Employee {
  _id: string;
  userId: string | EmployeeUser;
  restaurantId: string;
  branchId?: string | EmployeeBranch;

  employeeCode: string;

  designation: string;
  department?: string;

  joiningDate?: string;
  dateOfBirth?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  salary?: number;

  status: EmployeeStatus;

  notes?: string;

  isActive: boolean;
  isDeleted: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  userId: string;
  restaurantId: string;
  branchId?: string;
  employeeCode: string;
  designation: string;
  department?: string;
  joiningDate?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  salary?: number;
  notes?: string;
}

export interface UpdateEmployeeData {
  branchId?: string;
  employeeCode?: string;
  designation?: string;
  department?: string;
  joiningDate?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  salary?: number;
  notes?: string;
}

export interface UpdateEmployeeStatusData {
  status: EmployeeStatus;
}

export interface EmployeeApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}