import { CONFIG } from '@/config';
import type { AuthInfo } from '@/interfaces/auth-info';
import { getRandomString } from '@/utils/getRandomString';
import axios from 'axios';
import { ref, computed } from 'vue';
import type { Token } from '../interfaces/token';

export function useAuthentication() {
  //  const axios: any = inject('axios');
  const STATE_KEY = 'AUTH_STATE';
  const AUTH_KEY = 'bounty-board__auth-key';
  const authUrl = 'https://www.bungie.net/en/oauth/authorize';
  const tokenUrl = 'https://www.bungie.net/platform/app/oauth/token/';
  const token = ref<Token | null>(null);
  const authInfo = ref<AuthInfo | null>(null);

  function redirectToLogin() {
    const authState: string = getRandomString(10);
    localStorage.setItem(STATE_KEY, authState);
    const url: string = `${authUrl}?client_id=${CONFIG.CLIENT_ID}&response_type=code&state=${authState}`;
    window.location.href = url;
  }

  function getHeaders() {
    return {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //'content-type': 'application/json; charset=utf8',
      'x-api-key': CONFIG.BUNGIE_API_KEY,
      authorization: `Basic ${btoa(
        `${CONFIG.CLIENT_ID}:${CONFIG.CLIENT_SECRET}`
      )}`
    };
  }

  function addTokenTimestamps(t: Token) {
    t.creation = new Date().getTime();
    t.expiration = t.expires_in * 1000 + t.creation;
    t.refreshExpiration = t.refresh_expires_in * 1000 + t.creation;
    return t;
  }

  function isTokenValid() {
    const now: number = new Date().getTime();
    const xp = token?.value?.expiration || 0;
    return now < xp;
  }
  function isRefreshTokenValid() {
    const now: number = new Date().getTime();
    const xp = token?.value?.refreshExpiration || 0;
    return now < xp;
  }
  function signOut() {
    localStorage.removeItem(AUTH_KEY);
    token.value = null;
    update();
  }

  function getToken(): Promise<Token | null> {
    return new Promise((resolve, reject) => {
      let loadedFromLocal = false;
      if (token.value === null || token.value === undefined) {
        token.value = getTokenFromLocalStorage();
        loadedFromLocal = true;
      }
      if (token.value) {
        if (isTokenValid()) {
          if (loadedFromLocal) {
            saveToken(token.value);
          }
          return resolve(token.value);
        }

        if (isRefreshTokenValid()) {
          return getRefreshTokenFromAPI();
        }

        // TODO: Refresh token?
        throw new Error('Invalid token signing out');
        signOut();
      }

      return resolve(null);
    });
  }
  function getRefreshTokenFromAPI(): Promise<Token> {
    const refreshToken = token?.value?.refresh_token;

    return axios({
      method: 'post',
      headers: getHeaders(),
      url: tokenUrl,
      data: `grant_type=refresh_token&client_id=${CONFIG.CLIENT_ID}&refresh_token=${refreshToken}`
    }).then((response) => {
      const result = response.data;
      saveToken(result, true);
      return result as Token;
    });
  }

  function getTokenFromLocalStorage(): Token | null {
    try {
      const storedToken = localStorage.getItem(AUTH_KEY);
      if (storedToken) {
        return JSON.parse(storedToken);
      }
    } catch (error) {
      localStorage.removeItem(AUTH_KEY);
    }
    return null;
  }

  function getTokenFromAPI(code: string, state: string): Promise<any> {
    const storedState: string = localStorage.getItem(STATE_KEY) || '';
    if (storedState !== '' && storedState !== state) {
      localStorage.removeItem(STATE_KEY);
      throw new Error('Stored state did not match query string state');
    }

    return axios({
      method: 'post',
      headers: getHeaders(),
      url: tokenUrl,
      data: `grant_type=authorization_code&client_id=${CONFIG.CLIENT_ID}&code=${code}`
    }).then((response) => {
      const result = response.data;
      saveToken(result, true);
      return true;
    });
  }

  function saveToken(newToken: Token, addTimeStamps: boolean = false) {
    if (addTimeStamps) {
      newToken = addTokenTimestamps(newToken);
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify(newToken));
    token.value = newToken;
    update();
  }

  function update() {
    if (token.value) {
      const newAuthInfo: AuthInfo = {
        accessToken: token.value.access_token,
        memberId: token.value.membership_id
      };
      authInfo.value = newAuthInfo;
    } else {
      authInfo.value = null;
    }
  }

  function isLoggedIn(): Promise<boolean> {
    return getToken().then((token) => {
      return token !== null;
    });
  }

  function getAuthInfo(): Promise<AuthInfo> {
    return getToken().then((token) => {
      if (token.value) {
        return {
          accessToken: token.value.access_token,
          memberId: token.value.membership_id
        };
      }
      return undefined;
    });
  }

  return {
    redirectToLogin,
    getTokenFromAPI,
    isLoggedIn,
    getToken,
    getAuthInfo
    //token: computed(() => token.value)
  };
}
