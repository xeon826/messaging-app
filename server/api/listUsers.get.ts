import { serverSupabaseClient } from "#supabase/server";

export default eventHandler(async (event) => {
  try {
    // Use the regular client since we're accessing public schema
    const client = await serverSupabaseClient(event);
    
    if (!client) {
      throw new Error('Failed to initialize Supabase client');
    }

    // Query the public.users table
    const { data: users, error } = await client
      .from('users')
      .select('first_name, last_name, username, email');

    if (error) {
      throw error;
    }

    // Transform not needed since the data is already in the correct format
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    });
  }
});
