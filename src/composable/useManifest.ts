import { nowPlusMinutes } from '@/utils/date-utils';
import { api } from '@/services/api';
import { get, set } from 'idb-keyval';

export function useManifest() {
  const MANIFEST_PATH_KEY = 'DBB_MANIFEST_PATH_KEY';
  const MANIFEST_PATH_EXP_KEY = 'DBB_MANIFEST_PATH_EXP_KEY';
  const MANIFEST_DATABASE_NAME = 'bounty-board-manifest';
  const VERSION = 'v1';

  function getManifestPathFromCache(language: string): Promise<any> {
    const jsonPath = window.localStorage.getItem(MANIFEST_PATH_KEY);
    const jsonPathExp = window.localStorage.getItem(MANIFEST_PATH_EXP_KEY);

    return new Promise((resolve, reject) => {
      if (jsonPathExp && jsonPath) {
        const jsonDate = new Date(jsonPathExp);
        if (jsonDate < nowPlusMinutes(-60)) {
          console.log(jsonPath);
          return resolve(jsonPath);
        }
      }

      return getManifestPath(language)
        .then((response) => {
          const x = response.jsonWorldContentPaths[language];

          window.localStorage.setItem(MANIFEST_PATH_KEY, x);
          window.localStorage.setItem(
            MANIFEST_PATH_EXP_KEY,
            new Date().toString()
          );
          return resolve(x || '');
        })
        .catch((err) => {
          console.log('error', err);
          reject(err);
        });


    });
  }
  function getManifestPath(language: string) {

    return api.getDestinyManifest();
  }
  function pruneTables(obj: any, keys: any) {
    if (!keys.length) {
      return obj;
    }

    return keys.reduce((acc: any, key: any) => {
      return {
        ...acc,
        [key]: obj[key]
      };
    }, {});
  }

  function requestDefinitionsArchive(dbPath: any, tableNames: any) {
    // TODO This takes about a second and a half to execute
    return get(MANIFEST_DATABASE_NAME).then((cachedValue) => {
      const versionKey = `${VERSION}:${dbPath}`;

      if (cachedValue) {
        return cachedValue;
      }

      return fetch(`https://www.bungie.net${dbPath}`).then((x) => {
        return x.json().then((y) => {
          const prunedTables = pruneTables(y, tableNames);
          const dbObject = { id: versionKey, data: prunedTables };
          set(MANIFEST_DATABASE_NAME, dbObject);


          return dbObject;
        });
      });
    });
  }

  function loadManifest() {
    console.log('loading manifest');
    return getManifestPathFromCache('en')
      .then((path) => {
        const tableNames = [
          'DestinyVendorDefinition',
          'DestinyVendorGroupDefinition',
          'DestinyInventoryItemDefinition'
        ];
        return requestDefinitionsArchive(path, tableNames);
      })
      .catch((e) => {
        console.log('error', e);
      });
  }

  return {
    loadManifest
  };
}
