import { useRouter } from "#imports";


export const navigateToChat = (receiver) => {
  const router = useRouter();
  router.push({
    path: "/app/chat",
    query: {
      receiverId: receiver.id,
    },
  });
};
