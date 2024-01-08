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
    component: () => import("layouts/MainTeste.vue"),
    children: [
      {
        path: "teste",
        name: "teste",
        component: () => import("src/pages/teste.vue"),
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
        token: "",
        component: () => import("src/pages/Index.vue"),
      },
      {
        path: "exp",
        name: "exp",
        component: () => import("src/pages/expprod.vue"),
      },
      {
        path: "pro",
        name: "pro",
        component: () => import("src/pages/prodconf.vue"),
      },

      {
        path: "rec",
        name: "rec",
        component: () => import("src/pages/expreceb.vue"),
      },
      {
        path: "ind",
        name: "ind",
        component: () => import("src/pages/indic.vue"),
      },
      {
        path: "ven",
        name: "ven",
        component: () => import("src/pages/expvenda.vue"),
      },
      {
        path: "lei",
        name: "lei",
        component: () => import("src/pages/expleit.vue"),
      },
      {
        path: "cat",
        name: "cat",
        component: () => import("src/pages/ErrorNotFound.vue"),
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
