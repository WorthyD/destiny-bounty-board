<template>
  <div class="auth-page">
    <h2>Logging you in</h2>
  </div>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthentication } from '@/composable/useAuthentication';
const route = useRoute();
const { getTokenFromAPI } = useAuthentication();
console.log('query', route.query);

  getTokenFromAPI(route.query.code as string, route.query.state as string).then(() => {
    // TODO: Verify this works;
    window.location.href = '/';
  });

</script>
