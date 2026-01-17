import { createClient } from "./client";

export const dbService = {
  async createProofEntry(
    userId: string,
    content: string,
    hash: string,
    folderId?: string
  ) {
    const supabase = createClient();

    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: userId,
        content,
        content_hash: hash,
      })
      .select()
      .single();

    if (noteError) {
      console.error("Note insert error:", noteError);
      throw noteError;
    }

    const { data: proof, error: proofError } = await supabase
      .from("proofs")
      .insert({
        user_id: userId,
        note_id: note.id,
        content_hash: hash,
        chain: "sepolia",
        tx_hash: `0x${Math.random().toString(16).slice(2)}`,
        status: "confirmed",
        folder_id: folderId || null,
      })
      .select()
      .single();

    if (proofError) {
      console.error("Proof insert error:", proofError);
      throw proofError;
    }

    return { note, proof };
  },

  async getRecentProofs(userId: string) {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("proofs")
      .select(
        `
        id,
        content_hash,
        created_at,
        status,
        folder_id,
        note_id,
        notes:note_id (content)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.warn("Relationship query failed, falling back:", error);
      const { data: simpleData, error: simpleError } = await supabase
        .from("proofs")
        .select("id, content_hash, created_at, status, folder_id, note_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (simpleError) {
        console.error("Simple query failed:", simpleError);
        return [];
      }
      return simpleData || [];
    }

    return data || [];
  },

  async getProofs(options: {
    userId: string;
    folderId?: string | null;
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const { userId, folderId, search, status, limit = 50, offset = 0 } = options;
    const supabase = createClient();

    let query = supabase
      .from("proofs")
      .select(
        `
        id,
        content_hash,
        created_at,
        status,
        folder_id,
        note_id,
        notes:note_id (content)
      `,
        { count: "exact" }
      )
      .eq("user_id", userId);

    if (folderId) {
      query = query.eq("folder_id", folderId);
    } else if (folderId === null) {
      query = query.is("folder_id", null);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error, count } = query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("getProofs error:", error);
      return { data: [], count: 0 };
    }

    return { data: data || [], count: count || 0 };
  },

  async getFolders(userId: string) {
    const supabase = createClient();
    return await supabase
      .from("folders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
  },

  async createFolder(userId: string, name: string) {
    const supabase = createClient();
    const result = await supabase
      .from("folders")
      .insert({
        user_id: userId,
        name,
      })
      .select()
      .single();

    if (result.error) {
      console.error("Supabase createFolder error:", result.error);
    }

    return result;
  },

  async updateFolder(folderId: string, name: string) {
    const supabase = createClient();
    const result = await supabase
      .from("folders")
      .update({ name })
      .eq("id", folderId)
      .select()
      .single();

    if (result.error) {
      console.error("Supabase updateFolder error:", result.error);
    }

    return result;
  },

  async deleteFolder(folderId: string) {
    const supabase = createClient();

    const result = await supabase
      .from("folders")
      .delete()
      .eq("id", folderId)
      .select()
      .single();

    if (result.error) {
      console.error("Supabase deleteFolder error:", result.error);
    }

    return result;
  },

  async getStats(userId: string) {
    const supabase = createClient();

    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    const [proofsResult, foldersResult, monthProofsResult] = await Promise.all([
      supabase
        .from("proofs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("folders")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("proofs")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

    return {
      totalProofs: proofsResult.count || 0,
      totalFolders: foldersResult.count || 0,
      thisMonth: monthProofsResult.count || 0,
    };
  },

  async moveProofsToRoot(folderId: string) {
    const supabase = createClient();
    const result = await supabase
      .from("proofs")
      .update({ folder_id: null })
      .eq("folder_id", folderId)
      .select();

    if (result.error) {
      console.error("moveProofsToRoot error:", result.error);
    }

    return result;
  },
};
