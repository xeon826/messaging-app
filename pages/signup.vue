<script setup lang="ts">
definePageMeta({
  name: "Signup",
  title: "Signup",
  description: "Sign up for your account",
});

const { auth } = useSupabaseClient();
const user = useSupabaseUser();

const username = ref("");
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const password = ref("");
const passwordConfirm = ref("");

const loading = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

watchEffect(async () => {
  if (user.value) {
    await navigateTo("/app/messenger");
  }
});

const signup = async () => {
  try {
    error.value = null;
    loading.value = true;

    // Validate all fields
    if (!username.value || !firstname.value || !lastname.value || !email.value || !password.value || !passwordConfirm.value) {
      error.value = "Please fill in all fields";
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
      error.value = "Please enter a valid email address";
      return;
    }

    // Validate passwords match
    if (password.value !== passwordConfirm.value) {
      error.value = "Passwords do not match";
      return;
    }

    // Validate password strength
    if (password.value.length < 6) {
      error.value = "Password must be at least 6 characters long";
      return;
    }

    const { error: signupError, data } = await auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          user_name: username.value,
          full_name: firstname.value + " " + lastname.value,
        },
      },
    });

    if (signupError) {
      error.value = signupError.message;
      return;
    }

    // If signup successful, show success state and redirect
    if (data?.user) {
      success.value = true;
      // Keep loading state true to prevent UI flickering
      setTimeout(async () => {
        await navigateTo("/login?email_confirmation=success");
      }, 1500); // Short delay to show success message
    }
  } catch (err) {
    console.error("Signup error:", err);
    error.value = "An unexpected error occurred during signup";
  } finally {
    if (!success.value) {
      loading.value = false;
    }
  }
};

const signWithGoogle = async () => {
  try {
    error.value = null;
    const { error: oauthError } = await auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app/messenger",
      },
    });
    if (oauthError) {
      error.value = oauthError.message;
    }
  } catch (err) {
    console.error("Google sign in error:", err);
    error.value = "Failed to sign in with Google";
  }
};

const signWithGithub = async () => {
  try {
    error.value = null;
    const { error: oauthError } = await auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/app/messenger",
      },
    });
    if (oauthError) {
      error.value = oauthError.message;
    }
  } catch (err) {
    console.error("GitHub sign in error:", err);
    error.value = "Failed to sign in with GitHub";
  }
};
</script>

<template>
  <div class="flex min-h-full flex-col justify-center py-12 px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-3xl font-bold tracking-tight text-primary"
      >
        Sign up for your account
      </h2>
    </div>
    <div class="sm:mx-auto sm:w-full sm:max-w-md mt-12">
      <!-- Error Alert -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
        {{ error }}
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
        <p class="font-medium">Signup successful!</p>
        <p class="text-sm">Redirecting you to login page...</p>
      </div>

      <Loader v-if="loading" />
      <form class="space-y-6" @submit.prevent="signup" v-else-if="!success">
        <input
          id="username"
          name="username"
          autocomplete="username"
          required
          placeholder="Username"
          class="input"
          v-model="username"
          :disabled="loading"
        />
        <div class="flex flex-row gap-2">
          <input
            id="firstname"
            name="firstname"
            autocomplete="firstname"
            required
            placeholder="Firstname"
            class="input"
            v-model="firstname"
            :disabled="loading"
          />
          <input
            id="lastname"
            name="lastname"
            autocomplete="lastname"
            required
            placeholder="Lastname"
            class="input"
            v-model="lastname"
            :disabled="loading"
          />
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          required
          placeholder="Email"
          class="input"
          v-model="email"
          :disabled="loading"
        />
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Password"
          class="input"
          v-model="password"
          :disabled="loading"
        />
        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="Confirm Password"
          class="input"
          v-model="passwordConfirm"
          :disabled="loading"
        />
        <div>
          <button
            type="submit"
            class="btn-primary w-full"
            :disabled="loading"
          >
            {{ loading ? 'Signing up...' : 'Sign up' }}
          </button>
        </div>
      </form>

      <!-- OAuth Sign-in Buttons -->
      <!-- <div class="mt-5"> -->
      <!--   <div class="relative"> -->
      <!--     <div class="absolute inset-0 flex items-center"> -->
      <!--       <div class="w-full border-t border-gray-300"></div> -->
      <!--     </div> -->
      <!--     <div class="relative flex justify-center text-sm"> -->
      <!--       <span class="px-2 bg-white text-gray-500">Or continue with</span> -->
      <!--     </div> -->
      <!--   </div> -->

      <!--   <div class="mt-6 grid grid-cols-2 gap-3"> -->
      <!--     <button -->
      <!--       @click="signWithGoogle" -->
      <!--       class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" -->
      <!--       :disabled="loading" -->
      <!--     > -->
      <!--       <span class="sr-only">Sign in with Google</span> -->
      <!--       Google -->
      <!--     </button> -->

      <!--     <button -->
      <!--       @click="signWithGithub" -->
      <!--       class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" -->
      <!--       :disabled="loading" -->
      <!--     > -->
      <!--       <span class="sr-only">Sign in with GitHub</span> -->
      <!--       GitHub -->
      <!--     </button> -->
      <!--   </div> -->
      <!-- </div> -->

      <NuxtLink :to="{ name: 'Login' }" class="block w-full btn-secondary mt-6 text-center">
        Already have an account? Login here
      </NuxtLink>
    </div>
  </div>
</template>

