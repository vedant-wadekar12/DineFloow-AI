export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public message: string,
    public data: T | null = null,
    public meta: object | null = null,
    public errors: unknown = null
  ) {}
}