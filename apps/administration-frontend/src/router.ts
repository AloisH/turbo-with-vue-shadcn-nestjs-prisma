import { createRouter, createWebHistory } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { LoginPage } from "@heloir/frontend-login";

const routes = [
  { path: "/login", component: LoginPage },
  { path: "/", component: Navbar },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
