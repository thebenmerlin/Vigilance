import { create } from 'zustand';

export interface User {
    id: number;
    username: string;
    name: string;
    role: string;
}

interface AppState {
    sidebarCollapsed: boolean;
    isCopilotOpen: boolean;

    // Auth State
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;

    toggleSidebar: () => void;
    toggleCopilot: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setCopilotOpen: (open: boolean) => void;

    // Auth Actions
    login: (user: User, token: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    sidebarCollapsed: false,
    isCopilotOpen: false,

    // Auth State - Hydrate from localStorage
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),

    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setCopilotOpen: (open) => set({ isCopilotOpen: open }),

    login: (user, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    }
}));

// Utility to fetch with auth
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as any;

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401 || response.status === 403) {
        useAppStore.getState().logout();
    }

    return response;
};