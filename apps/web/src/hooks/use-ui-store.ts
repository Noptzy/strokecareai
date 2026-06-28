import { create } from "zustand"

interface UIStore {
	showLoginPassword: boolean
	setShowLoginPassword: (val: boolean) => void
	showSignupPassword: boolean
	setShowSignupPassword: (val: boolean) => void
	isCompanionSidebarOpen: boolean
	setCompanionSidebarOpen: (val: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
	showLoginPassword: false,
	setShowLoginPassword: (val) => set({ showLoginPassword: val }),
	showSignupPassword: false,
	setShowSignupPassword: (val) => set({ showSignupPassword: val }),
	isCompanionSidebarOpen: false,
	setCompanionSidebarOpen: (val) => set({ isCompanionSidebarOpen: val }),
}))
