import { create } from 'zustand';

interface CompanyState {
  companyId: string | null;
  setCompanyId: (companyId: string | null) => void;
}

const useCompanyStore = create<CompanyState>((set) => ({
  companyId: null,
  setCompanyId: (companyId) => set({ companyId }),
}));

export default useCompanyStore;
