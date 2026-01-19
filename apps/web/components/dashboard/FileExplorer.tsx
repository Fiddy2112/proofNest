"use client";

import { FileText, Folder, MoreVertical } from "lucide-react";

type Props = {
    folders: any[];
    files: any[];
    onFolderClick: (folderId: string) => void;
    onFileClick: (file: any) => void;
}

export const FileExplorer = ({folders, files, onFolderClick, onFileClick}: Props)=>{
    if(folders.length === 0 && files.length === 0){
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                <Folder className="w-16 h-16 mb-4 stroke-1" />
                <p className="font-mono text-sm">Empty Directory</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-in fade-in duration-500">
            {folders.map((folder) => (
                <div 
                key={folder.id}
                onClick={() => onFolderClick(folder.id)}
                className="group relative aspect-square bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer"
                >
                <div className="flex justify-between items-start">
                    <Folder className="w-8 h-8 text-blue-400 fill-blue-400/10" />
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-200 truncate">{folder.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Folder</p>
                </div>
                </div>
            ))}

            {files.map((file) => (
                <div 
                key={file.id}
                onClick={() => onFileClick(file)}
                className="group relative aspect-square bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col justify-between hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer"
                >
                <div className="flex justify-between items-start">
                    <FileText className="w-8 h-8 text-emerald-400" />
                    <div className={`w-2 h-2 rounded-full ${file.status === 'confirmed' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-200 truncate">
                    {file.notes?.content || "Untitled.md"}
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono truncate">
                    {file.content_hash.slice(0, 8)}...
                    </p>
                </div>
                </div>
            ))}
        </div>
    )
}