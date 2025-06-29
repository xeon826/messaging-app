<script lang="ts" setup>

definePageMeta({
  title: 'Messenger',
  name: 'Messenger',
  // Add middleware to ensure authentication
  middleware: ['auth'],
  layout: 'default'
});

const toastStore = useToastStore();
const isLoading = ref(true);
const userData = ref(null);
const user = useSupabaseUser();
const message = ref('');
const users = ref([]);
const router = useRouter();

// Modified to include better error handling and debugging
const loadUsers = async () => {
  console.log('Loading users, current auth state:', { user: user.value });
  
  try {
    isLoading.value = true;
    const response = await useListUsers();
    console.log('User data response:', response.value);
    
    if (!response.value) {
      throw new Error('No data received from useListUsers');
    }
    
    // Store the users directly since we're now returning the array
    users.value = response.value;
    userData.value = response.value;
  } catch (error) {
    console.error('Error fetching user data:', error);
    toastStore.showErrorToast({
      title: 'Error',
      message: 'Failed to load user data. Please try again.'
    });
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Add watch effect to reload data when auth state changes
watchEffect(() => {
  if (user.value) {
    console.log('Auth state changed, reloading users');
    loadUsers();
  }
});

// Modified to handle both initial load and subsequent refreshes
onMounted(() => {
  console.log('Component mounted, checking auth state');
  if (user.value) {
    loadUsers();
  }
});

async function submitForm() {
  toastStore.showSuccessToast({
    title: 'contact.success',
  });
}

const navigateToChat = (user: any) => {
  // Navigate to chat with the selected user's ID
  router.push({
    path: '/app/chat',
    query: { 
      receiverId: user.id // Using username as the receiver ID
    }
  });
};

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
        {{ $t('messenger.title') }}
      </h2>

      <!-- Loading state -->
      <div v-if="isLoading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p class="mt-4">{{ $t('messenger.loading') }}</p>
      </div>

      <!-- Error state -->
      <div v-else-if="!users.length" class="text-center py-8">
        <p class="text-gray-500">{{ $t('messenger.no_users') }}</p>
        <button 
          @click="loadUsers" 
          class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          {{ $t('messenger.retry') }}
        </button>
      </div>

      <!-- Content - only shown after data is loaded -->
      <template v-else>
        <!-- Table -->
        <div class="max-w-[900px] mx-auto mt-8">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold">
                  First Name
                </th>
                <th class="px-6 py-3 text-left text-sm font-semibold">
                  Last Name
                </th>
                <th class="px-6 py-3 text-left text-sm font-semibold">
                  Username
                </th>
                <th class="px-6 py-3 text-left text-sm font-semibold">Email</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="user in users"
                :key="user.email"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                @click="navigateToChat(user)"
              >
                <td class="px-6 py-4 text-sm">{{ user.first_name }}</td>
                <td class="px-6 py-4 text-sm">{{ user.last_name }}</td>
                <td class="px-6 py-4 text-sm">{{ user.username }}</td>
                <td class="px-6 py-4 text-sm">{{ user.email }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
