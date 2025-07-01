<script setup lang="ts">
import { MenuButton, Menu, MenuItems } from "@headlessui/vue";

const navigation = getNavigation("home");
const user = useSupabaseUser();

const profile_navigation = [
  { name: "Inbox" },
];

// Function to get user initials from email or name
const userInitials = computed(() => {
  const metadata = user.value?.user_metadata;
  // Try to get name first, fallback to email
  const displayName = metadata?.full_name || user.value?.email || '';
  
  // Get initials (up to 2 characters)
  return displayName
    .split(/\s+/)  // Split by whitespace
    .map(word => word.charAt(0).toUpperCase())  // Get first char of each word
    .slice(0, 2)   // Take first two
    .join('');     // Join them together
});

const logout = async () => {
  await useLogout();
};
</script>

<template>
  <Menu as="div" class="relative ml-3">
    <div>
      <MenuButton
        class="flex rounded-full bg-blue-600 text-sm focus:outline-none h-8 w-8 items-center justify-center"
      >
        <span class="sr-only">Open user menu</span>
        <span class="text-white font-medium">{{ userInitials }}</span>
      </MenuButton>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <NuxtLink
          v-for="item in profile_navigation"
          :to="{ name: item.name }"
          :key="item.name"
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          :class="[
            item.name === $route.name ? 'bg-gray-100' : '',
            'block px-4 py-2 text-sm text-gray-700',
          ]"
          role="menuitem"
          >{{ item.name }}</NuxtLink
        >
        <div
          class="block px-4 py-2 text-sm text-gray-700 hover:bg-red-700 hover:text-white cursor-pointer"
          @click="logout"
        >
          Logout
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
