import type { AnalysisData } from '../components/AnalysisResult';

export interface HistoryItem extends AnalysisData {
    id: string;
    timestamp: number;
}

const STORAGE_KEY = 'clario_history_v1';

export const historyService = {
    save(data: AnalysisData): HistoryItem {
        const history = this.getAll();
        const newItem: HistoryItem = {
            ...data,
            id: Date.now().toString(),
            timestamp: Date.now()
        };

        // Add to beginning of list
        const updated = [newItem, ...history];

        // Limit to 50 items to prevent storage bloat
        if (updated.length > 50) {
            updated.length = 50;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newItem;
    },

    getAll(): HistoryItem[] {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load history", e);
            return [];
        }
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
    },

    deleteByIds(ids: string[]) {
        const history = this.getAll();
        const updated = history.filter(item => !ids.includes(item.id));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
};
