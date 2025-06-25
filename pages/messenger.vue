<script lang="ts" setup>
definePageMeta({
  title: 'Messenger',
  name: 'Messenger',
  path: '/messenger',
});

const toastStore = useToastStore();

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

// Sample data for the table
const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john.doe@example.com',
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
  },
  {
    firstName: 'Robert',
    lastName: 'Johnson',
    username: 'rjohnson',
    email: 'robert.j@example.com',
  },
  {
    firstName: 'Emily',
    lastName: 'Brown',
    username: 'emilybr',
    email: 'emily.brown@example.com',
  },
];

async function submitForm() {
  toastStore.showSuccessToast({
    title: 'contact.success',
  });
}

const whoAmI = async () => {
  const response = await useListUsers();
  console.log(response.value);
};
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
      <button
        @click="whoAmI"
        type="button"
        class="rounded-md bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
      >
        Test Self Endpoint (see console)
      </button>

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
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
