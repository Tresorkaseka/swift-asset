import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileImage,
    FileCode,
    Trash,
    CheckCircle,
    CircleDashed,
    DownloadSimple,
    ArrowRight
} from '@phosphor-icons/react';
import { useAssets, type ProcessedAsset } from '@/context/AssetContext';

export const AssetList: React.FC = () => {
    const { assets, removeAsset } = useAssets();

    if (assets.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black tracking-tighter uppercase italic">Processing Queue</h2>
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary">
                    {assets.length} UNITS
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-lab to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {assets.map((asset) => (
                        <AssetRow key={asset.id} asset={asset} onRemove={() => removeAsset(asset.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const AssetRow: React.FC<{ asset: ProcessedAsset; onRemove: () => void }> = ({ asset, onRemove }) => {
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-lab p-4 flex items-center gap-4 md:gap-6 group hover:border-primary/30 transition-all"
        >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-lab flex shrink-0 items-center justify-center text-lab-muted group-hover:text-primary transition-colors">
                {asset.type === 'image' ? <FileImage size={24} /> : <FileCode size={24} />}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1">
                    <span className="font-bold text-sm truncate uppercase tracking-tight">{asset.name}</span>
                    <span className="text-[10px] font-bold text-lab-muted opacity-50">{formatSize(asset.originalSize)}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                        {asset.status === 'processing' ? (
                            <CircleDashed size={14} className="text-primary animate-spin" />
                        ) : asset.status === 'completed' ? (
                            <CheckCircle weight="fill" size={14} className="text-emerald-500" />
                        ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-lab" />
                        )}
                        <span className="text-[10px] font-bold uppercase tracking-widest text-lab-muted">
                            {asset.status === 'idle' ? 'Pending Injection' : asset.status}
                        </span>
                    </div>

                    {asset.processedSize && (
                        <div className="flex items-center gap-1 md:gap-2 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[9px] md:text-[10px] font-bold tracking-tighter">
                            -{Math.round((1 - asset.processedSize / asset.originalSize) * 100)}%
                            <ArrowRight size={10} />
                            {formatSize(asset.processedSize)}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                {asset.status === 'completed' && (
                    <button
                        title="Download"
                        className="w-10 h-10 rounded-xl bg-white/5 border border-lab flex items-center justify-center text-lab-muted hover:text-primary hover:border-primary/50 transition-all"
                    >
                        <DownloadSimple size={18} />
                    </button>
                )}
                <button
                    onClick={onRemove}
                    title="Remove"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-lab flex items-center justify-center text-lab-muted hover:text-red-500 hover:border-red-500/50 transition-all"
                >
                    <Trash size={18} />
                </button>
            </div>
        </motion.div>
    );
};
