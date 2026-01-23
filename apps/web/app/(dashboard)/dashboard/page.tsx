"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { generateContentHash } from "@proofnest/core";
import {
  CheckCircle2,
  Fingerprint,
  Database,
  Shield,
  FileText,
  Plus,
  Search,
  LogOut,
  MoreVertical,
  Edit2,
  Trash2,
  Folder,
  ArrowLeft,
  X,
  LoaderCircle,
  Sparkles,
  Wand2,
  EyeOff,
  Eye,
  Copy,
  Wallet,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/notifi";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/auth-service";
import { dbService } from "@/lib/supabase/db-service";
import { createProofOnChain, getWalletClient } from "@/lib/contract";
import CreateFolderModal from "@/components/modals/CreateFolderModal";
import { FileExplorer } from "@/components/dashboard/FileExplorer";
import { refineContent } from "@/app/actions/ai";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Types ---
type User = {
  id: string;
  email?: string;
  user_metadata?: {
    name?: string;
    full_name?: string;
    avatar_url?: string;
  };
};

type Folder = {
  id: string;
  name: string;
  created_at: string;
  parent_id: string | null;
};

type Proof = {
  id: string;
  content_hash: string;
  created_at: string;
  status: string;
  folder_id: string | null;
  note_id: string;
  tx_hash?: string;
  notes?: {
    content: string;
  };
};

type Stats = {
  totalProofs: number;
  totalFolders: number;
  thisMonth: number;
};

type PlanType = "FREE" | "PRO" | "TEAM";

export default function DashboardPage() {
  // --- Hooks & Params ---
  const searchParams = useSearchParams();
  const initialFolderId = searchParams.get("folderId");
  const supabase = createClient();

  // --- State: UI & Data ---
  const [viewMode, setViewMode] = useState<'explorer' | 'editor'>('explorer');
  const [isLoading, setIsLoading] = useState(false);
  
  // Folder Selection State
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(initialFolderId);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  
  // Data State
  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentProofs, setRecentProofs] = useState<Proof[]>([]);
  const [filteredProofs, setFilteredProofs] = useState<Proof[]>([]);
  const [stats, setStats] = useState<Stats>({ totalProofs: 0, totalFolders: 0, thisMonth: 0 });
  const [currentPlan, setCurrentPlan] = useState<PlanType>("FREE");

  // User State
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [confirmedTxHash, setConfirmedTxHash] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Editor State
  const [demoInput, setDemoInput] = useState("");
  const [demoState, setDemoState] = useState("idle");
  const [activeHash, setActiveHash] = useState("");
  const [selectedFile, setSelectedFile] = useState<Proof | null>(null);

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // AI State
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // Preview State
  const [isPreview, setIsPreview] = useState(false);

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // --- Helper Functions ---
  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  const handleConnectWallet = async () => {
    try {
      const client = await getWalletClient();
      const [address] = await client.requestAddresses();
      setWalletAddress(address);
      toastSuccess(3000, "Wallet connected!");
    } catch (error) {
      console.error(error);
    }
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const fetchFolders = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const { data } = await dbService.getFolders(currentUser.id);
      if (data) setFolders(data);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const statsData = await dbService.getStats(currentUser.id);
      setStats(statsData);
    }
  }, []);

  const fetchProofs = useCallback(
    async (folderId: string | null, search?: string, status?: string) => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return;

      setIsLoading(true);
      try {
        const { data } = await dbService.getProofs({
          userId: currentUser.id,
          folderId,
          search,
          status: status !== "all" ? status : undefined,
        });

        const formattedData = (data || []).map((item: any) => ({
          ...item,
          notes: Array.isArray(item.notes) ? item.notes[0] : item.notes
        }));

        setRecentProofs(formattedData as Proof[]);
        setFilteredProofs(formattedData as Proof[]);
      } catch (err) {
        console.error("Failed to fetch proofs:", err);
        setRecentProofs([]);
        setFilteredProofs([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleAiRefine = async()=>{
    if(!demoInput || demoInput.length < 5){
      toastError(3000, "Write a bit more content first!");
      return;
    }

    setIsAiProcessing(true);
    const refined = await refineContent(demoInput);

    if(refined){
      setDemoInput(refined);
      toastSuccess(3000, "Content refined by AI!");
    }else{
      toastError(3000, "AI service busy. Try again");
    }
    setIsAiProcessing(false);
  }

  const checkUserLimit = async ()=>{
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return false;

    let limit = 3;
    if(currentPlan === 'PRO') limit = 100;
    if (currentPlan === 'TEAM') limit = 1000;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const {count, error} = await supabase.from('proofs').select('*', {count: 'exact', head: true}).eq('user_id', currentUser.id).gte('created_at', startOfMonth.toISOString());

    if(error){
      console.error("Check limit error", error);
      return true;
    }

    const currentUsage = count || 0;
    
    if(currentUsage >= limit){
      setShowUpgradeModal(true);
      return false;
    }

    return true;
  }

  // --- Effects ---
  const loadData = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      await fetchFolders();
      await fetchStats();
      await fetchProofs(initialFolderId);
    }
  }, [fetchFolders, fetchStats, fetchProofs, initialFolderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const folderId = searchParams.get("folderId");
    setSelectedFolderId(folderId);
    fetchProofs(folderId, searchQuery, statusFilter);
  }, [searchParams, fetchProofs]);

  useEffect(() => {
    if (selectedFolderId && folders.length > 0) {
      const folder = folders.find((f) => f.id === selectedFolderId);
      setSelectedFolder(folder || null);
    } else {
      setSelectedFolder(null);
    }
  }, [folders, selectedFolderId]);

  useEffect(() => {
    let filtered = [...recentProofs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (proof) =>
          proof.content_hash.toLowerCase().includes(query) ||
          proof.notes?.content?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((proof) => proof.status === statusFilter);
    }

    setFilteredProofs(filtered);
  }, [recentProofs, searchQuery, statusFilter]);

  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const client = await getWalletClient();
          const [address] = await client.requestAddresses();
          setWalletAddress(address);
        } catch (error) {
          console.error(error);
        }
      }
    };
    checkWallet();
  }, []);

  useEffect(()=>{
    const checkSubscription = async ()=>{
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        setCurrentPlan("FREE");
        return;
      }

      const {data} = await supabase.from('subscriptions')
      .select('plan_id, status, expires_at')
      .eq('user_id', currentUser.id)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

      if (data) {
        if (data.plan_id === 1) setCurrentPlan("PRO");
        else if (data.plan_id === 2) setCurrentPlan("TEAM");
        else setCurrentPlan("FREE");
      } else {
        setCurrentPlan("FREE");
      }
    
    }
    
    checkSubscription();
  },[])

  const navigateToFolder = (folderId: string | null) => {
    const url = folderId ? `/dashboard?folderId=${folderId}` : "/dashboard";
    window.history.pushState({}, "", url);
    
    setSelectedFolderId(folderId);
    
    if (viewMode === 'editor') {
        handleBackToExplorer();
    } else {
        fetchProofs(folderId, searchQuery, statusFilter);
    }
  };

  const handleOpenFile = (file: Proof) => {
    setSelectedFile(file);
    setDemoInput(file.notes?.content || "");
    setActiveHash(file.content_hash);
    setDemoState(file.status === 'confirmed' ? "proved" : "idle");
    setViewMode("editor");
  };

  const handleBackToExplorer = () => {
    setViewMode('explorer');
    setSelectedFile(null);
    setDemoInput("");
    setDemoState('idle');
    setActiveHash("");
    fetchProofs(selectedFolderId, searchQuery, statusFilter);
  };

  const getBreadcrumbs = useCallback(() => {
    if (!selectedFolderId) return [{ id: 'root', name: 'workspace' }];

    const path = [];
    let currentId: string | null | undefined = selectedFolderId;

    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parent_id;
      } else {
        break;
      }
    }

    return [{ id: 'root', name: 'workspace' }, ...path];
  }, [selectedFolderId, folders]);

  const breadcrumbs = getBreadcrumbs();

  const handleCreateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput || demoState !== "idle") return;

    const canCreate = await checkUserLimit();
    if (!canCreate) return;
    
    setConfirmedTxHash(null);
    setDemoState("hashing");
    const hash = generateContentHash(demoInput);
    setActiveHash(hash);
    console.log("Generated Content Hash:", hash);

    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        toastError(3000, "Please login first!");
        setDemoState("idle");
        return;
      }

      try{
        await getWalletClient();
      }catch(err){
        toastError(4000, "Please connect MetaMask to secure your proof on-chain!");
        setDemoState("idle");
        return;
      }

      setDemoState("anchoring");
      
      const txHash = await createProofOnChain(hash);
      console.log("Blockchain Tx:", txHash);
      setConfirmedTxHash(txHash);

      console.log("Saving to DB (Pending)...");
      await dbService.createProofEntry(
        currentUser.id,
        demoInput,
        hash,
        selectedFolderId || undefined
      );


      const { error: updateError } = await supabase
        .from('proofs')
        .update({ 
            tx_hash: txHash,
            status: 'confirmed' 
        })
        .match({ content_hash: hash, user_id: currentUser.id });

      if (updateError) {
        console.error("Failed to update DB with TxHash:", updateError);
        toastError(3000, "Proof on chain but DB update failed");
      }

      setDemoState("proved");
      toastSuccess(4000, "Successfully secured on Sepolia Testnet!");
      
      fetchStats();

    } catch (err: any) {
      setDemoState("idle");
      console.error(err);
      
      if (err.message && err.message.includes("User rejected")) {
        toastError(3000, "Transaction rejected.");
      }

      else if (err.message && err.message.includes("Proof already exists")) {
        toastError(3000, "This content is already on-chain!");
      }

      else if (err.message && err.message.includes("Free limit reached")) {
        setShowUpgradeModal(true);
      }

      else {
        toastError(5000, "Transaction Failed. Please check console.");
      }
    }
  };

  const handleDeleteProof = async () => {
    if (!selectedFolder && !selectedFile) return;
  };

  const deleteSingleProof = async (proofId: string, proofHash: string) => {
    if(!confirm("Delete this proof from Dashboard? (Blockchain record remains)")) return;
    
    setIsLoading(true);
    try {
        const { error } = await supabase
            .from('proofs')
            .delete()
            .eq('id', proofId);
            
        if(error) throw error;
        
        toastSuccess(3000, "Proof deleted form DB");
        fetchProofs(selectedFolderId, searchQuery, statusFilter);
    } catch (error) {
        toastError(3000, "Failed to delete");
    } finally {
        setIsLoading(false);
    }
  }

  const handleAddFolder = async (name: string) => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const { data, error } = await dbService.createFolder(currentUser.id, name);
      if (error) {
        toastError(3000, `Failed to create folder: ${error.message}`);
      } else if (data) {
        setFolders([...folders, data]);
        toastSuccess(3000, "Folder created successfully");
      }
    }
  };

  const handleEditFolder = async (name: string) => {
    if (!selectedFolder) return;
    const { data, error } = await dbService.updateFolder(selectedFolder.id, name);
    if (error) {
      toastError(3000, `Failed to rename folder: ${error.message}`);
    } else if (data) {
      setFolders(folders.map((f) => (f.id === data.id ? data : f)));
      setSelectedFolder(data);
      toastSuccess(3000, "Folder renamed successfully");
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    setIsLoading(true);
    try {
      await dbService.moveProofsToRoot(selectedFolder.id);
      const { error } = await dbService.deleteFolder(selectedFolder.id);
      if (error) {
        toastError(3000, `Failed to delete folder: ${error.message}`);
      } else {
        setFolders(folders.filter((f) => f.id !== selectedFolder.id));
        navigateToFolder(null);
        toastSuccess(3000, "Folder deleted. Proofs moved to root.");
      }
    } catch (err) {
      toastError(3000, "Failed to delete folder");
    } finally {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      setSelectedFolder(null);
    }
  };

  const openEditModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setOpenMenuId(null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setOpenMenuId(null);
    setIsDeleteModalOpen(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="h-full flex overflow-hidden bg-[#050505] selection:bg-blue-500/30">
      
      {/* Sidebar */}
      <div className="hidden xl:flex w-64 border-r border-white/5 flex-col bg-[#080808]">
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between text-slate-500 uppercase font-mono text-[10px] tracking-[0.2em] mb-6">
            <span>Workspace</span>
            <Plus
              onClick={() => setIsModalOpen(true)}
              className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors"
            />
          </div>
          
          <div className="relative group mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
            <input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/3 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-300 outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          <div
            onClick={() => navigateToFolder(null)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
              !selectedFolderId
                ? "bg-blue-500/10 text-blue-400 font-medium"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>All Proofs</span>
          </div>

          <div className="pt-4 pb-2">
            <p className="px-3 text-[10px] font-mono text-slate-600 uppercase tracking-widest">Folders</p>
          </div>

          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => navigateToFolder(folder.id)}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                selectedFolderId === folder.id
                  ? "bg-white/10 text-white font-medium"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Folder className={`w-4 h-4 ${selectedFolderId === folder.id ? "text-blue-400" : "text-slate-600"}`} />
                <span className="truncate">{folder.name}</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === folder.id ? null : folder.id);
                  setSelectedFolder(folder);
                }}
                className={`p-1 rounded hover:bg-white/20 transition-all ${openMenuId === folder.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
              
              {openMenuId === folder.id && (
                <div className="absolute left-56 mt-8 z-50 bg-[#151515] border border-white/10 rounded-lg shadow-2xl min-w-32 py-1 overflow-hidden backdrop-blur-xl">
                  <button onClick={() => openEditModal(folder)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-blue-500/20 hover:text-blue-400">
                    <Edit2 className="w-3 h-3" /> Rename
                  </button>
                  <button onClick={() => openDeleteModal(folder)} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20">
              {getUserInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{getUserDisplayName()}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="mb-3">
            {!walletAddress ? (
              <button 
                onClick={handleConnectWallet}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 text-[10px] text-slate-300 hover:text-blue-400 transition-all group"
              >
                <Wallet className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Connect Wallet</span>
              </button>
            ) : (
              <div 
                onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    toastSuccess(2000, "Address copied!");
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 cursor-pointer hover:bg-emerald-500/10 transition-all group"
                title="Click to copy"
              >
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-medium">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
                <Copy className="w-3 h-3 text-emerald-500/50 group-hover:text-emerald-400 transition-colors" />
              </div>
            )}
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/5 text-[10px] text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
        
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-[#050505]/80 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-sm">
            {viewMode === 'editor' && (
              <button onClick={handleBackToExplorer} className="mr-2 p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            
            <div className="flex items-center text-[11px] font-mono uppercase tracking-widest text-slate-500">
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.id} className="flex items-center">
                  {i > 0 && <span className="mx-2 text-slate-700">/</span>}
                  <button
                    onClick={() => {
                      if (viewMode === 'editor') handleBackToExplorer();
                      navigateToFolder(crumb.id === "root" ? null : crumb.id);
                    }}
                    className={`hover:text-blue-400 transition-colors ${
                      i === breadcrumbs.length - 1 && viewMode === 'explorer' ? "text-white font-bold" : "text-slate-500"
                    }`}
                  >
                    {crumb.name}
                  </button>
                </div>
              ))}
              {viewMode === 'editor' && (
                <>
                  <span className="mx-2 text-slate-700">/</span>
                  <span className="text-white font-bold transition-all backdrop-blur-md px-2 py-0.5 rounded bg-white/5">
                      {selectedFile ? 'view_proof.md' : 'new_proof.md'}
                  </span>
                </>
              )}
            </div>
          </div>

          {viewMode === 'explorer' && (
            <div className="flex items-center gap-3">
              <div className="flex bg-white/5 rounded-lg p-1">
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${statusFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >All</button>
                <button 
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${statusFilter === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                >Verified</button>
              </div>
              <button 
                onClick={() => {
                  setViewMode('editor');
                  setDemoInput('');
                  setDemoState('idle');
                  setSelectedFile(null);
                }}
                className="bg-white text-black px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-50 transition-all shadow-lg shadow-white/5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> New Proof
              </button>
            </div>
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            
            {viewMode === 'explorer' ? (
              <>
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                      <LoaderCircle className="w-8 h-8 animate-spin mb-4 opacity-50"/>
                      <p className="text-xs font-mono uppercase tracking-widest">Loading data...</p>
                  </div>
                ) : (
                  <FileExplorer 
                    folders={folders.filter(f => f.parent_id === selectedFolderId)}
                    files={filteredProofs} 
                    onFolderClick={(id) => navigateToFolder(id)}
                    onFileClick={(file: Proof) => handleOpenFile(file)}
                    onDeleteFile={(fileId:string)=>deleteSingleProof(fileId, activeHash)}
                  />
                )}
              </>
            ) : (
              
              <div className="flex-1 relative group animate-in fade-in zoom-in-95 duration-300">
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                <div className="relative h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:flex-row shadow-2xl">
                  
                  <div className="flex-1 flex flex-col min-w-0 bg-black/20">
                    <div className="h-12 border-b border-white/5 flex items-center px-6 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                      <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/30" />
                      <div className="ml-4 h-full flex items-center px-4 border-x border-white/5 bg-white/2">
                          <FileText className="w-3.5 h-3.5 text-blue-400 mr-2" />
                          <span className="text-xs text-slate-400 font-mono">
                            {selectedFile ? 'read_only_mode' : 'write_mode'}
                          </span>
                      </div>
                      {!selectedFile && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={handleAiRefine}
                              disabled={isAiProcessing}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all text-[10px] uppercase font-bold tracking-widest disabled:opacity-50 ${isAiProcessing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {isAiProcessing ? (
                                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Wand2 className="w-3.5 h-3.5" />
                              )}
                              {isAiProcessing ? "Enhancing..." : "AI Refine"}
                            </button>

                            <button
                              onClick={() => setIsPreview(!isPreview)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                              title={isPreview ? "Edit Mode" : "Preview Mode"}
                            >
                              {isPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        )}
                    </div>

                    <div className="flex-1 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar relative">
                      {
                        isPreview ? (
                          <div className="prose prose-invert prose-sm max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {demoInput || "*No content to preview*"}
                            </ReactMarkdown>
                          </div>
                          ) : (
                          <textarea
                            value={demoInput}
                            onChange={(e) => setDemoInput(e.target.value)}
                            readOnly={!!selectedFile}
                            placeholder="Paste your content here to fingerprint..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-lg text-slate-300 placeholder:text-slate-700 resize-none outline-none font-mono leading-relaxed"
                            autoFocus={!selectedFile}
                          />
                        )
                      }

                      { isAiProcessing && <div className="absolute inset-0 bg-black/50"
                      >
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-12 h-12 animate-spin" />
                        </div>
                       </div>}
                      
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-slate-600 uppercase">
                           {demoInput.length} chars / UTF-8
                          </span>
                          {!selectedFile && (
                            <button
                              onClick={handleCreateProof}
                              disabled={demoInput.length <= 0 || demoState !== "idle"}
                              className={`bg-white text-black px-6 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all ${demoState === 'idle' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            >
                              {demoState === 'idle' ? 'Fingerprint Data' : 'Processing...'} 
                              <Fingerprint className="w-3.5 h-3.5" />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#080808] p-8 flex flex-col items-center justify-center text-center">
                      {demoState === "idle" && (
                        <div className="space-y-4 opacity-50">
                          <Database className="w-12 h-12 text-slate-700 mx-auto" />
                          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Ready to Index</p>
                        </div>
                      )}

                      {(demoState === "hashing" || demoState === "anchoring") && (
                        <div className="space-y-6">
                          <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                            <Shield className="absolute inset-0 m-auto w-6 h-6 text-blue-400 animate-pulse" />
                          </div>
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-widest animate-pulse">
                            {demoState === 'hashing' ? 'Hashing...' : 'Anchoring to Sepolia...'}
                          </p>
                        </div>
                      )}

                      {confirmedTxHash && (
                          <div className="mt-2">
                              <p className="text-[9px] text-blue-500 font-bold uppercase">Transaction Hash</p>
                              <a 
                                  href={`https://sepolia.etherscan.io/tx/${confirmedTxHash}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] text-blue-400 font-mono truncate hover:underline flex items-center gap-1"
                              >
                                  {confirmedTxHash} ↗
                              </a>
                          </div>
                      )}

                      {demoState === "proved" && (
                        <div className="space-y-6 animate-in zoom-in duration-300">
                           <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                             <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                           </div>
                           <div>
                             <h3 className="text-white font-bold text-lg">Secured</h3>
                             <p className="text-[10px] text-emerald-500 font-mono mt-1">On Sepolia Testnet</p>
                           </div>
                           
                           <div className="w-full bg-white/5 rounded-lg p-3 text-left space-y-2 border border-white/5">
                             <div>
                               <p className="text-[9px] text-slate-500 font-bold uppercase break-all">Hash</p>
                               <p className="text-[10px] text-slate-300 font-mono break-all">{activeHash}</p>
                             </div>
                             <div>
                               <p className="text-[9px] text-slate-500 font-bold uppercase">Time</p>
                               <p className="text-[10px] text-slate-300 font-mono">{new Date().toLocaleTimeString()}</p>
                             </div>
                           </div>
                           
                           <button 
                             onClick={() => { setDemoState('idle'); setDemoInput(''); setSelectedFile(null); }}
                             className="text-xs text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4"
                           >
                             Create New
                           </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </main>
      </div>

      <CreateFolderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleAddFolder} />
      
      {/* Edit & Delete Modals */}
      {isEditModalOpen && selectedFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Rename Folder</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const input = form.elements.namedItem("name") as HTMLInputElement; handleEditFolder(input.value); setIsEditModalOpen(false); }} className="space-y-4">
              <input type="text" name="name" defaultValue={selectedFolder.name} placeholder="Folder name" className="w-full bg-white/3 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-white/30 transition-all" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white text-black hover:bg-slate-200 transition-all">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Folder?</h3>
              <p className="text-slate-400 text-sm">Proofs in "{selectedFolder.name}" will be moved to root.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-white/5 transition-all">Cancel</button>
              <button onClick={handleDeleteFolder} className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all">Delete & Move</button>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-3xl p-8 w-full max-w-md relative overflow-hidden shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-tr from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 rotate-3">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">Limit Reached</h3>
              <p className="text-slate-400 text-sm">
                You've used all <span className="text-white font-bold">3 free proofs</span> for this month.
                Upgrade to Pro to secure unlimited content forever.
              </p>
            </div>

            <div className="space-y-3 mb-8 bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Unlimited Blockchain Proofs</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Advanced Analytics</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-linear-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                Upgrade to Pro - $19/mo <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 rounded-xl font-semibold text-xs text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                Maybe Later
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}