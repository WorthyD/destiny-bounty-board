import axios from 'axios';
import { CONFIG } from '@/config';
import { useAuthentication } from '@/composable/useAuthentication';
import type { Token } from '../interfaces/token';
export class Api {
  basePath = 'https://www.bungie.net/Platform';
  constructor() {}
  private getHeaders() {
    return {
      'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
      //'content-type': 'application/json; charset=utf8',
      'x-api-key': CONFIG.BUNGIE_API_KEY
    };
  }
  private getAuthToken() {}

  getDestinyManifest() {
    return axios(`${this.basePath}/Destiny2/Manifest/`, {
      headers: this.getHeaders()
    }).then((response) => {
      return response.data.Response;
    });
  }
  getMembershipDataForCurrentUser() {
    const { getToken } = useAuthentication();

    return getToken().then((token) => {
      return axios(`${this.basePath}/User/GetMembershipsForCurrentUser`, {
        headers: {
          ...this.getHeaders(),
          Authorization: `Bearer ${token.access_token}`
        }
      }).then((response) => {
        return response.data.Response;
      });
    });
  }
  destiny2GetProfile(membershipInfo) {
    const { getToken } = useAuthentication();

    return getToken().then((token) => {
      return axios(`${this.basePath}/Destiny2/${membershipInfo.membershipType}/Profile/${membershipInfo.membershipId}/?components=100,200`, {
        headers: {
          ...this.getHeaders(),
          Authorization: `Bearer ${token.access_token}`
        }
      }).then((response) => {
        return response.data.Response;
      });
    });
  }
}
export const api = new Api();
