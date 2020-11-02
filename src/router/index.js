import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/trend",
    name: "Trend",
    component: () => import("@/views/TrendPage.vue"),
  },
  {
    path: "/map",
    name: "Map",
    component: () => import("@/views/MapPage.vue"),
  },
  {
    path: "/seller",
    name: "Seller",
    component: () => import("@/views/SellerPage.vue"),
  },
  {
    path: "/rank",
    name: "Rank",
    component: () => import("@/views/RankPage.vue"),
  },
  {
    path: "/",
    name: "Hot",
    component: () => import("@/views/HotPage.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
