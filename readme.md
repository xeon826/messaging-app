Follow these steps to install Messaging App:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/xeon826/messaging-app.git
   ```

2. **Navigate to the Software Directory**
   ```bash
   cd messaging-app
   ```

3. **Install Bun**, currently tested with node v22.15.0, recommended to install nvm for version management.
   ```bash
   npm i -g bun
   ```

## Configuration

To configure the software:

1. **Copy the Example Configuration**
   ```bash
   cp .env.example .env
   ```

2. **Obtain a appropriate API keys**. Supabase is used to host the backend, you'll want to make an account and obtain the credentials from your dashboard.

## Install Dependencies

Run the following command to install dependencies

```bash
bun install
```

## Create database trigger on the auth table in Supabase dashboard

Navigate to the SQL Editor tab and run the following SQL. This will be used to insert a user into the public.users table upon successful sign-up, ensuring best practices.

```sql
insert into public.users (
  id,
  email,
  username,
  first_name,
  last_name
)
select 
  a.id,
  a.email,
  a.raw_user_meta_data->>'user_name',
  split_part(coalesce(a.raw_user_meta_data->>'full_name', ''), ' ', 1),
  split_part(coalesce(a.raw_user_meta_data->>'full_name', ''), ' ', 2)
from auth.users a
where not exists (
  select 1 
  from public.users u 
  where u.id::uuid = a.id
);
```

## Launch the App

Once the dependencies are installed, run the app with

```
bun dev
```

Navigate to localhost:3000 and click "Signup". After inputting your credentials, you'll get a confirmation email that you'll use to confirm you email. After which you'll be able to log in.



