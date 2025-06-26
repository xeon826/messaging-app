import { serverSupabaseClient, serverSupabaseServiceRole } from "#supabase/server";
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

    // Transform the data to match your expected format
    const transformedUsers = fetchedUsers.map(user => ({
      firstName: user.user_metadata?.firstName || '',
      lastName: user.user_metadata?.lastName || '',
      username: user.user_metadata?.username || '',
      email: user.email,
    }));

    return { users: transformedUsers };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users'
    });
  }
});
