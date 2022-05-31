const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("src/pages/Login.vue") }],
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
        component: () => import("src/pages/Index.vue"),
      },
    ],
  },
];

export default routes;
