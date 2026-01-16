import { createClient } from "./client"; // Client-side client
import { redirect } from "next/navigation";

export const authService = {
  async getCurrentUser() {
    const supabase = createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  },

  async login(email: string, password: string) {
    const supabase = createClient();
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signup(email: string, password: string) {
    const supabase = createClient();
    return await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
  },

  async logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    redirect("/login");
  },
  
  async getSession() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
};