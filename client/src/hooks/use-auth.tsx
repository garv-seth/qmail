import { useQuery } from "@tanstack/react-query";

export type User = {
  sub: string;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  userId: number;
};

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user as User | null,
    isLoading,
    isError: !!error,
    isAuthenticated: !!user,
  };
}
