export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { auth } = useSupabaseClient()

  console.log('Current user state:', user.value);

  watch(user, (newValue) => {
    console.log('User state changed:', newValue);
  }, { immediate: true });

  try {
    // Get the current session
    const { data: { session }, error } = await auth.getSession()
    console.log('Session data:', session)

    // If there's no session and we're not already on the login page, redirect to login
    if (!session && to.path !== '/login') {
      return navigateTo('/login')
    }

    // If we have a session but we're on the login page, redirect to profile
    if (session && to.path === '/login') {
      return navigateTo('/app/profile')
    }
  } catch (error) {
    // If there's an error checking the session, redirect to login
    console.error('Auth middleware error:', error)
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})
