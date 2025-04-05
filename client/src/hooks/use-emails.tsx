import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Email } from "@/types/email";

// Hook to fetch emails, optionally filtered by folder
export function useEmails(folder?: string) {
  const url = folder 
    ? `/api/emails?folder=${encodeURIComponent(folder)}`
    : '/api/emails';
  
  return useQuery({
    queryKey: [url],
    retry: 1,
  });
}

// Hook to fetch a single email by id
export function useEmail(id: string | number) {
  return useQuery({
    queryKey: [`/api/emails/${id}`],
    enabled: !!id,
  });
}

// Hook to update an email
export function useUpdateEmail() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<Email> }) => {
      const res = await apiRequest('PATCH', `/api/emails/${id}`, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/emails'] });
      queryClient.invalidateQueries({ queryKey: [`/api/emails/${data.id}`] });
    },
  });
}

// Type definition for security stats
export interface SecurityStats {
  scamBlocked: number;
  encrypted: number;
  unsubscribeCount: number;
}

// Hook to fetch security stats
export function useSecurityStats() {
  return useQuery<SecurityStats>({
    queryKey: ['/api/security-stats'],
  });
}

// Hook for email analysis
export function useAnalyzeEmail() {
  return useMutation({
    mutationFn: async (emailData: { from: string, subject: string, body: string }) => {
      const res = await apiRequest('POST', '/api/emails/analyze', emailData);
      return res.json();
    },
  });
}

// Hook to generate unsubscribe emails
export function useGenerateUnsubscribe() {
  return useMutation({
    mutationFn: async (data: { to: string, fromName: string, serviceDescription: string }) => {
      const res = await apiRequest('POST', '/api/generate-unsubscribe', data);
      return res.json();
    },
  });
}
