<script setup lang="ts">
const toastStore = useToastStore();
const toast = useToast();
</script>

<template>
  <div class="relative flex flex-col justify-center items-center">
    <!-- spotlight -->
    <div class="absolute rounded-full -z-1 bg-white/25 blur-[120px] lg:blur-[300px] inset-0"></div>

    <h1 class="text-center font-display text-3xl font-light leading-tight lg:text-5xl">
      <span>
        {{ $t("home.hero.header") }}
      </span>
      <br />
    </h1>
    <h2 class="mt-4 max-w-xl mx-auto text-center text-lg font-light text-black/60 dark:text-white/60">
      {{ $t("home.hero.subtitle") }}
    </h2>
    <HomeCircleSystem />
    <div class="flex gap-4 mt-6 z-10">
      <NuxtLink to="/signup">
        <UButton>
          {{ $t("home.hero.cta") }}
        </UButton>
      </NuxtLink>
      <UButton
        variant="soft"
        @click="toast.add({ title: $t('home.test_toast'), description: $t('home.test_toast_description'), timeout: 1500, icon: 'i-heroicons-check-circle' })"
      >
        {{ $t("home.test") }}
      </UButton>
    </div>
  </div>
</template>
