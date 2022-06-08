const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      {
        path: "",
        name: "loginDefault",
        component: () => import("src/pages/Login.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "me",
        name: "me",
        component: () => import("src/pages/Index.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/:catchAll(.*)*",
        name: "/:catchAll(.*)*",
        component: () => import("src/pages/ErrorNotFound.vue"),
      },
    ],
  },
];

export default routes;
