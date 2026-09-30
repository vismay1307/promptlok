export class ApiResponse<T> {
  public readonly success = true;

  constructor(
    public readonly data: T,
    public readonly message?: string
  ) {}
}