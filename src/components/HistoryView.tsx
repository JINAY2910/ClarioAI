import React, { useState } from 'react';
import { type HistoryItem, historyService } from '../services/history';
import { Sparkles, AlertCircle, Info, Clock, Trash2, ChevronRight, CheckCircle2, Circle, X } from 'lucide-react';

interface HistoryViewProps {
    onSelect: (item: HistoryItem) => void;
    onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onSelect, onBack }) => {
    const [history, setHistory] = React.useState<HistoryItem[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    React.useEffect(() => {
        setHistory(historyService.getAll());
    }, []);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds(new Set());
    };

    const toggleItemSelection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = () => {
        if (selectedIds.size === 0) return;

        if (confirm(`Delete ${selectedIds.size} items?`)) {
            historyService.deleteByIds(Array.from(selectedIds));
            setHistory(historyService.getAll());
            setIsSelectionMode(false);
            setSelectedIds(new Set());
        }
    };

    const getIntentIcon = (intent: string) => {
        switch (intent) {
            case 'general-health': return <Sparkles className="w-4 h-4 text-emerald-400" />;
            case 'processed-concern': return <AlertCircle className="w-4 h-4 text-rose-400" />;
            case 'moderation': return <Info className="w-4 h-4 text-amber-400" />;
            default: return <Sparkles className="w-4 h-4 text-emerald-400" />;
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-black">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 h-16 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl sticky top-0 z-20 transition-all duration-300">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                        <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-white tracking-wide">
                        {isSelectionMode ? `${selectedIds.size} Selected` : 'Scan History'}
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    {history.length > 0 && (
                        <>
                            {isSelectionMode ? (
                                <>
                                    <button
                                        onClick={handleDeleteSelected}
                                        disabled={selectedIds.size === 0}
                                        className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${selectedIds.size > 0
                                            ? 'bg-white text-rose-600 shadow-lg shadow-black/20 hover:bg-gray-100 hover:scale-110'
                                            : 'bg-white/10 text-white'
                                            }`}
                                        title="Delete Selected"
                                    >
                                        <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                                    </button>
                                    <button
                                        onClick={toggleSelectionMode}
                                        className="w-10 h-10 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center backdrop-blur-md"
                                        title="Cancel Selection"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={toggleSelectionMode}
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:scale-105 transition-all"
                                >
                                    Select
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 gap-3">
                        <Clock className="w-12 h-12 opacity-20" />
                        <p className="text-sm">No scans yet. Start exploring!</p>
                        <button
                            onClick={onBack}
                            className="mt-4 px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium hover:bg-emerald-500/20 transition-colors"
                        >
                            Start New Scan
                        </button>
                    </div>
                ) : (
                    history.map((item) => (
                        <div
                            key={item.id}
                            onClick={(e) => isSelectionMode ? toggleItemSelection(item.id, e) : onSelect(item)}
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group text-left ${isSelectionMode && selectedIds.has(item.id)
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                        >
                            {isSelectionMode ? (
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${selectedIds.has(item.id) ? 'text-emerald-400' : 'text-white/20'
                                    }`}>
                                    {selectedIds.has(item.id) ? (
                                        <CheckCircle2 className="w-6 h-6 fill-emerald-500/20" />
                                    ) : (
                                        <Circle className="w-6 h-6" />
                                    )}
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                    {getIntentIcon(item.intent)}
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className={`text-base font-medium truncate pr-2 ${selectedIds.has(item.id) ? 'text-emerald-100' : 'text-white'}`}>
                                        {item.productName}
                                    </h3>
                                    <span className="text-[10px] text-white/30 whitespace-nowrap">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                                    {item.primaryInsight.replace(/\*\*/g, '')}
                                </p>
                            </div>

                            {!isSelectionMode && (
                                <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
