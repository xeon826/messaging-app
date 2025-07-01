export const useLoadUnreadMessages = async () => {
  const user = useSupabaseUser();
  const { data } = await useFetch("/api/loadUnreadMessages", {
    method: "GET",
    params: { userId: user._value.id },
  });
  console.log('the unread data', data)
  return data;
};
