"use client";
import { useEffect, useState, useCallback } from "react";
import { formatAddress, generateContentHash } from "@proofnest/core";
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
  FolderPlus,
  ChevronRight,
  Download,
  Share2,
  Filter,
  ArrowLeft,
  X,
  Folder,
} from "lucide-react";
import { toastError, toastSuccess } from "@/utils/notifi";
import { createClient } from "@/lib/supabase/client";
import { authService } from "@/lib/supabase/auth-service";
import { dbService } from "@/lib/supabase/db-service";
import CreateFolderModal from "@/components/modals/CreateFolderModal";

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
};

type Proof = {
  id: string;
  content_hash: string;
  created_at: string;
  status: string;
  folder_id: string | null;
  note_id: string;
  notes?: {
    content: string;
  };
};

type Stats = {
  totalProofs: number;
  totalFolders: number;
  thisMonth: number;
};

export default function DashboardPage() {
  const [demoInput, setDemoInput] = useState("");
  const [demoState, setDemoState] = useState("idle");
  const [activeHash, setActiveHash] = useState("");

  const [folders, setFolders] = useState<Folder[]>([]);
  const [recentProofs, setRecentProofs] = useState<Proof[]>([]);
  const [filteredProofs, setFilteredProofs] = useState<Proof[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalProofs: 0,
    totalFolders: 0,
    thisMonth: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [proofForDelete, setProofForDelete] = useState<Proof | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedFolderForProof, setSelectedFolderForProof] = useState<
    string | null
  >(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split("@")[0];
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
        setRecentProofs(data as Proof[]);
        setFilteredProofs(data as Proof[]);
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

  const loadData = useCallback(async () => {
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      await fetchFolders();
      await fetchStats();
      await fetchProofs(selectedFolderId);
    }
  }, [fetchFolders, fetchStats, fetchProofs, selectedFolderId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const folderId = params.get("folderId");
    setSelectedFolderId(folderId);
    setSelectedFolderForProof(folderId);
    if (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      setSelectedFolder(folder || null);
    } else {
      setSelectedFolder(null);
    }
  }, [folders]);

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

  const navigateToFolder = (folderId: string | null) => {
    const url = folderId ? `/dashboard?folderId=${folderId}` : "/dashboard";
    window.history.pushState({}, "", url);
    setSelectedFolderId(folderId);
    setSelectedFolderForProof(folderId);
    const folder = folderId
      ? folders.find((f) => f.id === folderId)
      : null;
    setSelectedFolder(folder || null);
    fetchProofs(folderId);
  };

  const handleAddFolder = async (name: string) => {
    const currentUser = await authService.getCurrentUser();
    if (currentUser) {
      const { data, error } = await dbService.createFolder(
        currentUser.id,
        name
      );
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleCreateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput || demoState !== "idle") return;
    setDemoState("hashing");
    const hash = generateContentHash(demoInput);
    setActiveHash(hash);

    try {
      const currentUser = await authService.getCurrentUser();

      if (!currentUser) {
        toastError(3000, "Please login first!");
        setDemoState("idle");
        return;
      }

      await dbService.createProofEntry(
        currentUser.id,
        demoInput,
        hash,
        selectedFolderForProof || undefined
      );

      setTimeout(() => {
        setDemoState("anchoring");
        setTimeout(() => {
          setDemoState("proved");
          fetchProofs(selectedFolderId);
          fetchStats();
        }, 1500);
      }, 1500);
    } catch (err) {
      setDemoState("idle");
      toastError(5000, "Something went wrong");
    }
  };

  const handleExport = (proof: Proof) => {
    const data = {
      id: proof.id,
      contentHash: proof.content_hash,
      createdAt: proof.created_at,
      status: proof.status,
      verificationUrl: `${window.location.origin}/proof/${proof.id}`,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proof-${proof.id.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess(2000, "Proof exported");
  };

  const handleShare = (proof: Proof) => {
    const url = `${window.location.origin}/proof/${proof.id}`;
    navigator.clipboard.writeText(url);
    toastSuccess(2000, "Link copied to clipboard");
  };

  const openEditModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const openDeleteModal = (folder: Folder) => {
    setSelectedFolder(folder);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#050505]">
      <div className="flex flex-1 min-h-0">
        <div className="hidden xl:flex w-64 border-r border-white/5 flex-col p-6 gap-6 shrink-0 bg-[#080808]">
          <div className="flex items-center justify-between text-slate-500 uppercase font-mono text-[10px] tracking-[0.2em]">
            <span>Collections</span>
            <Plus
              onClick={() => setIsModalOpen(true)}
              className="w-3.5 h-3.5 hover:text-white cursor-pointer transition-colors"
            />
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-slate-400 transition-colors" />
            <input
              placeholder="Search proofs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/3 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-white/20 transition-all"
            />
          </div>

          <nav className="space-y-1.5 flex-1 overflow-y-auto">
            <div
              onClick={() => navigateToFolder(null)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                !selectedFolderId
                  ? "bg-white/10 text-white"
                  : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">All Proofs</span>
              </div>
            </div>

            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => navigateToFolder(folder.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
                  selectedFolderId === folder.id
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Folder className="w-4 h-4" />
                  <span className="text-sm font-medium truncate">{folder.name}</span>
                </div>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === folder.id ? null : folder.id
                      );
                      setSelectedFolder(folder);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                  {openMenuId === folder.id && (
                    <div className="absolute right-0 top-6 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl min-w-28">
                      <button
                        onClick={() => openEditModal(folder)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Rename
                      </button>
                      <button
                        onClick={() => openDeleteModal(folder)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-[10px] text-slate-600 truncate">
                  {user?.email || "Web3 User"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto h-full flex flex-col gap-6">
            {selectedFolderId && (
              <div className="flex items-center gap-2 text-slate-500">
                <button
                  onClick={() => navigateToFolder(null)}
                  className="hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4" />
                <Folder className="w-4 h-4" />
                <span className="text-sm">{selectedFolder?.name}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                  Total Proofs
                </p>
                <p className="text-2xl font-bold text-white">{stats.totalProofs}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                  This Month
                </p>
                <p className="text-2xl font-bold text-white">{stats.thisMonth}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                  Folders
                </p>
                <p className="text-2xl font-bold text-white">{stats.totalFolders}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  placeholder="Search proofs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/3 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-white/20 transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white/3 border border-white/10 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-white/20 transition-all"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {filteredProofs.length > 0 && (
              <div className="space-y-3">
                {filteredProofs.map((proof) => (
                  <div
                    key={proof.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              proof.status === "confirmed"
                                ? "bg-emerald-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <span className="text-[10px] uppercase tracking-widest text-slate-500">
                            {proof.status}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {new Date(proof.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-slate-400 mb-1">
                          {formatAddress(proof.content_hash)}
                        </p>
                        <p className="text-sm text-slate-300 truncate">
                          {proof.notes?.content || "Untitled Proof"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleExport(proof)}
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                          title="Export"
                        >
                          <Download className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => handleShare(proof)}
                          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredProofs.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                <p className="text-slate-500 mb-2">
                  {searchQuery || statusFilter !== "all"
                    ? "No proofs match your search"
                    : "No proofs yet"}
                </p>
                <p className="text-[10px] text-slate-600">
                  Create your first proof below
                </p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-white/10 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-500 text-sm">Loading...</p>
              </div>
            )}

            <div className="relative flex-1 min-h-[300px] group">
              <div className="absolute -inset-1 bg-linear-to-r from-white/5 to-white/5 rounded-4xl blur-xl" />

              <div className="relative h-full bg-[#0a0a0a] border border-white/5 rounded-4xl overflow-hidden flex flex-col lg:flex-row">
                <div className="flex-1 p-8 md:p-10 flex flex-col min-w-0">
                  <div className="flex items-center gap-3 mb-8 opacity-50 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      / workspace / drafts / new_proof.md
                    </span>
                  </div>

                  <textarea
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    placeholder="Enter the content you want to prove..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-slate-200 placeholder:text-white/3 resize-none outline-none leading-relaxed font-light"
                  />

                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-white/3">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono text-slate-600 uppercase tracking-tight">
                        {demoInput.length} characters
                      </span>
                      <select
                        value={selectedFolderForProof || ""}
                        onChange={(e) =>
                          setSelectedFolderForProof(
                            e.target.value || null
                          )
                        }
                        className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs outline-none"
                      >
                        <option value="">Root</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={handleCreateProof}
                      disabled={demoInput.length <= 0 || demoState !== "idle"}
                      className="bg-white text-black px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-10 shadow-2xl shadow-white/10 cursor-pointer"
                    >
                      Create Proof <Fingerprint className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-72 bg-white/2 p-8 md:p-10 border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col items-center justify-center text-center">
                  {demoState === "idle" && (
                    <div className="space-y-4 animate-in fade-in duration-700">
                      <div className="w-16 h-16 rounded-3xl bg-white/3 border border-white/5 flex items-center justify-center mx-auto">
                        <Database className="w-6 h-6 text-slate-700" />
                      </div>
                      <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
                        Awaiting
                        <br />
                        Input
                      </p>
                    </div>
                  )}

                  {(demoState === "hashing" || demoState === "anchoring") && (
                    <div className="space-y-8 py-10 text-center">
                      <div className="w-16 h-16 relative mx-auto">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <Shield className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
                      </div>
                      <span className="text-sm font-bold text-white uppercase tracking-widest animate-pulse">
                        {demoState === "hashing"
                          ? "Hashing Content..."
                          : "Anchoring to Ledger..."}
                      </span>
                    </div>
                  )}

                  {demoState === "proved" && (
                    <div className="space-y-6 py-6 animate-in zoom-in-95 duration-500 text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)] rotate-3">
                        <CheckCircle2 className="text-black w-10 h-10" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white mb-1">
                          Proof Registered
                        </h4>
                        <p className="text-xs text-green-500/70 font-mono">
                          Immutable & Verified
                        </p>
                      </div>
                      <div className="text-left space-y-2">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-500 font-bold mb-1">
                            DATA FINGERPRINT
                          </p>
                          <p className="text-[10px] font-mono text-slate-300 break-all leading-relaxed">
                            {activeHash.slice(0, 16)}...
                          </p>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-[10px] text-slate-500 font-bold mb-1">
                            TIMESTAMP
                          </p>
                          <p className="text-[10px] font-mono text-slate-300">
                            {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setDemoState("idle");
                          setDemoInput("");
                        }}
                        className="text-[11px] font-bold text-slate-500 hover:text-white uppercase tracking-widest cursor-pointer"
                      >
                        New Proof
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateFolderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddFolder}
      />

      {isEditModalOpen && selectedFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Rename Folder</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("name") as HTMLInputElement;
                handleEditFolder(input.value);
                setIsEditModalOpen(false);
              }}
              className="space-y-4"
            >
              <input
                type="text"
                name="name"
                defaultValue={selectedFolder.name}
                placeholder="Folder name"
                className="w-full bg-white/3 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-white/30 transition-all"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white text-black hover:bg-slate-200 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedFolder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Delete Folder?</h3>
              <p className="text-slate-400 text-sm">
                Proofs in "{selectedFolder.name}" will be moved to root.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-400 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFolder}
                className="flex-1 py-3 rounded-xl font-semibold text-sm bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Delete & Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
