import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { ShieldCheck, Fingerprint, Clock, User } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PublicProofPage({ params }: Props) {
  const { id } = await params;
  const supabase = supabaseServer();

  const { data: proof } = await supabase
    .from("proofs")
    .select(`
      id,
      content_hash,
      chain,
      block_timestamp,
      created_at,
      user_id,
      notes (
        id
      )
    `)
    .eq("id", id)
    .single();

  if (!proof) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 px-6 py-32">
      <div className="max-w-3xl mx-auto space-y-16">

        {/* HEADER */}
        <header className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest text-slate-400">
            <ShieldCheck className="w-4 h-4" />
            Proof verified
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Proof of existence
          </h1>

          <p className="text-slate-400 max-w-xl mx-auto">
            This page verifies that a specific piece of content existed
            at a precise moment in time.
          </p>
        </header>

        {/* PROOF CARD */}
        <section
          className="rounded-3xl border border-white/10 bg-white/5
          backdrop-blur-xl shadow-2xl p-10 space-y-8"
        >
          <ProofItem
            icon={<Fingerprint />}
            label="Content fingerprint"
            value={proof.content_hash}
            mono
          />

          <ProofItem
            icon={<Clock />}
            label="Timestamp"
            value={new Date(
              proof.block_timestamp || proof.created_at
            ).toUTCString()}
          />

          <ProofItem
            icon={<User />}
            label="Created by"
            value={proof.user_id ? `User ${proof.user_id.slice(0, 8)}…` : "Anonymous"}
          />

          <ProofItem
            icon={<ShieldCheck />}
            label="Anchoring network"
            value={proof.chain}
          />
        </section>

        {/* FOOTNOTE */}
        <footer className="text-center text-sm text-slate-500 leading-relaxed">
          <p>
            This proof confirms <strong>existence</strong>, not ownership.
          </p>
          <p>
            The original content remains private and is never revealed here.
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ---------------------------------- */

function ProofItem({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10
        flex items-center justify-center text-white shrink-0">
        {icon}
      </div>

      <div className="space-y-1">
        <div className="text-xs uppercase tracking-widest text-slate-500 font-bold">
          {label}
        </div>
        <div
          className={`text-sm break-all ${
            mono ? "font-mono text-slate-300" : "text-slate-300"
          }`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
