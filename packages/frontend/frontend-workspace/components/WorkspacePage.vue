<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@heloir/ui/card';
import { Label } from '@heloir/ui/label';
import { Input } from '@heloir/ui/input';
import { Button } from '@heloir/ui/button';
import { Separator } from '@heloir/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@heloir/ui/table';
import { Edit, Plus, Trash } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { WorkspaceDto, WorkspaceService} from "@heloir/frontend-administration-api";
import axios from 'axios';

const workspaces = ref<WorkspaceDto[]>([]);
const workspaceService = new WorkspaceService(
  axios.create({
    baseURL: "http://localhost:62002",
  })
);


onMounted(async () => {
  const { data } = await workspaceService.getWorkspaces();
  workspaces.value = data;
});

</script>

<template>
  <div class="wk-m-4">
    <Card>
      <CardHeader>
        <CardTitle>
          Workspaces
        </CardTitle>
        <CardDescription>
          Create and edit workspaces
        </CardDescription>
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
                <Button size="icon"><Trash /></Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>
