/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  FinancialAssessmentInput,
  CalculationBreakdown,
  Region,
  AgeCategory,
  DisabilityPremiumType,
} from '../types';

/**
 * Calculates the Minimum Income Guarantee (MIG) for England (2024/2025 guidelines)
 * Councils are required to leave people with at least this amount of income per week.
 */
export function getMIGDetails(
  region: Region,
  ageCategory: AgeCategory,
  disabilityPremium: DisabilityPremiumType,
  hasCarerPremium: boolean
) {
  let baseMig = 0;
  let disabilityPremiumAmount = 0;
  let carerPremiumAmount = 0;

  if (region === 'england' || region === 'ni') {
    // England standard MIG rules (2024/25 limits, Northern Ireland matches or is free)
    if (ageCategory === 'under-25') {
      baseMig = 87.15;
    } else if (ageCategory === '25-to-pension') {
      baseMig = 109.95;
    } else {
      // Pension age
      baseMig = 228.70;
    }

    // Add disability premiums to MIG if selected
    if (disabilityPremium === 'standard') {
      disabilityPremiumAmount = 41.50;
    } else if (disabilityPremium === 'enhanced') {
      disabilityPremiumAmount = 19.70; // Added on top of standard or base
    } else if (disabilityPremium === 'severe') {
      disabilityPremiumAmount = 80.40;
    }

    if (hasCarerPremium) {
      carerPremiumAmount = 45.60;
    }
  } else if (region === 'wales') {
    // Wales has higher basic allowances (MIG)
    if (ageCategory === 'under-25') {
      baseMig = 102.50;
    } else if (ageCategory === '25-to-pension') {
      baseMig = 125.00;
    } else {
      baseMig = 249.50;
    }

    if (disabilityPremium === 'standard') {
      disabilityPremiumAmount = 45.00;
    } else if (disabilityPremium === 'enhanced') {
      disabilityPremiumAmount = 22.00;
    } else if (disabilityPremium === 'severe') {
      disabilityPremiumAmount = 85.00;
    }

    if (hasCarerPremium) {
      carerPremiumAmount = 48.00;
    }
  } else {
    // Scotland standard non-residential MIG limits
    if (ageCategory === 'under-25') {
      baseMig = 95.00;
    } else if (ageCategory === '25-to-pension') {
      baseMig = 118.00;
    } else {
      baseMig = 238.00;
    }

    if (disabilityPremium === 'standard') {
      disabilityPremiumAmount = 43.00;
    } else if (disabilityPremium === 'enhanced') {
      disabilityPremiumAmount = 20.50;
    } else if (disabilityPremium === 'severe') {
      disabilityPremiumAmount = 82.00;
    }

    if (hasCarerPremium) {
      carerPremiumAmount = 46.50;
    }
  }

  // Under England rules, enhanced disability premium is often additive,
  // but to simplify and ensure a realistic and conservative estimate, we represent them as distinct tiers:
  // Standard Disability Premium, Enhanced Disability Premium, and Severe Disability Premium.
  return {
    baseMig,
    disabilityPremiumAmount,
    carerPremiumAmount,
    totalMig: baseMig + disabilityPremiumAmount + carerPremiumAmount,
  };
}

/**
 * Calculate financial assessment weekly contribution
 */
export function calculateAssessment(input: FinancialAssessmentInput): CalculationBreakdown {
  const { region, ageCategory, relationshipStatus, disabilityPremium, hasCarerPremium, capital, income, expenses, carePackage } = input;

  // 1. Calculate Capital Limits
  let upperCapitalLimit = 23250;
  let lowerCapitalLimit = 14250;
  let tariffIncomeRate = 250; // £1 per £250

  if (region === 'wales') {
    upperCapitalLimit = 24000;
    lowerCapitalLimit = 24000; // Wales has a flat limit
  } else if (region === 'scotland') {
    upperCapitalLimit = 32750;
    lowerCapitalLimit = 20250;
  } else if (region === 'ni') {
    upperCapitalLimit = 23250;
    lowerCapitalLimit = 14250;
  }

  const totalCapital = capital.bankAccounts + capital.investments + capital.otherProperty;

  // 2. Check Self-Funder status
  let isSelfFunder = false;
  let selfFunderReason: 'capital_above_limit' | 'none' = 'none';

  if (totalCapital > upperCapitalLimit) {
    isSelfFunder = true;
    selfFunderReason = 'capital_above_limit';
  }

  // 3. Tariff Income Calculation
  let tariffIncome = 0;
  if (!isSelfFunder && region !== 'wales' && totalCapital > lowerCapitalLimit) {
    const excessCapital = totalCapital - lowerCapitalLimit;
    // Round up to the nearest £250 part
    tariffIncome = Math.ceil(excessCapital / tariffIncomeRate);
  }

  // 4. Free care checks (Northern Ireland is free, Scotland is free for personal care over 65)
  const isFreeHomeCare = region === 'ni' || (region === 'scotland' && ageCategory === 'pension-age');

  // 5. Total Incomes
  const totalGrossIncome =
    income.statePension +
    income.pensionCredit +
    income.pipMobility +
    income.pipCare +
    income.dlaMobility +
    income.dlaCare +
    income.attendanceAllowance +
    income.occupationalPension +
    income.employmentEarnings +
    income.otherBenefits +
    income.otherIncome;

  // Disregarded Incomes
  // Employment earnings, mobility benefits, and certain other elements are always ignored
  const totalDisregardedIncome =
    income.employmentEarnings +
    income.pipMobility +
    income.dlaMobility;

  const totalAssessableIncomeSources = totalGrossIncome - totalDisregardedIncome;

  // 6. MIG Details
  const migDetails = getMIGDetails(region, ageCategory, disabilityPremium, hasCarerPremium);

  // 7. Housing Costs
  const grossHousingCosts = expenses.rent + expenses.mortgage + expenses.councilTax;
  const housingBenefits = expenses.housingBenefit + expenses.councilTaxSupport;
  const netHousingCosts = Math.max(0, grossHousingCosts - housingBenefits);

  // 8. Disability Related Expenditure (DRE)
  const totalDre =
    expenses.dreExtraHeating +
    expenses.dreCommunityAlarm +
    expenses.dreSpecialClothing +
    expenses.dreExtraLaundry +
    expenses.dreMobilityEquipment +
    expenses.dreSpecialDiet +
    expenses.dreOther;

  const totalAllowableDeductions = migDetails.totalMig + netHousingCosts + totalDre;

  // 9. Care Costs
  let actualWeeklyCareCost = carePackage.useCustomWeeklyCost
    ? carePackage.totalWeeklyCost
    : carePackage.hoursPerWeek * carePackage.hourlyRate;

  // 10. Maximum Assessable Income (Assessable Income Sources + Tariff Income - Allowable Deductions)
  const netWeeklyIncome = Math.max(0, (totalAssessableIncomeSources + tariffIncome) - totalAllowableDeductions);

  // Maximum Weekly Charge caps
  const walesCapApplies = region === 'wales';
  const walesCapLimit = 100; // Wales cap on weekly charging for home care is £100

  let maximumWeeklyCharge = netWeeklyIncome;
  if (walesCapApplies) {
    // In Wales, if self-funder (capital > 24000) or maximum income calculation is high, the max charge is £100
    if (isSelfFunder) {
      maximumWeeklyCharge = walesCapLimit;
    } else {
      maximumWeeklyCharge = Math.min(netWeeklyIncome, walesCapLimit);
    }
  }

  // Apply calculations
  let userWeeklyContribution = 0;
  let councilWeeklyContribution = 0;

  if (isFreeHomeCare) {
    userWeeklyContribution = 0;
    councilWeeklyContribution = actualWeeklyCareCost;
  } else if (isSelfFunder) {
    if (walesCapApplies) {
      userWeeklyContribution = Math.min(actualWeeklyCareCost, walesCapLimit);
      councilWeeklyContribution = Math.max(0, actualWeeklyCareCost - userWeeklyContribution);
    } else {
      userWeeklyContribution = actualWeeklyCareCost;
      councilWeeklyContribution = 0;
    }
  } else {
    // Contribution is the lower of maximum weekly charge or the actual care cost
    userWeeklyContribution = Math.min(maximumWeeklyCharge, actualWeeklyCareCost);
    councilWeeklyContribution = Math.max(0, actualWeeklyCareCost - userWeeklyContribution);
  }

  return {
    isSelfFunder,
    selfFunderReason,
    upperCapitalLimit,
    lowerCapitalLimit,
    totalCapital,
    tariffIncome,
    totalGrossIncome,
    totalDisregardedIncome,
    totalAssessableIncomeSources,
    baseMig: migDetails.baseMig,
    disabilityPremiumAmount: migDetails.disabilityPremiumAmount,
    carerPremiumAmount: migDetails.carerPremiumAmount,
    totalMig: migDetails.totalMig,
    netHousingCosts,
    totalDre,
    totalAllowableDeductions,
    netWeeklyIncome,
    maximumWeeklyCharge,
    actualWeeklyCareCost,
    userWeeklyContribution,
    councilWeeklyContribution,
    isFreeHomeCare,
    walesCapApplies,
    walesCapLimit,
  };
}

/**
 * Provides a default input structure for the assessment wizard
 */
export function getDefaultInput(): FinancialAssessmentInput {
  return {
    region: 'england',
    ageCategory: 'pension-age',
    relationshipStatus: 'single',
    disabilityPremium: 'none',
    hasCarerPremium: false,
    capital: {
      bankAccounts: 12000,
      investments: 0,
      otherProperty: 0,
    },
    income: {
      statePension: 169.50,
      pensionCredit: 48.65,
      pipMobility: 0,
      pipCare: 0,
      dlaMobility: 0,
      dlaCare: 0,
      attendanceAllowance: 72.65, // Standard lower rate Attendance Allowance
      occupationalPension: 45.00,
      employmentEarnings: 0,
      otherBenefits: 0,
      otherIncome: 0,
    },
    expenses: {
      rent: 120,
      mortgage: 0,
      councilTax: 25,
      housingBenefit: 100,
      councilTaxSupport: 20,
      dreExtraHeating: 0,
      dreCommunityAlarm: 0,
      dreSpecialClothing: 0,
      dreExtraLaundry: 0,
      dreMobilityEquipment: 0,
      dreSpecialDiet: 0,
      dreOther: 0,
      dreOtherDescription: '',
    },
    carePackage: {
      hoursPerWeek: 12,
      hourlyRate: 22.50,
      useCustomWeeklyCost: false,
      totalWeeklyCost: 270,
    },
  };
}
