import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for local development
const createMockSupabaseClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: { id: 'mock-user', email: 'test@example.com' } } }),
      getSession: async () => ({ data: { session: { user: { id: 'mock-user', email: 'test@example.com' } } } }),
      onAuthStateChange: (callback: any) => {
        // Simulate immediate login
        setTimeout(() => callback('SIGNED_IN', { user: { id: 'mock-user', email: 'test@example.com' } }), 100);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        return { data: { user: { id: 'mock-user', email } }, error: null };
      },
      signUp: async ({ email, password }: { email: string; password: string }) => {
        return { data: { user: { id: 'mock-user', email } }, error: null };
      },
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          data: [],
          error: null
        })
      }),
      insert: (data: any) => ({
        data: [{ id: 'mock-id', ...data }],
        error: null
      })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          // Store file in localStorage for demo
          const reader = new FileReader();
          reader.onload = () => {
            localStorage.setItem(`file_${path}`, reader.result as string);
          };
          reader.readAsDataURL(file);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: localStorage.getItem(`file_${path}`) || '' }
        })
      })
    }
  };
};

// Use mock client for now
export const supabase = createMockSupabaseClient() as any;

export type Image = {
  id: string;
  filename: string;
  storage_path: string;
  file_size: number | null;
  mime_type: string | null;
  uploaded_by: string;
  created_at: string;
  sort_order: number;
  category: string | null;
  item_type: string | null;
  location: string | null;
  date_taken: string | null;
  sequence: string | null;
};
