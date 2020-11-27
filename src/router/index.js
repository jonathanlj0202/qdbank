import Vue from "vue";
import VueRouter from "vue-router";
import ViewBox from "../views/ViewBox.vue";
import View1 from "../views/View1.vue";
import View2 from "../views/View2.vue";
import View3 from "../views/View3.vue";
import View4 from "../views/View4.vue";
import Notfound from "../views/Notfound.vue";
import { getbranches } from "../api";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "ViewBox",
    component: ViewBox,
    children: [{
      path: "/",
      components: {
        v1: View1,
        v2: View2,
        v3: View3,
        v4: View4
      }
    }]
  }, {
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

router.beforeEach((to, from, next) => {
  if (window.MAC) {
    getbranches({
      terminal_no: window.MAC
    }).then((res) => {
      if (res.data) {
        let expireBoo = false;
        if (new Date().getTime() > new Date(res.data.terminaltime).getTime()) {
          expireBoo = true;
        }
        if (expireBoo && to.path !== "/notfound") {
          next("/notfound");
        } else if (!expireBoo && to.path === "/notfound") {
          next("/");
        } else {
          next();
        }
      } else {
        if (to.path !== "/notfound") {
          next("/notfound");
        } else {
          next();
        }
      }
    });
  } else {
    next();
  }
})


export default router;
