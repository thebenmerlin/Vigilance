import { create } from 'zustand';

interface AppState {
    sidebarCollapsed: boolean;
    isCopilotOpen: boolean;
    toggleSidebar: () => void;
    toggleCopilot: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setCopilotOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    sidebarCollapsed: false,
    isCopilotOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    toggleCopilot: () => set((state) => ({ isCopilotOpen: !state.isCopilotOpen })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    setCopilotOpen: (open) => set({ isCopilotOpen: open }),
}));