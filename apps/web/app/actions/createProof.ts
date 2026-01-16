"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hashContent, normalizeContent } from "@/lib/crypto";

const FREE_PROOF_LIMIT = 3;

export async function createProof(formData: FormData) {
  const content = formData.get("content");

  if (!content || typeof content !== "string") {
    return { error: "Content is required" };
  }

  const supabase = await createClient();

  /* ---------------- AUTH ---------------- */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return { error: "Unauthorized" };
  }

  /* ---------------- NORMALIZE + HASH ---------------- */
  const normalized = normalizeContent(content);
  const contentHash = hashContent(normalized);

  /* ---------------- USAGE LIMIT ---------------- */
  const { data: usage, error: usageError } = await supabase
    .from("usage_limits")
    .select("proofs_used")
    .eq("user_id", user.id)
    .single();

  if (usageError || !usage) {
    return { error: "Could not verify usage limits" };
  }

  if (usage.proofs_used >= FREE_PROOF_LIMIT) {
    return { error: "Limit reached. Upgrade to Pro for unlimited proofs." };
  }

  /* ---------------- DATABASE TRANSACTIONS ---------------- */
  
  let proofId = "";

  try {

    const { data: note, error: noteError } = await supabase
      .from("notes")
      .insert({
        user_id: user.id,
        content: normalized,
        content_hash: contentHash,
      })
      .select()
      .single();

    if (noteError || !note) throw new Error("Note creation failed");

    const { data: proof, error: proofError } = await supabase
      .from("proofs")
      .insert({
        user_id: user.id,
        note_id: note.id,
        content_hash: contentHash,
        chain: "sepolia",
        block_timestamp: new Date().toISOString(),
      })
      .select()
      .single();

    if (proofError || !proof) throw new Error("Proof creation failed");
    proofId = proof.id;

    await supabase
      .from("usage_limits")
      .update({
        proofs_used: usage.proofs_used + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

  } catch (err: any) {
    return { error: err.message || "Something went wrong" };
  }

  /* ---------------- REVALIDATE + REDIRECT ---------------- */
  revalidatePath("/app");
  redirect(`/proofs/${proofId}`); 
}