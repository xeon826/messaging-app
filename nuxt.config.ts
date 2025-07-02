export default defineNuxtConfig({
  alias: {
    ".prisma/client/index-browser":
      "/node_modules/.prisma/client/index-browser.js",
  },
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  auth: {
    cookie: {
      options: {
        httpOnly: true,
      },
    },
  },
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

  css: ["~/assets/style/main.scss"],

  imports: {
    dirs: ["store"],
  },

  devtools: { enabled: true },

  devServer: {
    port: 3000,
  },
  runtimeConfig: {
    // Server-side only
    supabaseKey: process.env.SUPABASE_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    nuxtSessionPassword: process.env.NUXT_SESSION_PASSWORD,

    public: {
      supabaseUrl: process.env.SUPABASE_URL,
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
    dir: "assets",
  },
  compatibilityDate: "2024-11-01",
  nitro: {
    preset: 'node-server',
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
  svgo: {
    autoImportPath: "./assets/logo/",
  },

  plugins: [
    { src: "~/plugins/vercel.ts", mode: "client" },
    { src: "~/plugins/prisma.ts" },
  ],
});
