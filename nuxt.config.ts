export default defineNuxtConfig({
  app: {
    layoutTransition: {
      name: "fade",
      mode: "out-in",
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  routeRules: {
    "/": { isr: true, prerender: true },
  },

  css: ["~/assets/style/main.scss"],

  imports: {
    dirs: ["store"],
  },

  devtools: { enabled: true },

  devServer: {
    port: 3000
  },

  runtimeConfig: {
    private: {
      resendApiKey: process.env.RESEND_API_KEY,
    },
  },

  modules: [
    "@pinia/nuxt",
    "nuxt-headlessui",
    "@vueuse/nuxt",
    "@nuxtjs/i18n",
    "@nuxthq/ui",
    "nuxt-svgo",
    "@nuxt/image",
    "@nuxtjs/supabase",
  ],

  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/signup"],
    },
  },

  colorMode: {
    preference: "system",
    fallback: "dark",
    storageKey: "nuxt-starter-color-mode",
  },

  i18n: {
    strategy: "no_prefix",
    detectBrowserLanguage: {
      alwaysRedirect: true,
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      {
        code: "en",
        iso: "en-US",
      },
      {
        code: "fr",
        iso: "fr-FR",
      },
    ],
    baseUrl: "http://localhost:3000",
    vueI18n: "~/i18n.config.ts",
  },

  image: {
    dir: "assets"
  },

  nitro: {
    experimental: {
      websocket: true,
      tasks: true,
      database: true,
    },
    prerender: {
      crawlLinks: true,
      routes: ["/sitemap.xml"],
    },
  },
  $production: {
    nitro: {
      database: {
        default: {
          connector: "bun",
        },
      },
    },
  },
  svgo: {
    autoImportPath: "./assets/logo/",
  },

  plugins: [
    { src: "~/plugins/vercel.ts", mode: "client" }
  ],
});
