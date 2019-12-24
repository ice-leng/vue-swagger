import Vue from "vue";
import App from "./App.vue";
import ElementUI, { Loading, Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import Axios from "axios";
import ServerConfig from "../public/config";

Vue.config.productionTip = false;

Vue.prototype.$http = Axios;
Axios.defaults.timeout = 30000;
Axios.defaults.baseURL = ServerConfig.baseUrl;

Axios.interceptors.request.use(
  config => {
    // 请求拦截器配置
    return config;
  },
  error => {
    // eslint-disable-next-line no-console
    console.log(error);
    return Promise.reject(error);
  }
);

Axios.interceptors.response.use(
  response => {
    Loading.service().close();
    return Promise.resolve(response).then(result => {
      Loading.service().close();
      if (result) {
        if (result.data.code === 0) {
          return result.data.data;
        } else {
          Message.warning(result.data.message);
        }
      }
      return false;
    });
  },
  error => {
    Loading.service().close();
    let message = "网路异常，请稍后再试";
    if (error) {
      message = error.message;
    }
    // eslint-disable-next-line no-console
    console.log(error);
    Message.error(message);
    return Promise.reject(error);
  }
);

Vue.use(ElementUI);

new Vue({
  render: h => h(App)
}).$mount("#app");
