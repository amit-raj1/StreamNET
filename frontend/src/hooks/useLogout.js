import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";

const useLogout = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logoutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear user data from cache
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear(); // Clear all cache data
      
      // Don't clear theme from localStorage - keep user's theme preference
      
      // Force reload to clear any remaining state
      window.location.href = "/login";
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();
      // Don't clear theme here either
      window.location.href = "/login";
    }
  });

  return { logoutMutation, isPending, error };
};

export default useLogout;
