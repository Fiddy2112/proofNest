import { publicClient } from "@/lib/contract";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try{
        const {txHash, userAddress, planId, isAnnual} = await request.json();

        if(!txHash || !userAddress){
            return NextResponse.json({
                error:'Missing data'
            }, { status: 400 });
        }

        const receipt = await publicClient.waitForTransactionReceipt({
            hash: txHash
        });

        if(receipt.status !== 'success'){
            return NextResponse.json({ error: "Transaction failed on-chain" }, { status: 400 });
        }

        const duration = isAnnual ? 365 : 30;
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + duration);

        const authHeader = request.headers.get('Authorization');

        const {data: {user},error: authError } = await supabase.auth.getUser(
            authHeader?.split('Bearer ')[1]
        );

        if(authError){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const { userId } = await request.json();

        const { error: dbError } = await supabase
        .from("subscriptions")
        .upsert({
            user_id: userId,
            plan_id: planId,
            status: 'active',
            tx_hash: txHash,
            expires_at: expiresAt.toISOString(),
            start_date: new Date().toISOString()
        }, { onConflict: 'user_id' }); 

        if (dbError) {
        console.error("DB Error:", dbError);
        return NextResponse.json({ error: "Failed to update database" }, { status: 500 });
        }

        return NextResponse.json({ success: true, expiresAt });
    }catch(error){
        console.error("Verify Error:", error);
        return NextResponse.json({ error: (error as any)?.message }, { status: 500 });
    }
}