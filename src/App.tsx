import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lightning,
  Stack,
  Gear,
  ClockCounterClockwise,
  CaretRight,
  Desktop,
  Cpu,
  ShieldCheck,
  Command,
  Rows,
  List
} from '@phosphor-icons/react';
import { Dropzone } from '@/components/optimizer/Dropzone';
import { AssetList } from '@/components/optimizer/AssetList';
import { ActionLog } from '@/components/optimizer/ActionLog';
import { EngineSetup } from '@/components/optimizer/EngineSetup';

// Helper function for class merging
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-lab-deep text-lab-bright flex font-sans selection:bg-primary/30 overflow-hidden">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Premium Laboratory Sidebar */}
      <aside
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-50 h-screen border-r border-lab bg-lab-surface/90 md:bg-lab-surface/50 backdrop-blur-xl md:backdrop-blur-md flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isSidebarCollapsed ? "md:w-20" : "w-72 md:w-72"
        )}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-12 w-6 h-6 rounded-full bg-lab-surface border border-lab flex items-center justify-center text-primary shadow-lg hover:scale-110 transition-transform"
        >
          <CaretRight size={12} className={cn("transition-transform duration-500", !isSidebarCollapsed && "rotate-180")} />
        </button>

        <div className="p-6 flex items-center gap-4 mb-10 overflow-hidden">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Lightning weight="fill" size={24} className="text-white" />
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: isSidebarCollapsed ? 0 : 1, x: isSidebarCollapsed ? -10 : 0 }}
            className="flex flex-col whitespace-nowrap"
          >
            <span className="text-lg font-black tracking-tighter uppercase italic leading-none">Swift Asset</span>
            <span className="text-[9px] font-bold text-primary tracking-[0.3rem] uppercase opacity-70">Core Engine</span>
          </motion.div>
        </div>

        <div className="px-4 space-y-1.5 flex-1">
          <div className={cn("px-3 mb-4 text-[10px] font-bold text-lab-muted uppercase tracking-widest transition-opacity", isSidebarCollapsed && "opacity-0 invisible")}>
            Laboratory
          </div>
          {[
            { id: 'process', icon: <Stack weight="duotone" size={20} />, label: 'Neural Processing' },
            { id: 'history', icon: <ClockCounterClockwise weight="duotone" size={20} />, label: 'Action Log' },
            { id: 'config', icon: <Gear weight="duotone" size={20} />, label: 'Engine Setup' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "w-full group relative flex items-center py-3 px-3 rounded-xl transition-all duration-300",
                activeTab === item.id
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]"
                  : "text-lab-muted hover:text-lab-bright hover:bg-white/5"
              )}
            >
              <div className="shrink-0 w-8 flex justify-center">{item.icon}</div>
              <motion.span
                animate={{ opacity: isSidebarCollapsed ? 0 : 1, x: isSidebarCollapsed ? -10 : 0 }}
                className="font-bold text-sm ml-3 whitespace-nowrap"
              >
                {item.label}
              </motion.span>

              {activeTab === item.id && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 mt-auto">
          {!isSidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-lab/50 mb-6 group cursor-help"
            >
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Privacy First
              </div>
              <p className="text-[11px] text-lab-muted leading-relaxed group-hover:text-lab-bright transition-colors">
                All processing is <strong>strictly local</strong>. Your data never leaves this browser.
              </p>
            </motion.div>
          )}

          <div className={cn(
            "flex items-center gap-4 text-lab-muted hover:text-primary transition-all group cursor-pointer p-3 rounded-xl hover:bg-white/5",
            isSidebarCollapsed && "justify-center"
          )}>
            <div className="shrink-0 w-10 h-10 rounded-full bg-lab-surface flex items-center justify-center border border-lab group-hover:border-primary/50 transition-all group-hover:rotate-12">
              <Desktop size={18} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold whitespace-nowrap">Lab Console v2</span>
                <span className="text-[10px] opacity-50">Authorized Personnel</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto px-4 py-8 md:px-16 md:py-16 relative bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.03),transparent)]">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl bg-white/5 border border-lab text-lab-bright hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <List size={24} weight="bold" />
              </button>
              <div className="flex items-center gap-3 text-primary font-bold text-[11px] uppercase tracking-[0.3em]">
                <div className="p-1.5 rounded bg-primary/10">
                  <Cpu weight="fill" size={14} />
                </div>
                Local Unit / 02-B
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] transition-all">
              {activeTab === 'process' && <>Asset <br /> <span className="text-primary tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Processing</span></>}
              {activeTab === 'history' && <>Action <br /> <span className="text-primary tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Log</span></>}
              {activeTab === 'config' && <>Engine <br /> <span className="text-primary tracking-[-0.05em] drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">Setup</span></>}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-lab">
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-lab-muted uppercase tracking-widest">Protocol</span>
                <span className="text-xs font-black italic">SECURE_SANDBOX_01</span>
              </div>
              <ShieldCheck weight="fill" size={24} className="text-emerald-500" />
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-lab flex items-center justify-center hover:bg-primary/20 hover:border-primary/50 transition-all text-lab-muted hover:text-primary">
              <Command size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'process' && (
            <motion.div
              key="process"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="max-w-6xl mx-auto space-y-20">
                <Dropzone />
                <AssetList />

                <div>
                  <div className="flex items-center gap-4 mb-10">
                    <Rows size={24} className="text-primary opacity-50" />
                    <h2 className="text-2xl font-black tracking-tighter uppercase italic">Neural Sub-Systems</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-lab to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                    {[
                      { title: "SVG Optimize", desc: "Clean metadata and convert to optimized React components.", icon: <Lightning weight="duotone" size={28} /> },
                      { title: "Image Matrix", desc: "Quantize JPG/PNG formats with sub-pixel precision.", icon: <Stack weight="duotone" size={28} /> },
                      { title: "Batch Flow", desc: "Parallel processing for large asset collections.", icon: <Gear weight="duotone" size={28} /> },
                    ].map((card, i) => (
                      <div key={i} className="glass-lab p-10 group hover:border-primary/50 transition-all cursor-crosshair relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-primary/20 transition-all duration-700" />

                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-lab flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 mb-8 shadow-inner">
                          {card.icon}
                        </div>
                        <h3 className="font-black text-xl mb-3 uppercase italic tracking-tight">{card.title}</h3>
                        <p className="text-[13px] text-lab-muted leading-relaxed mb-8 group-hover:text-lab-bright transition-colors">{card.desc}</p>
                        <button
                          onClick={() => setActiveTab('config')}
                          className="text-[11px] font-black text-primary flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-[0.2em]"
                        >
                          Configure Engine <CaretRight weight="bold" size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <ActionLog />
            </motion.div>
          )}

          {activeTab === 'config' && (
            <motion.div
              key="config"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <EngineSetup />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Particles / Ambient Glow */}
        <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[180px] rounded-full pointer-events-none animate-pulse" />
        <div className="fixed top-[20%] left-[20%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      </main>
    </div>
  );
};

export default App;
