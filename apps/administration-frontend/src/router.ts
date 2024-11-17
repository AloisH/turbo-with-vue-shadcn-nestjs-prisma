import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Navbar from "./components/Navbar.vue";
import { WorkspacePage } from "@heloir/frontend-workspace";
import { LoginPage } from "@heloir/frontend-login";

const routes: RouteRecordRaw[] = [
  { path: "/login", component: LoginPage },
  {
    children: [
      { path: "/workspace", component: WorkspacePage, name: "Workspace" },
    ],
    path: "/",
    component: Navbar,
    name: "Home",
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
