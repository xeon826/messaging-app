export const useListUsers = async () => {
  const { data } = await useFetch("/api/listUsers", {
    method: "GET",
  });
  return data;
};
