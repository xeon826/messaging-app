<script lang="ts" setup>
definePageMeta({
  title: 'Inbox',
  name: 'Inbox',
  // Add middleware to ensure authentication
  middleware: ['auth'],
  layout: 'default',
});

const toastStore = useToastStore();
const isLoading = ref(true);
const user = useSupabaseUser();
const unreadMessages = ref([]);
const unreadMessageData = ref(null);
const router = useRouter();
const route = useRoute();

// Formatting function
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  }).format(date);
}

// Load unread messages with error handling
const loadUnreadMessages = async () => {
  console.log('Loading unread messages, current auth state:', {
    user: user.value,
  });

  try {
    isLoading.value = true;
    const response = await useLoadUnreadMessages();

    if (!response.value) {
      throw new Error('No data received from useLoadUnreadMessages');
    }

    // Store the users directly since we're now returning the array
    unreadMessages.value = response.value.map((message) => ({
      ...message,
      formattedCreatedAt: formatDate(message.createdAt),
    }));
    unreadMessageData.value = unreadMessages.value;
  } catch (error) {
    console.error('Error fetching unread message data:', error);
    toastStore.showErrorToast({
      title: 'Error',
      message: 'Failed to load message data. Please try again.',
    });
    unreadMessages.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Add watch effect to reload data when auth state changes
watchEffect(() => {
  if (user.value) {
    console.log('Auth state changed, reloading users');
    loadUnreadMessages();
  }
});

// Modified to handle both initial load and subsequent refreshes
onMounted(() => {
  console.log('Component mounted, checking auth state');
  if (user.value) {
    loadUnreadMessages();
  }
});
console.log('the unread messages', unreadMessages);
</script>

<template>
  <div
    class="relative h-full flex flex-col gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16"
  >
    <!-- grid background -->
    <div
      class="pointer-events-none absolute inset-0 bg-center bg-grid-black/10 dark:bg-grid-white/5 bg-grid-14 [mask-image:radial-gradient(white,transparent_80%)]"
    ></div>

    <div class="px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <h2 class="text-4xl text-center font-bold mb-6">
        {{ $t('inbox.title') }}
      </h2>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"
        ></div>
        <p class="mt-4">{{ $t('inbox.loading') }}</p>
      </div>

      <!-- Error state -->
      <div v-else-if="!unreadMessages.length" class="text-center py-8">
        <p class="text-gray-500">{{ $t('inbox.no_unread_messages') }}</p>
        <button
          @click="loadUnreadMessages"
          class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          {{ $t('inbox.retry') }}
        </button>
      </div>

      <!-- Content - only shown after data is loaded -->
      <template v-else>
        <!-- Table -->
        <div class="max-w-[900px] mx-auto mt-8">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold">
                  Message
                </th>
                <th class="px-6 py-3 text-left text-sm font-semibold">
                  Sent At
                </th>
                <th class="px-6 py-3 text-left text-sm font-semibold">User</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="unreadMessage in unreadMessages"
                :key="unreadMessage.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                @click="navigateToChat(unreadMessage.sender)"
              >
                <td class="truncate-text px-6 py-4 text-sm">{{ unreadMessage.message }}</td>
                <td class="px-6 py-4 text-sm">
                  {{ unreadMessage.formattedCreatedAt }}
                </td>
                <td class="px-6 py-4 text-sm">
                  {{ unreadMessage.sender.username }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.truncate-text {
  max-width: 100px; /* Adjust the width as needed */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
