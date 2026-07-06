import { create } from 'zustand';

export type Language = 'th' | 'en';

interface AppState {
  language: Language;
  isLoggedIn: boolean;
  faceIdEnabled: boolean;
  selectedPolicy: {
    id: string;
    name: string;
    nameTh: string;
    sumAssured: number;
    annualPremium: number;
    monthlyPremium: number;
    dueDate: string;
    dueDateEn: string;
    policyNo: string;
  };
  income: number;
  billingFrequency: 'monthly' | 'quarterly' | 'annual';

  setLanguage: (lang: Language) => void;
  setLoggedIn: (v: boolean) => void;
  setFaceIdEnabled: (v: boolean) => void;
  setBillingFrequency: (freq: 'monthly' | 'quarterly' | 'annual') => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'th',
  isLoggedIn: false,
  faceIdEnabled: false,
  income: 38000,
  billingFrequency: 'monthly',

  selectedPolicy: {
    id: 'pol-001',
    name: 'AIA Health Happy',
    nameTh: 'AIA Health Happy',
    sumAssured: 2000000,
    annualPremium: 51000,
    monthlyPremium: 4250,
    dueDate: '25 มิ.ย.',
    dueDateEn: '25 Jun',
    policyNo: '12-3456789',
  },

  setLanguage: (language) => set({ language }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setFaceIdEnabled: (faceIdEnabled) => set({ faceIdEnabled }),
  setBillingFrequency: (billingFrequency) => set({ billingFrequency }),
}));
