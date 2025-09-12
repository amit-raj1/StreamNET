import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      // Redirect admin to dashboard
      if (data?.user?.isAdmin || data?.user?.isMasterAdmin) {
        navigate("/admin/dashboard");
      }
    },
  });

  return { error, isPending, loginMutation: mutate };
};

export default useLogin;
