<script lang="ts" setup>
definePageMeta({
  title: 'Messenger',
  name: 'Messenger',
  path: '/messenger',
});

const toastStore = useToastStore();
const isLoading = ref(true);
const userData = ref(null);

const demandTypes = [
  {
    label: 'contact.subject_types.project',
    value: 'project',
    color: 'bg-blue-500',
    button_color: 'blue',
  },
  {
    label: 'contact.subject_types.question',
    value: 'question',
    color: 'bg-yellow-500',
    button_color: 'yellow',
  },
  {
    label: 'contact.subject_types.bug',
    value: 'bug',
    color: 'bg-red-500',
    button_color: 'red',
  },
  {
    label: 'contact.subject_types.other',
    value: 'other',
    color: 'bg-gray-500',
    button_color: 'gray',
  },
];
const selected = ref(demandTypes[0]);
const message = ref('');

// Move users data to be populated from API
const users = ref([]);

async function submitForm() {
  toastStore.showSuccessToast({
    title: 'contact.success',
  });
}

// Modified to initialize data
const loadUsers = async () => {
  try {
    const response = await useListUsers();
    // Since response is already a ref, we can assign it directly to users
    users.value = response.value;
    userData.value = response.value;
  } catch (error) {
    console.error('Error fetching user data:', error);
    toastStore.showErrorToast({
      title: 'Error',
      message: 'Failed to load user data'
    });
  } finally {
    isLoading.value = false;
  }
};

// Call whoAmI immediately when component mounts
onMounted(() => {
  loadUsers();
});
</script>

<template>
  <div
    class="relative h-full flex flex-col gap-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16"
  >
    <!-- grid -->
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
              >
                <td class="px-6 py-4 text-sm">{{ user.firstName }}</td>
                <td class="px-6 py-4 text-sm">{{ user.lastName }}</td>
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
