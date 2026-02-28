import React from 'react';
import {
    Gear,
    Lightning,
    Image as ImageIcon,
    Cpu,
    ToggleLeft,
    ToggleRight,
    ShieldCheck
} from '@phosphor-icons/react';
import { useAssets } from '@/context/AssetContext';

export const EngineSetup: React.FC = () => {
    const { settings, updateSettings } = useAssets();

    return (
        <div className="space-y-16">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-primary font-bold text-[11px] uppercase tracking-[0.3em]">
                    <Gear weight="fill" size={14} />
                    Hardware Configuration
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.8]">
                    Engine <span className="text-primary tracking-[-0.05em]">Setup</span>
                </h1>
            </header>

            <div className="max-w-3xl space-y-12 pb-20">
                {/* Image Matrix Module */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <ImageIcon size={20} className="text-primary" />
                        <h2 className="text-lg font-black uppercase italic tracking-tight">Image Matrix Module</h2>
                        <div className="flex-1 h-px bg-lab" />
                    </div>

                    <div className="glass-lab p-8 space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[11px] font-black uppercase tracking-widest text-lab-muted text-pretty">
                                    Quantization Quality <span className="text-primary ml-2">{Math.round(settings.imageQuality * 100)}%</span>
                                </label>
                            </div>
                            <input
                                type="range"
                                min="0.1"
                                max="1"
                                step="0.05"
                                value={settings.imageQuality}
                                onChange={(e) => updateSettings({ imageQuality: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-lab rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-[9px] font-bold text-lab-muted uppercase tracking-tighter">
                                <span>Maximum Compression</span>
                                <span>Lossless Quality</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Neural Optimization */}
                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Cpu size={20} className="text-primary" />
                        <h2 className="text-lg font-black uppercase italic tracking-tight">Neural Optimization</h2>
                        <div className="flex-1 h-px bg-lab" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <button
                            onClick={() => updateSettings({ autoOptimize: !settings.autoOptimize })}
                            className="glass-lab p-6 flex items-start gap-4 hover:border-primary/50 transition-all text-left"
                        >
                            <div className="text-primary">
                                {settings.autoOptimize ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase mb-1">Auto-Inject</h3>
                                <p className="text-[10px] text-lab-muted leading-tight">Begin processing sequence immediately upon asset detection.</p>
                            </div>
                        </button>

                        <div className="glass-lab p-6 flex items-start gap-4">
                            <div className="text-emerald-500">
                                <ShieldCheck size={28} weight="fill" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm uppercase mb-1">Safe Mode</h3>
                                <p className="text-[10px] text-lab-muted leading-tight">Strict local isolation protocols are active and non-negotiable.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-8">
                    <div className="flex items-center gap-4">
                        <Lightning size={20} className="text-primary" />
                        <h2 className="text-lg font-black uppercase italic tracking-tight">SVG Precision Engine</h2>
                        <div className="flex-1 h-px bg-lab" />
                    </div>

                    <div className="glass-lab p-8">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase tracking-widest text-lab-muted">Coordinate Precision</label>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => updateSettings({ svgPrecision: p })}
                                        className={`flex-1 py-3 rounded-xl border font-black text-sm uppercase italic tracking-tighter transition-all ${settings.svgPrecision === p
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'border-lab text-lab-muted hover:border-white/20'
                                            }`}
                                    >
                                        Level {p}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9px] font-bold text-lab-muted uppercase tracking-widest italic opacity-50 mt-4">
                                Higher levels increase accuracy but may result in larger file sizes.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
