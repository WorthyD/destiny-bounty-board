<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { useManifest } from '@/composable/useManifest';
import { useManifestStore } from '@/stores/manifest';
import { useAuthentication } from '@/composable/useAuthentication';
import LoginView from './views/LoginView.vue';
const loading = ref(true);
const isUserLoggedIn = ref(false);
const { loadManifest } = useManifest();
const { updateManifest } = useManifestStore();
const { isLoggedIn } = useAuthentication();

loadManifest().then((manifest) => {
  console.log('MANIFEST', manifest);
  updateManifest(manifest.data);
  // TODO: Show hide loading indicator
  loading.value = false;
});

isLoggedIn().then((result) => {
  isUserLoggedIn.value = result;
});
</script>

<template>
  <div v-if="loading === false">
    <header>
      <div v-if="isUserLoggedIn === true">
        <div class="wrapper">
          <HelloWorld msg="You did it!" />

          <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
          </nav>
        </div>
      </div>
      <div v-else>
        <LoginView />
      </div>
    </header>
    <RouterView />
  </div>
  <div v-else>Loading</div>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
