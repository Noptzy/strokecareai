import { create } from "zustand"

export type AdminUsersRiskFilter = "all" | "high" | "medium" | "low"
export type AdminUsersSortOrder = "newest" | "oldest"
export type AdminUsersFormMode = "closed" | "create" | "edit"

export interface AdminUsersEditableUser {
	id: string
	name: string
	email: string
	role: "admin" | "user"
	banned: boolean
}

interface AdminUsersUIState {
	search: string
	filter: AdminUsersRiskFilter
	sort: AdminUsersSortOrder
	formMode: AdminUsersFormMode
	editingUser: AdminUsersEditableUser | null
	setSearch: (search: string) => void
	setFilter: (filter: AdminUsersRiskFilter) => void
	setSort: (sort: AdminUsersSortOrder) => void
	openCreateForm: () => void
	openEditForm: (user: AdminUsersEditableUser) => void
	closeForm: () => void
}

export const useAdminUsersUIStore = create<AdminUsersUIState>((set) => ({
	search: "",
	filter: "all",
	sort: "newest",
	formMode: "closed",
	editingUser: null,
	setSearch: (search) => set({ search }),
	setFilter: (filter) => set({ filter }),
	setSort: (sort) => set({ sort }),
	openCreateForm: () => set({ formMode: "create", editingUser: null }),
	openEditForm: (editingUser) => set({ formMode: "edit", editingUser }),
	closeForm: () => set({ formMode: "closed", editingUser: null }),
}))
