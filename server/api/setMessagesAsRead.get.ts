import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const messageIds = query.messageIds;
  const userId = query.userId;
  console.log('the messageIds', messageIds)
  console.log('the userId', userId)

  const result = await markMessagesAsRead(userId, messageIds);

});
