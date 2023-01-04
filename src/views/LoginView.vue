<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>

          <button @click="login">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuthentication } from "@/composable/useAuthentication";

const { redirectToLogin } = useAuthentication();

const login = () => {
  console.log("logging in");
  redirectToLogin();
};
</script>
