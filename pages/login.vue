<script setup lang="ts">
import { useSupabaseClient, useSupabaseUser } from '#imports'

definePageMeta({
  name: "Login",
  title: "Login",
  description: "Login to your account",
});

const login = ref("");
const password = ref("");
const error = ref<string | null>(null);
const emailConfirmationSuccess = ref(false);

const client = useSupabaseClient();
const user = useSupabaseUser();
const loading = ref(false);

// Check for email confirmation success query parameter
const route = useRoute();
if (route.query.email_confirmation === 'success') {
  emailConfirmationSuccess.value = true;
}

// Add debug logging for initial state
console.log('Initial auth state:', { user: user.value, client });

// Redirect if already logged in
watchEffect(() => {
  console.log('watchEffect triggered, user:', user.value);
  if (user.value) {
    navigateTo("/app/messenger");
  }
});

const signin = async (event: Event) => {
  // Add form submission debugging
  console.log('Sign in attempted', { login: login.value });
  
  try {
    error.value = null;
    loading.value = true;
    
    if (!login.value || !password.value) {
      error.value = "Please fill in all fields";
      return;
    }

    console.log('Attempting to sign in with Supabase...');
    const { data, error: authError } = await client.auth.signInWithPassword({
      email: login.value,
      password: password.value,
    });

    console.log('Sign in response:', { data, error: authError });

    if (authError) {
      error.value = authError.message;
      return;
    }

    if (data?.user) {
      console.log('Sign in successful, user:', data.user);
      // Clear form
      login.value = "";
      password.value = "";
      // Navigation will be handled by the watchEffect
    }
  } catch (e) {
    console.error('Sign in error:', e);
    error.value = "An unexpected error occurred";
  } finally {
    loading.value = false;
  }
};

const signWithGithub = async () => {
  console.log('GitHub sign in attempted');
  try {
    error.value = null;
    const { error: authError } = await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/app/messenger`,
      },
    });

    console.log('GitHub auth response:', { error: authError });
    if (authError) {
      error.value = authError.message;
    }
  } catch (e) {
    console.error('GitHub sign in error:', e);
    error.value = "Failed to sign in with Github";
  }
};

const signWithGoogle = async () => {
  console.log('Google sign in attempted');
  try {
    error.value = null;
    const { error: authError } = await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/app/profile`,
      },
    });

    console.log('Google auth response:', { error: authError });
    if (authError) {
      error.value = authError.message;
    }
  } catch (e) {
    console.error('Google sign in error:', e);
    error.value = "Failed to sign in with Google";
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <img
        class="mx-auto h-12 w-auto"
        src="../assets/logo/logo.webp"
        alt="Messaging App"
      />
      <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-primary">
        Sign in to your account
      </h2>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md mt-12">
      <!-- Email Confirmation Success Alert -->
      <div v-if="emailConfirmationSuccess" class="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
        <p class="font-medium">Email confirmation sent!</p>
        <p class="text-sm">Please check your email to confirm your account before signing in.</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <div v-if="loading" class="text-center">
        <p>Loading...</p>
      </div>
      <form v-else class="space-y-6" @submit.prevent="signin">
        <div>
          <div class="mt-1">
            <input
              id="login"
              name="login"
              type="email"
              autocomplete="email"
              required
              placeholder="Email"
              class="input w-full"
              v-model="login"
            />
          </div>
        </div>
        <div>
          <div class="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              placeholder="Password"
              class="input w-full"
              v-model="password"
            />
          </div>
        </div>


        <div>
          <button 
            type="submit" 
            class="w-full btn-primary"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      <NuxtLink :to="{ name: 'Signup' }" class="block w-full btn-secondary mt-6 text-center">
        Don't have an account? Sign up
      </NuxtLink>
    </div>
  </div>
</template>

