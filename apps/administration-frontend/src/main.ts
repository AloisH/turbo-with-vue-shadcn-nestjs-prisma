import "./assets/index.css";
import "@heloir/ui/styles.css";
import "@heloir/frontend-workspace/style.css";
import "@heloir/frontend-login/style.css";

import { createApp } from "vue";
import App from "./app.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
