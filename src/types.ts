/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FinancialYear = '2024-25' | '2025-26' | '2026-27';

export type Region = 'england' | 'scotland' | 'wales' | 'ni';

export type AgeCategory = 'under-25' | '25-to-pension' | 'pension-age';

export type RelationshipStatus = 'single' | 'couple';

export type DisabilityPremiumType = 'none' | 'standard' | 'enhanced' | 'severe';

export interface CapitalDetails {
  bankAccounts: number;
  investments: number;
  otherProperty: number;
}

export interface IncomeDetails {
  statePension: number;
  pensionCredit: number;
  pipMobility: number; // Disregarded
  pipCare: number;
  dlaMobility: number; // Disregarded
  dlaCare: number;
  attendanceAllowance: number;
  occupationalPension: number;
  employmentEarnings: number; // Disregarded
  otherBenefits: number;
  otherIncome: number;
}

export interface ExpenseDetails {
  rent: number;
  mortgage: number;
  councilTax: number;
  housingBenefit: number;
  councilTaxSupport: number;
  // Disability Related Expenditure (DRE)
  dreExtraHeating: number;
  dreCommunityAlarm: number;
  dreSpecialClothing: number;
  dreExtraLaundry: number;
  dreMobilityEquipment: number;
  dreSpecialDiet: number;
  dreOther: number;
  dreOtherDescription: string;
}

export interface CarePackageDetails {
  hoursPerWeek: number;
  hourlyRate: number;
  useCustomWeeklyCost: boolean;
  totalWeeklyCost: number;
}

export interface FinancialAssessmentInput {
  financialYear: FinancialYear;
  region: Region;
  ageCategory: AgeCategory;
  relationshipStatus: RelationshipStatus;
  disabilityPremium: DisabilityPremiumType;
  hasCarerPremium: boolean;
  capital: CapitalDetails;
  income: IncomeDetails;
  expenses: ExpenseDetails;
  carePackage: CarePackageDetails;
}

export interface CalculationBreakdown {
  isSelfFunder: boolean;
  selfFunderReason: 'capital_above_limit' | 'none';
  upperCapitalLimit: number;
  lowerCapitalLimit: number;
  totalCapital: number;
  tariffIncome: number;
  
  // Income
  totalGrossIncome: number;
  totalDisregardedIncome: number;
  totalAssessableIncomeSources: number;
  
  // MIG (Minimum Income Guarantee)
  baseMig: number;
  disabilityPremiumAmount: number;
  carerPremiumAmount: number;
  totalMig: number;
  
  // Expenses
  netHousingCosts: number;
  totalDre: number;
  totalAllowableDeductions: number;
  
  // Calculations
  netWeeklyIncome: number;
  maximumWeeklyCharge: number;
  actualWeeklyCareCost: number;
  userWeeklyContribution: number;
  councilWeeklyContribution: number;
  
  // Regional flags
  isFreeHomeCare: boolean; // For Scotland (Personal Care over 65) or NI
  walesCapApplies: boolean;
  walesCapLimit: number;
}

export interface SavedAssessment {
  id: string;
  name: string;
  date: string;
  input: FinancialAssessmentInput;
}
