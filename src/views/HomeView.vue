<template>
  <main>
    <!-- <TheWelcome /> -->
    <Suspense>
      <Characters />
    </Suspense>
  </main>
</template>
<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue';
import Characters from '../components/Characters.vue';
// import { useDestinyUser } from '@/composable/useDestinyUser';
// import { ref } from 'vue';
// const userRef = ref(null);
// const { getDestinyCharacters } = useDestinyUser();
// getDestinyCharacters().then((response: any) => {
//   console.log(response);
//   userRef.value = response;
// });
</script>
