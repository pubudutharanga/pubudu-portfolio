import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'admin_blog_editor_draft';

export function useAutosaveDraft(initialData = null) {
    const [draft, setDraft] = useState(initialData);
    const [lastSaved, setLastSaved] = useState(null);
    const [hasRestoredDraft, setHasRestoredDraft] = useState(false);
    const debounceTimerRef = useRef(null);

    // Check if there is an existing stored draft on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.data) {
                    setHasRestoredDraft(true);
                    setLastSaved(new Date(parsed.timestamp));
                }
            }
        } catch (e) {
            console.error('Failed to read draft from localStorage:', e);
        }
    }, []);

    // Get stored draft
    const getStoredDraft = useCallback(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.data || null;
            }
        } catch (e) {
            console.error('Failed to get stored draft:', e);
        }
        return null;
    }, []);

    // Save draft with 1-second debounce
    const saveDraft = useCallback((data) => {
        if (!data) return;
        setDraft(data);

        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            try {
                const payload = {
                    timestamp: new Date().toISOString(),
                    data
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
                setLastSaved(new Date());
            } catch (e) {
                console.error('Failed to autosave draft:', e);
            }
        }, 1000);
    }, []);

    // Clear draft on successful publish
    const clearDraft = useCallback(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        localStorage.removeItem(STORAGE_KEY);
        setDraft(null);
        setLastSaved(null);
        setHasRestoredDraft(false);
    }, []);

    return {
        draft,
        lastSaved,
        hasRestoredDraft,
        getStoredDraft,
        saveDraft,
        clearDraft
    };
}
