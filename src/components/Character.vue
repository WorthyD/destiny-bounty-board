<template>
  <div>
    <h2>Character</h2>
    <div>
      {{ character }}
    </div>
    <hr />
  </div>
</template>
<script setup lang="ts">
interface Props {
  character: any;
}
const props = defineProps<Props>();
</script>
