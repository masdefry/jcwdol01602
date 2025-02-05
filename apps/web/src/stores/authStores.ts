import { create } from 'zustand';
import { deleteCookie } from 'cookies-next';

export interface IAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface IAuthStore {
  account: IAccount | null;
  onAuthSuccess: (account: IAccount | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
  account: null,
  onAuthSuccess: (payload) => set(() => ({ account: payload })),
  clearAuth: () => {
    set(() => ({ account: null }));
    deleteCookie('access_token');
  },
}));

export default useAuthStore;
