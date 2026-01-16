import { createClient } from "./client";

export const dbService = {
  async createProofEntry(userId: string, content: string, hash: string) {
    const supabase = createClient();

    const { data: note, error: noteError } = await supabase
      .from('notes')
      .insert([{ 
        user_id: userId, 
        content, 
        content_hash: hash 
      }])
      .select()
      .single();

    if (noteError) throw noteError;

    const { data: proof, error: proofError } = await supabase
      .from('proofs')
      .insert([{
        user_id: userId,
        note_id: note.id,
        content_hash: hash,
        chain: 'sepolia',
        tx_hash: `0x${Math.random().toString(16).slice(2)}`,
        status: 'confirmed'
      }])
      .select()
      .single();

    if (proofError) throw proofError;

    return { note, proof };
  },

  async getRecentProofs(userId:string){
    const supabase = createClient();
    const {data, error} = await supabase.from('proofs').select(`id,content_hash,created_at,status,notes!proofs_note_id_fkey (content)`).eq('user_id',userId).order('created_at',{ascending:false}).limit(10);

    if(error) throw error;
    return data;
  },

  async getFolders(userId: string){
    const supabase = createClient();
    return await supabase.from('folders').select('*').eq('user_id', userId).order('created_at',{ascending: true});
  },

  async createFolder(userId: string, name: string){
    const supabase = createClient();
    return await supabase.from('folders').insert([{
        user_id:userId,
        name
    }]).select().single();
  }
};