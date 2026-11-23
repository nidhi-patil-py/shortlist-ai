export interface User {
  id: string
  email: string
  fullName?: string
  createdAt?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isDemoMode: boolean
}
