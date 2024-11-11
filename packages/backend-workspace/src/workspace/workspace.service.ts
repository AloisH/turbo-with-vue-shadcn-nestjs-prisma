import { WorkspaceRepository } from "@heloir/backend-database";
import { HttpException, Injectable } from "@nestjs/common";
import { type CreateWorkspaceDto } from "./dto/request/create-workspace.dto";
import { type WorkspaceDto } from "./dto/response/workspace.dto";

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  public async createWorkspace(
    createWorkspaceInput: CreateWorkspaceDto,
  ): Promise<WorkspaceDto> {
    const workspace = await this.workspaceRepository.workspace({
      name: createWorkspaceInput.name,
    });
    if (workspace) {
      throw new HttpException(
        {
          message: "Workspace already exists",
          error: "WorkspaceAlreadyExists",
        },
        400,
      );
    }

    return this.workspaceRepository.createWorkspace(createWorkspaceInput);
  }

  public async getWorkspaces(): Promise<WorkspaceDto[]> {
    return this.workspaceRepository.workspaces({});
  }
}
