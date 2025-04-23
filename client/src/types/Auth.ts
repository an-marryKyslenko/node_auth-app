export type AuthState = {
  token: string | null,
  isAuthenticated: boolean
}

export type ActivationStatus = 'idle' | 'loading' | 'success' | 'error';
