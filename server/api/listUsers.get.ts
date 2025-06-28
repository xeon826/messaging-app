import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";


export default eventHandler(async (event) => {
  try {
    // Use the service role client to access auth.users
    const adminClient = await serverSupabaseServiceRole(event);
    
    // Add error handling for the client
    if (!adminClient) {
      throw new Error('Failed to initialize Supabase admin client');
    }

    // Note: We use supabase.auth.admin.listUsers() instead of querying the table directly
    const { data: { users: fetchedUsers }, error } = await adminClient.auth.admin.listUsers();

    if (error) {
      throw error;
    }
    console.log('fetched users', fetchedUsers)

    // Transform the data to match the frontend property names
    const transformedUsers = fetchedUsers.map(user => ({
      firstName: user.user_metadata?.full_name?.split(' ')[0] || '',
      lastName: user.user_metadata?.full_name?.split(' ')[1] || '',
      username: user.user_metadata?.user_name || '',
      email: user.email,
    }));

    return transformedUsers; // Return the array directly
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    });
  }
});
