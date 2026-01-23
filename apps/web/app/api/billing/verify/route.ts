import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publicClient } from "@/lib/contract";
import { formatEther } from "viem";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { txHash, userAddress, planId, isAnnual, userId } = await req.json();

    if (!txHash || !userId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    console.log(`Verifying payment tx: ${txHash}...`);

    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash: txHash as `0x${string}`
    });

    if (receipt.status !== "success") {
      return NextResponse.json({ error: "Transaction failed on-chain" }, { status: 400 });
    }

    const durationDays = isAnnual ? 365 : 30;
    
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('expires_at')
      .eq('user_id', userId)
      .single();

    let newExpiresAt = new Date();
    
    if (currentSub && new Date(currentSub.expires_at) > new Date()) {
        newExpiresAt = new Date(currentSub.expires_at);
    }
    
    newExpiresAt.setDate(newExpiresAt.getDate() + durationDays);

    const { error: dbError } = await supabaseAdmin
      .from("subscriptions")
      .upsert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        tx_hash: txHash,
        expires_at: newExpiresAt.toISOString(),
        start_date: new Date().toISOString()
      }, { onConflict: 'user_id' });
    if (dbError) {
      console.error("DB Error:", dbError);
      return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, expiresAt: newExpiresAt });

  } catch (error: any) {
    console.error("Verify Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}