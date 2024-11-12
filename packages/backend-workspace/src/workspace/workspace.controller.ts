import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceDto } from "./dto/response/workspace.dto";
import { CreateWorkspaceDto } from "./dto/request/create-workspace.dto";

@Controller("workspace")
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  @ApiOkResponse({
    description: "Get all workspaces",
    type: WorkspaceDto,
    isArray: true,
  })
  public async getWorkspaces(): Promise<WorkspaceDto[]> {
    return plainToInstance(
      WorkspaceDto,
      await this.workspaceService.getWorkspaces()
    );
  }

  @Post()
  @ApiCreatedResponse({
    description: "Create a new workspace",
    type: WorkspaceDto,
  })
  public async createWorkspace(
    @Body() createWorkspaceDto: CreateWorkspaceDto
  ): Promise<WorkspaceDto> {
    return plainToInstance(
      WorkspaceDto,
      await this.workspaceService.createWorkspace(createWorkspaceDto)
    );
  }

  @Delete("/:id")
  @ApiOkResponse({
    description: "Delete a workspace",
  })
  public async deleteWorkspace(@Param("id") id: string): Promise<void> {
    await this.workspaceService.deleteWorkspace(id);
  }
}
