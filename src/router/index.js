import Vue from "vue";
import VueRouter from "vue-router";
import ViewBox from "../views/1920/ViewBox.vue";
import View1 from "../views/1920/View1.vue";
import View2 from "../views/1920/View2.vue";
import View3 from "../views/1920/View3.vue";
import ViewBox1 from "../views/1080/ViewBox.vue";
import View11 from "../views/1080/View1.vue";
import View21 from "../views/1080/View2.vue";
import View31 from "../views/1080/View3.vue";
import Notfound from "../views/Notfound.vue";
import NotPermissions from "../views/NotPermissions.vue";
import {
  getbranches
} from "../api";


Vue.use(VueRouter);

const routes = [{
  path: "/",
  name: "ViewBox",
  component: ViewBox,
  children: [{
    path: "/",
    components: {
      v1: View1,
      v2: View2,
      v3: View3
    }
  }]
}, {
  path: "/1080",
  name: "ViewBox",
  component: ViewBox1,
  children: [{
    path: "/",
    components: {
      v1: View11,
      v2: View21,
      v3: View31
    }
  }]
}, {
  path: '/notfound',
  name: 'NotFound',
  component: Notfound
}, {
  path: '/notpermissions',
  name: 'NotPermissions',
  component: NotPermissions
}];

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
        if (expireBoo && to.path !== "/notpermissions") {
          next("/notpermissions");
        } else if (!expireBoo && (to.path === "/notpermissions" || to.path === "/notfound")) {
          next("/");
        } else {
          next();
        }
      } else {
        if (to.path !== "/notpermissions" && to.path !== "/notfound") {
          next("/notpermissions");
        } else {
          next();
        }
      }
    }).catch(() => {
      if (to.path !== "/notfound") {
        next("/notfound");
      } else {
        next();
      }
    });
  } else {
    next();
  }
})


export default router;