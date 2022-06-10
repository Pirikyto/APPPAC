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
        path: "home",
        name: "home",
        component: () => import("src/pages/Index.vue"),
      },
      {
        path: "pac",
        name: "pac",
        component: () => import("src/pages/pac.vue"),
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
