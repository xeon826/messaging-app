<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div>
    <LayoutNavbar />
    <main>
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>

