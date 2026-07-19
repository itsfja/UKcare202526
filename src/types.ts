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

export interface StHelensDetails {
  services: 'community' | 'respite' | 'permanent';
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  phone: string;
  mobile: string;
  maritalStatus: 'single' | 'married' | 'widowed' | 'partner' | 'divorced' | 'separated';
  
  // People living with you
  peopleLivingWith: Array<{ name: string; dob: string; relationship: string; nino?: string }>;
  
  // Partner benefits and weekly figures
  partnerBenefits: {
    esa?: number;
    incomeSupport?: number;
    industrialInjuries?: number;
    jsa?: number;
    pensionCreditGuarantee?: number;
    pensionCreditSavings?: number;
    severeDisablement?: number;
    statePension?: number;
    taxCredits?: number;
    universalCredit?: number;
    warPension?: number;
    warWidowsPension?: number;
    attendanceAllowanceDlaCare?: number;
    pipDailyLiving?: number;
    dlaMobility?: number;
    pipMobility?: number;
    hasMotabilityVehicle?: boolean;
    other?: number;
  };
  carersAllowancePaid: boolean;
  carersAllowancePaidTo: string;
  housingBenefitPaid: boolean;
  housingBenefitAmount: number;
  councilTaxBenefitPaid: boolean;
  councilTaxBenefitAmount: number;
  
  // Private and Occupational Pensions
  pensions: Array<{ payee: string; netAmount: number; frequency: string; provider: string; evidence: boolean }>;
  passHalfOccupationalPension: boolean; // Care home only
  
  // Earnings
  earnings: Array<{ payee: string; netAmount: number; frequency: string; employer: string; evidence: boolean }>;
  
  // Capital Accounts List
  capitalAccounts: Array<{ holder: string; bank: string; accountNo: string; amount: number; evidence: boolean }>;
  giftedCapital: boolean;
  giftedDetails: string;
  
  // Will
  willMade: 'yes' | 'no' | 'unknown';
  executors: Array<{ name: string; address: string }>;
  willLocation: string;
  
  // Property
  propertyType: 'bungalow' | 'flat' | 'detached' | 'terraced' | 'semi-detached' | 'care-home' | 'other';
  propertyTypeOther: string;
  paysCouncilTax: boolean;
  annualCouncilTax: number;
  
  // Owner Occupier
  soleOwner: 'yes' | 'no' | 'na';
  jointOwner: 'yes' | 'no' | 'na';
  otherOwnersShare: string;
  mortgageSecured: 'yes' | 'no' | 'na';
  mortgageDetails: { provider: string; balance: number; monthlyRepayment: number };
  deedsLocation: string;
  
  // Rented
  partnerOrRelativeOwns: 'yes' | 'no' | 'na';
  relativeRelationship: string;
  rentedPrivateLandlord: 'yes' | 'no' | 'na';
  rentedHousingAssociation: 'yes' | 'no' | 'na';
  rentAmount: number;
  rentFrequency: 'weekly' | 'monthly';
  serviceChargesIncluded: 'yes' | 'no';
  otherLivingArrangements: string;
  
  // Former Homes
  everOwnedHome: 'yes' | 'no';
  formerHomeAddress: string;
  formerHomeDateSold: string;
  
  // Other Property
  ownOtherProperty: 'yes' | 'no';
  otherPropertyAddress: string;
  otherPropertyOccupied: 'yes' | 'no' | 'na';
  otherPropertyRentalIncome: 'yes' | 'no' | 'na';
  otherPropertyRentAmount: number;
  otherPropertyRentFrequency: 'weekly' | 'monthly';
  otherPropertyMortgage: 'yes' | 'no';
  otherPropertyMortgageDetails: string;
  
  // DRE Full table details (maps to calculations as well)
  dreItems: {
    careline: number;
    continence: number;
    washingLaundry: number;
    chiropody: number;
    clothingFootwear: number;
    bedding: number;
    meteredWater: number;
    extraHeating: number;
    cleaningDomestic: number;
    gardenMaintenance: number;
    equipmentHireRepair: number;
    privateCare: number;
    other1: number;
    other1Desc: string;
    other2: number;
    other2Desc: string;
  };
  
  // Rep
  hasRep: boolean;
  repType: 'voluntary' | 'deputy' | 'poa' | 'appointee' | 'none';
  repName: string;
  repAddress: string;
  repPhone: string;
  repRelationship: string;
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
  
  // Optional St Helens Council Mode fields
  isStHelensMode?: boolean;
  customerName?: string;
  customerRef?: string;
  nino?: string;
  assessorName?: string;
  assessmentDate?: string;
  stHelens?: StHelensDetails;
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
