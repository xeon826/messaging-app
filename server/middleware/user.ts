import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  // Skip auth check for public routes if needed
  const publicRoutes = ['/', '/login', '/signup'];
  if (publicRoutes.includes(event.path)) {
    return;
  }

  try {
    const client = serverSupabaseClient(event);
    const user = await serverSupabaseUser(event);
    
    // If no user is found, just return without throwing an error
    if (!user) {
      event.context.user = null;
      return;
    }

    // Set the user in context
    event.context.user = user;

    // Fetch additional user data only if we have a user
    const { data: accountData } = await client
      .from("account")
      .select("*")
      .eq("id", user.id)
      .single();

    if (accountData) {
      event.context.user.admin = accountData.admin;
    }
  } catch (error) {
    // Log the error but don't throw it
    console.error('Error in user middleware:', error);
    event.context.user = null;
  }
});
