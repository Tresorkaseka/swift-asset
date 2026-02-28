import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileImage,
    FileCode,
    Trash,
    ClockCounterClockwise,
    DownloadSimple,
    Copy,
    ArrowRight
} from '@phosphor-icons/react';
import { useAssets } from '@/context/AssetContext';

export const ActionLog: React.FC = () => {
    const { history, removeAsset } = useAssets();

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-lab flex items-center justify-center text-lab-muted mb-6">
                    <ClockCounterClockwise size={32} className="opacity-30" />
                </div>
                <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Chamber Empty</h2>
                <p className="text-sm text-lab-muted max-w-xs">No processed assets recorded in the current session.</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-primary font-bold text-[11px] uppercase tracking-[0.3em]">
                    <ClockCounterClockwise weight="fill" size={14} />
                    Session History
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.8]">
                    Action <span className="text-primary tracking-[-0.05em]">Log</span>
                </h1>
            </header>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence mode="popLayout">
                    {history.map((asset) => (
                        <motion.div
                            layout
                            key={asset.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-lab p-4 md:p-5 flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-6 group hover:border-primary/40 transition-all"
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white/5 border border-lab flex items-center justify-center text-primary">
                                {asset.type === 'image' ? <FileImage size={24} className="md:w-7 md:h-7" /> : <FileCode size={24} className="md:w-7 md:h-7" />}
                            </div>

                            <div className="flex-1 min-w-0 w-full md:w-auto">
                                <div className="flex flex-col md:flex-row md:items-center gap-1 md:justify-between mb-2">
                                    <span className="font-black text-sm md:text-base truncate uppercase italic tracking-tight">{asset.name}</span>
                                    <div className="flex items-center self-start md:self-auto gap-2 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] md:text-[10px] font-black">
                                        -{Math.round((1 - (asset.processedSize || 0) / asset.originalSize) * 100)}% SAVED
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 md:gap-4 text-[9px] md:text-[10px] font-bold text-lab-muted uppercase tracking-widest leading-none">
                                    <span>{formatSize(asset.originalSize)}</span>
                                    <ArrowRight size={10} className="text-primary shrink-0" />
                                    <span className="text-lab-bright">{formatSize(asset.processedSize || 0)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full md:w-auto justify-end mt-2 md:mt-0 border-t border-lab/50 md:border-none pt-2 md:pt-0">
                                {asset.type === 'svg' && (
                                    <button
                                        onClick={() => navigator.clipboard.writeText(asset.reactComponent || '')}
                                        className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-lab flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all group/btn"
                                        title="Copy JSX"
                                    >
                                        <Copy size={16} className="md:w-[18px] md:h-[18px]" />
                                    </button>
                                )}
                                <button
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-lab flex items-center justify-center hover:text-primary hover:border-primary/50 transition-all"
                                    title="Download"
                                >
                                    <DownloadSimple size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                                <button
                                    onClick={() => removeAsset(asset.id, true)}
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-lab flex items-center justify-center hover:text-red-500 hover:border-red-500/50 transition-all"
                                    title="Purge"
                                >
                                    <Trash size={16} className="md:w-[18px] md:h-[18px]" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
