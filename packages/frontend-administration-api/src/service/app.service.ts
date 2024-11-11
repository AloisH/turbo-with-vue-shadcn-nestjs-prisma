import { type AxiosInstance } from "axios";

export class AppService {
  private readonly baseUrl = `/`;

  constructor(private readonly axios: AxiosInstance) {}

  public getHello() {
    return this.axios.request<string>({
      method: `get`,
      url: `${this.baseUrl}`,
    });
  }
}
