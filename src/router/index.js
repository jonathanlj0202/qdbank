import Vue from "vue";
import VueRouter from "vue-router";
import ViewBox from "../views/ViewBox.vue";
import View1 from "../views/View1.vue";
import View2 from "../views/View2.vue";
import View3 from "../views/View3.vue";
import Bview1 from "../views/Bview1.vue";
import Bview2 from "../views/Bview2.vue";
import Bview3 from "../views/Bview3.vue";
import Bview4 from "../views/Bview4.vue";
import Notfound from "../views/Notfound.vue";
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
  path: '/bview1',
  name: 'Bview1',
  component: Bview1
}, {
  path: '/bview2',
  name: 'Bview2',
  component: Bview2
}, {
  path: '/bview3',
  name: 'Bview3',
  component: Bview3
}, {
  path: '/bview4',
  name: 'Bview4',
  component: Bview4
}, {
  path: '/notfound',
  name: 'NotFound',
  component: Notfound
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