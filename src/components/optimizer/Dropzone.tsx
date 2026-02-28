import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CloudArrowUp,
    Code,
    Image as PhosphorImage,
    Sparkle
} from '@phosphor-icons/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { useAssets } from '@/context/AssetContext';

export const Dropzone: React.FC = () => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addAssets } = useAssets();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            addAssets(files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            addAssets(files);
        }
    };

    return (
        <div className="w-full relative">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "relative h-[300px] md:h-[480px] w-full glass-lab border-2 border-dashed transition-all duration-700 flex flex-col items-center justify-center cursor-pointer group overflow-hidden",
                    isDragOver ? "border-primary bg-primary/10 scale-[1.005] shadow-[0_0_50px_rgba(6,182,212,0.1)]" : "border-lab hover:border-primary/40"
                )}
                onClick={() => fileInputRef.current?.click()}
            >
                {/* Decorative Grid */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
                />

                {/* Animated Laser Scanners */}
                <AnimatePresence>
                    {isDragOver && (
                        <>
                            <motion.div
                                initial={{ left: '-10%' }}
                                animate={{ left: '110%' }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-r from-transparent via-primary to-transparent z-10 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                            />
                            <motion.div
                                initial={{ top: '-10%' }}
                                animate={{ top: '110%' }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-gradient-to-b from-transparent via-primary to-transparent z-10 shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                            />
                        </>
                    )}
                </AnimatePresence>

                <input
                    type="file"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.svg"
                />

                <div className="relative z-20 flex flex-col items-center text-center px-10">
                    <motion.div
                        animate={isDragOver ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
                        className="w-24 h-24 rounded-3xl bg-white/5 border border-lab flex items-center justify-center text-primary mb-10 shadow-2xl relative"
                    >
                        <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CloudArrowUp weight="duotone" size={42} className="relative z-10" />
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic mb-4 leading-none transition-all">
                        Initiate <span className="text-primary italic">Transfer.</span>
                    </h2>
                    <p className="text-lab-muted text-xs md:text-sm max-w-sm leading-relaxed font-medium mb-10 md:mb-12">
                        Drag and drop your raw assets into the processing chamber. <br className="hidden md:block" />
                        Our <span className="text-lab-bright underline decoration-primary/50 underline-offset-4 font-bold">V-Matrix</span> handles the heavy lifting.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6">
                        <div className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white/5 border border-lab text-[9px] md:text-[11px] font-black text-lab-muted uppercase tracking-[0.2em] group/badge hover:text-lab-bright hover:border-primary/30 transition-all">
                            <PhosphorImage weight="bold" size={14} className="text-cyan-500" /> Matrix Image
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-white/5 border border-lab text-[9px] md:text-[11px] font-black text-lab-muted uppercase tracking-[0.2em] group/badge hover:text-lab-bright hover:border-primary/30 transition-all">
                            <Code weight="bold" size={14} className="text-primary" /> React Component
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                            <Sparkle weight="fill" size={14} className="animate-spin-slow" /> Quantum Fix
                        </div>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-8 left-8 w-6 h-6 border-t-2 border-l-2 border-primary/50" />
                <div className="absolute top-8 right-8 w-6 h-6 border-t-2 border-r-2 border-primary/50" />
                <div className="absolute bottom-8 left-8 w-6 h-6 border-b-2 border-l-2 border-primary/50" />
                <div className="absolute bottom-8 right-8 w-6 h-6 border-b-2 border-r-2 border-primary/50" />

                {/* Status Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </div>

            <div className="mt-8 flex items-center justify-between px-4">
                <div className="text-[11px] font-black text-lab-muted uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    Chamber Optimized & Ready
                </div>
                <div className="text-[11px] font-black text-lab-muted uppercase tracking-widest opacity-50">
                    U_LOAD // 50MB_CAP
                </div>
            </div>
        </div>
    );
};
