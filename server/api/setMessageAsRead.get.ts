import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const messageId = query.messageId;
  console.log('the messageId', messageId)

  const result = await markMessageAsRead(messageId);

});
