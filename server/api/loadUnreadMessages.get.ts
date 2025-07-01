export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userId = query.userId;
    console.log("The user ID is", userId);
    if (!userId) {
      throw new Error("User ID must be provided");
    }

    const messages = await getUnreadMessages(userId);
    return messages;
  } catch (error) {
    console.error("Error fetching unread messages:", error);
    throw createError({ statusCode: 400, message: error.message });
  }
});
