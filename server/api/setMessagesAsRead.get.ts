import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const messageIds = query.messageIds;
  const userId = query.userId;

  const result = await markMessagesAsRead(userId, messageIds);

});
