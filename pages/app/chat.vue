<script setup lang="ts">
import { generateName } from '~/utils/string';
import { navigateTo } from '#imports';
definePageMeta({
  title: 'Chat',
  name: 'Chat',
  // Add middleware to ensure authentication
  middleware: ['auth'],
  layout: 'default',
  pageTransition: {
    name: 'modal'
  },
  // Add these properties to handle modal behavior
  keepalive: true,
  modal: true
});
let ws: WebSocket | undefined;

const message = ref<string>("");
const messages = useState<{ id: number, user: string, message: string, created_at: string }[]>(() => []);

const userId = useCookie<string>("userId")

const user = useSupabaseUser();
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

const username = computed(() => {
  return user.value?.user_metadata.user_name;
});

if (!userId.value) {
  userId.value = generateName();
}

if (!messages.value.length) {
  const res = await $fetch("/api/messages")
  messages.value.push(...res.messages)
}

const log = (user: string, ...args: string[]) => {
  console.log("[ws]", user, ...args);
  messages.value.push({
    id: 0,
    message: args.join(" "),
    user: user,
    created_at: new Date().toLocaleString(),
  });
  scroll();
};

const connect = async () => {
  const isSecure = location.protocol === "https:";
  console.log('user initials', userInitials)
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/chat-ws?userId=" + encodeURIComponent(username.value) + '&receiverId=' + 'thereceiverid';
  if (ws) {
    log("ws", "Closing previous connection before reconnecting...");
    ws.close();
    clear();
  }

  log("ws", "Connecting to", url, "...");
  ws = new WebSocket(url);

  ws.addEventListener("message", (event) => {
    const { user = "system", message = "" } = event.data.startsWith("{")
      ? JSON.parse(event.data)
      : { message: event.data };
    log(
      user,
      typeof message === "string" ? message : JSON.stringify(message),
    );
  });

  await new Promise((resolve) => ws!.addEventListener("open", resolve));
  log("ws", "Connected!");
};

const clear = () => {
  messages.value.splice(0, messages.value.length);
  log("system", "previous messages cleared");
};

const scroll = () => {
  nextTick(() => {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
}

const send = () => {
  console.log("sending message...");
  if (message.value) {
    ws!.send(message.value);
  }
  message.value = "";
};

const ping = () => {
  log("ws", "Sending ping");
  ws!.send("ping");
};

onMounted(() => {
  connect();
  scroll();
  
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigateTo('/app/messenger');
    }
  };
  window.addEventListener('keydown', handleEsc);
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEsc);
  });
});

useServerHead({
  title: "Nuxt Chat",
})
</script>

<template>
  <div class="modal-container fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="modal-content bg-slate-900 w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden relative flex flex-col">
      <!-- Close button -->
      <button @click="navigateTo('/app/messenger')" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Messages section -->
      <div id="messages" class="flex-1 overflow-y-auto px-4 pt-8">
        <div class="flex items-center mb-4" v-for="message in messages" :key="message.id">
          <div class="flex flex-col">
            <p class="text-gray-500 mb-1 text-xs ml-10">{{ message.user }}</p>
            <div class="flex items-center">
              <img :src="'https://www.gravatar.com/avatar/' + encodeURIComponent(message.user) + '?s=512&d=monsterid'"
                alt="Avatar" class="w-8 h-8 rounded-full" />
              <div class="ml-2 bg-gray-800 rounded-lg p-2">
                <p class="text-white">{{ message.message }}</p>
              </div>
            </div>
            <p class="text-gray-500 mt-1 text-xs ml-10">{{ message.created_at }}</p>
          </div>
        </div>
      </div>

      <!-- Input section -->
      <div class="bg-gray-800 px-4 py-2 mt-auto">
        <div class="flex flex-col sm:flex-row gap-2">
          <div class="flex-1">
            <input type="text" placeholder="Type your message..."
              class="w-full rounded-lg px-4 py-2 bg-gray-700 text-white focus:outline-none focus:ring focus:border-blue-300"
              @keydown.enter="send" v-model="message" />
          </div>
          <div class="flex gap-1">
            <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex-1" @click="send">
              Send
            </button>
            <button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex-1" @click="clear">
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  backdrop-filter: blur(4px);
}

.modal-content {
  animation: modal-in 0.3s ease-out;
}

#messages {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

#messages::-webkit-scrollbar {
  width: 6px;
}

#messages::-webkit-scrollbar-track {
  background: transparent;
}

#messages::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
