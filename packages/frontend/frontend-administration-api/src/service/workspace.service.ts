import { type AxiosInstance } from "axios";
import type { WorkspaceDto, CreateWorkspaceDto } from "../dto";

export class WorkspaceService {
  private readonly baseUrl = `/workspace`;

  constructor(private readonly axios: AxiosInstance) {}

  public getWorkspaces() {
    return this.axios.request<WorkspaceDto[]>({
      method: `get`,
      url: `${this.baseUrl}`,
    });
  }

  public createWorkspace(data: CreateWorkspaceDto) {
    return this.axios.request<WorkspaceDto>({
      method: `post`,
      url: `${this.baseUrl}`,
      data,
    });
  }
}
