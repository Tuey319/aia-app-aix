import { MaterialCommunityIcons } from '@expo/vector-icons';

export type CoverageCategoryId = 'life' | 'ciEarly' | 'ciSevere' | 'accident' | 'hospital' | 'dailyComp';

export interface CoverageCategory {
  id: CoverageCategoryId;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  labelEn: string;
  sublabel?: string;
  sublabelEn?: string;
  pct: number; // current adequacy %, 0–100
  amount: number; // current sum assured / daily limit
  unit: 'lump' | 'daily';
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  bahtPerUnitMonthly: number; // monthly premium per 1 baht of `amount`
}

export const COVERAGE_CATEGORIES: CoverageCategory[] = [
  {
    id: 'life',
    icon: 'umbrella-outline',
    label: 'ชีวิต',
    labelEn: 'Life',
    pct: 12,
    amount: 2700000,
    unit: 'lump',
    sliderMin: 1000000,
    sliderMax: 5000000,
    sliderStep: 100000,
    bahtPerUnitMonthly: 0.002125,
  },
  {
    id: 'ciEarly',
    icon: 'medical-bag',
    label: 'ระดับต้น-กลาง',
    labelEn: 'Early-Mid Stage',
    sublabel: 'โรคร้ายแรง',
    sublabelEn: 'Critical Illness',
    pct: 58,
    amount: 700000,
    unit: 'lump',
    sliderMin: 100000,
    sliderMax: 1500000,
    sliderStep: 100000,
    bahtPerUnitMonthly: 0.0035,
  },
  {
    id: 'ciSevere',
    icon: 'lungs',
    label: 'ระดับรุนแรง',
    labelEn: 'Severe Stage',
    sublabel: 'โรคร้ายแรง',
    sublabelEn: 'Critical Illness',
    pct: 100,
    amount: 4000000,
    unit: 'lump',
    sliderMin: 500000,
    sliderMax: 4000000,
    sliderStep: 100000,
    bahtPerUnitMonthly: 0.0009,
  },
  {
    id: 'accident',
    icon: 'bandage',
    label: 'อุบัติเหตุ',
    labelEn: 'Accident',
    pct: 2,
    amount: 500000,
    unit: 'lump',
    sliderMin: 100000,
    sliderMax: 5000000,
    sliderStep: 100000,
    bahtPerUnitMonthly: 0.00015,
  },
  {
    id: 'hospital',
    icon: 'hospital-building',
    label: 'ค่ารักษาพยาบาล',
    labelEn: 'Hospital Care',
    sublabel: 'ค่าห้อง',
    sublabelEn: 'Room & Board',
    pct: 100,
    amount: 4500,
    unit: 'daily',
    sliderMin: 1000,
    sliderMax: 6000,
    sliderStep: 500,
    bahtPerUnitMonthly: 1.2,
  },
  {
    id: 'dailyComp',
    icon: 'cash-multiple',
    label: 'ค่าชดเชย',
    labelEn: 'Compensation',
    sublabel: 'รายวัน',
    sublabelEn: 'Daily',
    pct: 10,
    amount: 1000,
    unit: 'daily',
    sliderMin: 200,
    sliderMax: 3000,
    sliderStep: 100,
    bahtPerUnitMonthly: 0.8,
  },
];

export function getCoverageCategory(id?: CoverageCategoryId): CoverageCategory {
  return COVERAGE_CATEGORIES.find((c) => c.id === id) ?? COVERAGE_CATEGORIES[0];
}
