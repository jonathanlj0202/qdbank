import Vue from "vue";
import VueRouter from "vue-router";
import View1 from "../views/View1.vue";
import View2 from "../views/View2.vue";
import View3 from "../views/View3.vue";
import View4 from "../views/View4.vue";
import Notfound from "../views/Notfound.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    components: {
      v1: View1,
      v2: View2,
      v3: View3,
      v4: View4
    }
  },{
    path: '/notfound',
    name: 'NotFound',
    component: Notfound
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

export default router;
