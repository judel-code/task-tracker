import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import TaskView from "../views/TaskView";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/task/:taskId",
    name: "Task",
    component: TaskView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
