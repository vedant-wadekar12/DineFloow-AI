export interface CreateEmployeeDto {
  userId: string;

  restaurantId: string;
  branchId?: string;

  employeeCode: string;

  designation: string;
  department?: string;

  joiningDate?: Date;
  dateOfBirth?: Date;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  salary?: number;

  notes?: string;
}

export interface UpdateEmployeeDto {
  branchId?: string;

  employeeCode?: string;

  designation?: string;
  department?: string;

  joiningDate?: Date;
  dateOfBirth?: Date;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  salary?: number;

  notes?: string;
}

export interface UpdateEmployeeStatusDto {
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "TERMINATED";
}