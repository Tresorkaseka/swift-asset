import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { optimizeSVG, convertToReactComponent } from '@/utils/svgEngine';
import { compressImage } from '@/utils/imageEngine';

export type AssetType = 'image' | 'svg';

export interface ProcessedAsset {
    id: string;
    name: string;
    type: AssetType;
    originalSize: number;
    processedSize?: number;
    status: 'idle' | 'processing' | 'completed' | 'error';
    originalUrl: string;
    processedUrl?: string;
    reactComponent?: string;
    error?: string;
}

export interface Settings {
    imageQuality: number;
    svgPrecision: number;
    autoOptimize: boolean;
}

interface AssetContextType {
    assets: ProcessedAsset[];
    history: ProcessedAsset[];
    settings: Settings;
    addAssets: (files: File[]) => void;
    removeAsset: (id: string, fromHistory?: boolean) => void;
    clearAssets: () => void;
    updateSettings: (newSettings: Partial<Settings>) => void;
    isProcessing: boolean;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [assets, setAssets] = useState<ProcessedAsset[]>([]);
    const [history, setHistory] = useState<ProcessedAsset[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        imageQuality: 0.8,
        svgPrecision: 2,
        autoOptimize: true,
    });

    const updateSettings = useCallback((newSettings: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    const addAssets = useCallback((files: File[]) => {
        const newAssets: ProcessedAsset[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.type.includes('svg') ? 'svg' : 'image',
            originalSize: file.size,
            status: 'idle',
            originalUrl: URL.createObjectURL(file),
        }));

        setAssets(prev => [...prev, ...newAssets]);
    }, []);

    const removeAsset = useCallback((id: string, fromHistory: boolean = false) => {
        if (fromHistory) {
            setHistory(prev => prev.filter(a => a.id !== id));
            return;
        }
        setAssets(prev => {
            const assetToRemove = prev.find(a => a.id === id);
            if (assetToRemove) {
                URL.revokeObjectURL(assetToRemove.originalUrl);
                if (assetToRemove.processedUrl) URL.revokeObjectURL(assetToRemove.processedUrl);
            }
            return prev.filter(a => a.id !== id);
        });
    }, []);

    const clearAssets = useCallback(() => {
        assets.forEach(a => {
            URL.revokeObjectURL(a.originalUrl);
            if (a.processedUrl) URL.revokeObjectURL(a.processedUrl);
        });
        setAssets([]);
    }, [assets]);

    useEffect(() => {
        const processNext = async () => {
            const idleAsset = assets.find(a => a.status === 'idle');
            if (!idleAsset || isProcessing) return;

            setIsProcessing(true);
            setAssets(prev => prev.map(a => a.id === idleAsset.id ? { ...a, status: 'processing' } : a));

            try {
                const response = await fetch(idleAsset.originalUrl);
                const blob = await response.blob();

                if (idleAsset.type === 'svg') {
                    const text = await blob.text();
                    const optimized = await optimizeSVG(text);
                    const reactComponent = convertToReactComponent(optimized, idleAsset.name.replace(/[^a-zA-Z0-9]/g, ''));

                    const completedAsset: ProcessedAsset = {
                        ...idleAsset,
                        status: 'completed',
                        processedSize: new Blob([optimized]).size,
                        reactComponent
                    };

                    setHistory(prev => [completedAsset, ...prev]);
                    setAssets(prev => prev.filter(a => a.id !== idleAsset.id));
                } else {
                    const compressed = await compressImage(
                        new File([blob], idleAsset.name, { type: blob.type }),
                        { quality: settings.imageQuality }
                    );
                    const processedUrl = URL.createObjectURL(compressed);

                    const completedAsset: ProcessedAsset = {
                        ...idleAsset,
                        status: 'completed',
                        processedSize: compressed.size,
                        processedUrl
                    };

                    setHistory(prev => [completedAsset, ...prev]);
                    setAssets(prev => prev.filter(a => a.id !== idleAsset.id));
                }
            } catch (err) {
                console.error('Processing error:', err);
                setAssets(prev => prev.map(a => a.id === idleAsset.id ? { ...a, status: 'error', error: String(err) } : a));
            } finally {
                setIsProcessing(false);
            }
        };

        processNext();
    }, [assets, isProcessing, settings]);

    return (
        <AssetContext.Provider value={{
            assets,
            history,
            settings,
            addAssets,
            removeAsset,
            clearAssets,
            updateSettings,
            isProcessing
        }}>
            {children}
        </AssetContext.Provider>
    );
};

export const useAssets = () => {
    const context = useContext(AssetContext);
    if (!context) throw new Error('useAssets must be used within an AssetProvider');
    return context;
};
