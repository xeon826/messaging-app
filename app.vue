<script lang="ts" setup>
const { appName } = useAppConfig();
const user = useSupabaseUser();

// Watch for auth state changes
watchEffect(() => {
  // You can add global auth state handling here if needed
  console.log('Auth state changed:', user.value ? 'logged in' : 'logged out');
});

useHead({
  title: appName,
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "keywords", content: "Home" },
    { name: "description", content: "Nuxt Starter" },
  ],
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: "/favicon.ico",
    },
  ],
});

const toastStore = useToastStore();
const toast = computed(() => {
  return {
    show: toastStore.getShow,
    title: toastStore.getTitle,
    message: toastStore.getMessage,
    type: toastStore.getType,
    infos: toastStore.getInfos,
  };
});

useHead({
  title: "Messaging App - Message your friends!",
  meta: [
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "author", content: "Joshua Wilkeson" },
    { charset: "utf-8" },
    {
      name: "description",
      content: "Message your friends!",
    },
    {
      name: "keywords",
      content: "Nuxt, Starter, Resend, Bun, Tailwind, TypeScript, ESLint",
    },
    {
      property: "og:title",
      content: "Messaging App - Message your friends!",
    },
    {
      property: "og:url",
      content: "https://thejoshuatree.io/img/tree--white-blue-logo.webp",
    },
    {
      property: "og:description",
      content: "Start your next Nuxt project in seconds, with everything you need included",
    },
    {
      property: "og:image",
      content: "https://thejoshuatree.io/img/tree--white-blue-logo.webp",
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
    {
      property: "twitter:image",
      content: "https://thejoshuatree.io/img/tree--white-blue-logo.webp",
    },
    {
      property: "twitter:url",
      content: "https://thejoshuatree.io/img/tree--white-blue-logo.webp",
    },
    {
      property: "twitter:title",
      content: "Messaging App - Message your friends",
    },
    {
      property: "twitter:description",
      content: "Message your friends!",
    },
  ],
});
</script>

<template>
  <Html :lang="$i18n.locale">
    <ToastsBasic
      :show="toast.show"
      :title="toast.title"
      :description="toast.message"
      :type="toast.type"
      :infos="toast.infos"
      @close="toastStore.closeToast()"
    />
    <Body class="bg-white dark:bg-zinc-950">
      <LayoutCommandConsole />
      <LayoutScrollToTop />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <UNotifications />
    </Body>
  </Html>
</template>
