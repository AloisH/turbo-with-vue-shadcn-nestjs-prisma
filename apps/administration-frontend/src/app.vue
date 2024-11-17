<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

// Ensure that the color mode is set correctly
useColorMode();
</script>

<template>
  <RouterView></RouterView>
</template>
