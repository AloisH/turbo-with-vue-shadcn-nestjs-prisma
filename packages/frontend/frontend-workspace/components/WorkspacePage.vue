<script setup lang="ts">
import {
  WorkspaceDto,
  WorkspaceService,
} from "@heloir/frontend-administration-api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@heloir/ui/alert-dialog";
import { Button } from "@heloir/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@heloir/ui/card";
import { Input } from "@heloir/ui/input";
import { Label } from "@heloir/ui/label";
import { Separator } from "@heloir/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@heloir/ui/table";
import axios from "axios";
import { Edit, Plus, Trash } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const workspaces = ref<WorkspaceDto[]>([]);
const workspaceService = new WorkspaceService(
  axios.create({
    baseURL: "http://localhost:62002",
  }),
);

onMounted(async () => {
  await loadWorkspaces();
});

async function deleteWorkspace(id: string) {
  await workspaceService.deleteWorkspace(id);
  await loadWorkspaces();
}

async function loadWorkspaces() {
  const { data } = await workspaceService.getWorkspaces();
  workspaces.value = data;
}
</script>

<template>
  <div class="wk-m-4">
    <Card>
      <CardHeader>
        <CardTitle> Workspaces </CardTitle>
        <CardDescription> Create and edit workspaces </CardDescription>
      </CardHeader>
      <CardContent class="wk-flex wk-flex-col wk-gap-4">
        <form>
          <div class="wk-flex wk-flex-col wk-space-y-1.5">
            <Label for="name">Workspace</Label>
            <div class="wk-flex wk-space-x-1.5 wk-items-center">
              <Input id="name" placeholder="Name of your workspace" />
              <Button>
                <Plus />
                Add
              </Button>
            </div>
          </div>
        </form>
        <Separator />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workspace</TableHead>
              <TableHead class="wk-text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="workspace in workspaces" :key="workspace.id">
              <TableCell>{{ workspace.name }}</TableCell>
              <TableCell class="wk-flex wk-gap-2 wk-justify-end">
                <Button size="icon">
                  <Edit />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger as-child>
                    <Button size="icon"><Trash /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogHeader> Delete workspace </AlertDialogHeader>
                      <AlertDialogDescription>
                        Are you sure you want to delete this workspace?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction @click="deleteWorkspace(workspace.id)">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
