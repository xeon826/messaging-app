import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const users = query.users;

  if (!Array.isArray(users) || users.length !== 2) {
    throw new Error("Invalid users input"); // Validation check
  }
  console.log('the users', users)

  const messages = await getMessages(users, 25);
  return {
    messages,
  };
});
