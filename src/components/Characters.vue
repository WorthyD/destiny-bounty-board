<script setup lang="ts">
import { useDestinyUser } from '@/composable/useDestinyUser';
import Character from './Character.vue';
const { getDestinyCharacters, characters } = useDestinyUser();
await getDestinyCharacters();
</script>

<template>
  <h1>Characters</h1>
  <div v-for="character in characters" :key="character.membershipId">
    <Character :character="character"/>
  </div>
</template>

<style scoped></style>
