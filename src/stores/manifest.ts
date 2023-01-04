import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useManifestStore = defineStore('manifest', () => {
  const manifest = ref(null);
  function updateManifest(manifestData: any) {
    console.log('', manifestData);
    manifest.value = manifestData;
  }
  return {
    manifest,
    updateManifest
  };
});
