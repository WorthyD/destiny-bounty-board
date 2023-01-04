import type { App, Ref, ref } from "vue";

// import Vue from 'vue';
// import axios from 'axios';
// import VueAxios from 'vue-axios';
// import { getRandomString } from '@/utils/getRandomString';

const STATE_KEY = "AUTH_STATE";
const authUrl = "https://www.bungie.net/en/oauth/authorize";

// export const ApiService = {
//   init() {
//     Vue.use(VueAxios, axios);
//     Vue.axios.defaults.baseURL = '';
//   },
//   redirectToLogin() {
//     const authState: string = getRandomString(10);
//     localStorage.setItem(STATE_KEY, authState);
//     const url: string = `${authUrl}?client_id=${this.clientId}&response_type=code&state=${authState}`;
//     window.location.href = url;
//   }
// };
export const client: Ref<AuthServicePlugin | null> = ref(null);

export class AuthServicePlugin {
  readonly authUrl = "https://www.bungie.net/en/oauth/authorize";
  readonly tokenUrl = "https://www.bungie.net/platform/app/oauth/token/";
  constructor() {
    console.log("constructing");
  }
  install(app: App) {
    console.log("installing app");
  }
}

export function createAuthService() {
  return new AuthServicePlugin();
}
