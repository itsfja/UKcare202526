/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinancialAssessmentInput, CalculationBreakdown } from '../types';
import { Printer, Download, ArrowLeft, Heart, CheckCircle, ShieldAlert, Sparkles, Banknote, Sliders } from 'lucide-react';

interface DetailedReportProps {
  input: FinancialAssessmentInput;
  breakdown: CalculationBreakdown;
  onBack: () => void;
}

export const DetailedReport: React.FC<DetailedReportProps> = ({ input, breakdown, onBack }) => {
  const [housekeeping, setHousekeeping] = useState<number>(206.98);
  const [useAstronomical, setUseAstronomical] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textContent = `
==================================================
   UK COUNCIL HOME CARE CONTRIBUTION STATEMENT
==================================================
Date of Assessment: ${new Date().toLocaleDateString()}
Region: ${input.region.toUpperCase()}
Age Category: ${input.ageCategory}
Relationship Status: ${input.relationshipStatus}
Disability Premium Status: ${input.disabilityPremium}
Carer Premium: ${input.hasCarerPremium ? 'Yes' : 'No'}

--------------------------------------------------
1. CARE PACKAGE COSTS
--------------------------------------------------
Care hours/week: ${input.carePackage.useCustomWeeklyCost ? 'N/A' : input.carePackage.hoursPerWeek + ' hours'}
Hourly rate: ${input.carePackage.useCustomWeeklyCost ? 'N/A' : '£' + input.carePackage.hourlyRate.toFixed(2)}
Total weekly care cost: £${breakdown.actualWeeklyCareCost.toFixed(2)}

--------------------------------------------------
2. CAPITAL AND SAVINGS
--------------------------------------------------
Bank Accounts & Cash: £${input.capital.bankAccounts.toLocaleString()}
Investments / Shares: £${input.capital.investments.toLocaleString()}
Other Property: £${input.capital.otherProperty.toLocaleString()}
Total Assessable Capital: £${breakdown.totalCapital.toLocaleString()}
Tariff Income Applied: £${breakdown.tariffIncome.toFixed(2)} /week
Self-Funder status: ${breakdown.isSelfFunder ? 'YES' : 'NO'}

--------------------------------------------------
3. WEEKLY INCOME
--------------------------------------------------
State Pension: £${input.income.statePension.toFixed(2)}
Pension Credit: £${input.income.pensionCredit.toFixed(2)}
Attendance Allowance: £${input.income.attendanceAllowance.toFixed(2)}
PIP Daily Living: £${input.income.pipCare.toFixed(2)}
DLA Care Component: £${input.income.dlaCare.toFixed(2)}
Occupational / Private Pension: £${input.income.occupationalPension.toFixed(2)}
Employment Earnings (Disregarded): £${input.income.employmentEarnings.toFixed(2)}
Other Income / Benefits: £${(input.income.otherBenefits + input.income.otherIncome).toFixed(2)}

Total Gross Income: £${breakdown.totalGrossIncome.toFixed(2)}
Total Disregarded Income: £${breakdown.totalDisregardedIncome.toFixed(2)}
Total Assessable Income: £${breakdown.totalAssessableIncomeSources.toFixed(2)}

--------------------------------------------------
4. ALLOWABLE DEDUCTIONS & EXPENSES
--------------------------------------------------
Minimum Income Guarantee (MIG): £${breakdown.totalMig.toFixed(2)}
Net Housing Costs (after support): £${breakdown.netHousingCosts.toFixed(2)}
Total Disability Related Expenditure (DRE): £${breakdown.totalDre.toFixed(2)}
Total Deductions allowed: £${breakdown.totalAllowableDeductions.toFixed(2)}

--------------------------------------------------
5. ASSESSMENT BREAKDOWN SUMMARY
--------------------------------------------------
Net Weekly Income Above Deductions: £${breakdown.netWeeklyIncome.toFixed(2)}
Maximum Weekly Care Charge: £${breakdown.maximumWeeklyCharge.toFixed(2)}

==================================================
ESTIMATED WEEKLY CONTRIBUTION SUMMARY:
--------------------------------------------------
YOUR WEEKLY CONTRIBUTION: £${breakdown.userWeeklyContribution.toFixed(2)}
COUNCIL WEEKLY CONTRIBUTION: £${breakdown.councilWeeklyContribution.toFixed(2)}
==================================================

*Disclaimer: This is an estimated advice statement. Actual funding depends on a formal means test and care needs assessment performed by your local council.*
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Home_Care_Contribution_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="detailed-report-view">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl print:hidden">
        <button
          type="button"
          onClick={onBack}
          id="report-back-btn"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculator Edit
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            id="report-download-btn"
            onClick={handleDownloadText}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            id="report-print-btn"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Print Full Report
          </button>
        </div>
      </div>

      {/* Main Print Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* Report Brand Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm uppercase tracking-wider">
              <Heart className="h-4 w-4" />
              <span>Independent Assessment</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Financial Assessment Report</h1>
            <p className="text-xs text-slate-400 mt-0.5">Council Care at Home Contribution Assessment Estimate</p>
          </div>
          <div className="text-left sm:text-right font-mono text-xs text-slate-500 space-y-1">
            <div>Date: {new Date().toLocaleDateString()}</div>
            <div>Region: <span className="font-bold text-slate-800">{input.region.toUpperCase()}</span></div>
            <div>Status: <span className="font-bold text-slate-800">{input.relationshipStatus.toUpperCase()}</span></div>
          </div>
        </div>

        {/* Highlight Result Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Personal Cost</span>
            <span className="text-3xl font-black text-indigo-300 mt-1">£{breakdown.userWeeklyContribution.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">estimated personal contribution</span>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Council Funded</span>
            <span className="text-3xl font-black text-emerald-400 mt-1">£{breakdown.councilWeeklyContribution.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">estimated local authority funding</span>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Value of Care</span>
            <span className="text-3xl font-black text-white mt-1">£{breakdown.actualWeeklyCareCost.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">hours * hourly charge rate</span>
          </div>
        </div>

        {/* Section 1: Demographics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            1. Applicant Demographics & Variables
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-xs font-medium">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">UK Region</span>
              <span className="text-slate-800 font-bold capitalize">{input.region}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Age Category</span>
              <span className="text-slate-800 font-bold">
                {input.ageCategory === 'pension-age' ? 'Pension Age +' : input.ageCategory === 'under-25' ? 'Aged 18-24' : 'Aged 25 to Pension'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Disability Premium</span>
              <span className="text-slate-800 font-bold capitalize">{input.disabilityPremium}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Carer Status</span>
              <span className="text-slate-800 font-bold">{input.hasCarerPremium ? 'Receives Carer Premium' : 'No Carer Premium'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Capital and Means Test */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            2. Capital means test (excluding main home)
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Cash, Savings, Bank and ISA Accounts:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.bankAccounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Stocks, Shares and Private Investments:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.investments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Other Properties, Land or Assets:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.otherProperty.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold text-sm">
              <span>Total Assessed Assets:</span>
              <span className="font-mono text-indigo-900">£{breakdown.totalCapital.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 pt-1">
              <span>Tariff Income calculated from excess savings:</span>
              <span className="font-mono font-semibold text-indigo-700">£{breakdown.tariffIncome.toFixed(2)} /week</span>
            </div>
          </div>
        </div>

        {/* Section 3: Income details */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            3. Weekly income assessment details
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>State Retirement Pension:</span>
              <span className="font-mono">£{input.income.statePension.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Pension Credit (Guarantee or Savings):</span>
              <span className="font-mono">£{input.income.pensionCredit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Attendance Allowance / PIP / DLA Care:</span>
              <span className="font-mono">
                £{(input.income.attendanceAllowance + input.income.pipCare + input.income.dlaCare).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Occupational & Private Pensions:</span>
              <span className="font-mono">£{input.income.occupationalPension.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Earnings from employment (100% Ignored):</span>
              <span className="font-mono line-through">£{input.income.employmentEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Other eligible benefits & other income:</span>
              <span className="font-mono">£{(input.income.otherBenefits + input.income.otherIncome).toFixed(2)}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold">
              <span>Total Assessable Weekly Income Sources:</span>
              <span className="font-mono">£{breakdown.totalAssessableIncomeSources.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Allowable Expenses & Deductions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            4. Allowable Expenses & Income Protections
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Minimum Income Guarantee (MIG) baseline:</span>
              <span className="font-mono">£{breakdown.baseMig.toFixed(2)}</span>
            </div>
            {(breakdown.disabilityPremiumAmount > 0 || breakdown.carerPremiumAmount > 0) && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Disability & Carer MIG Premium additions:</span>
                <span className="font-mono">
                  + £{(breakdown.disabilityPremiumAmount + breakdown.carerPremiumAmount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <span>Net Allowable Housing Costs (Rent, Mortgage, Council Tax paid):</span>
              <span className="font-mono">£{breakdown.netHousingCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-700 font-semibold">
              <span>Disability Related Expenditure (DRE) total:</span>
              <span className="font-mono">£{breakdown.totalDre.toFixed(2)}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold">
              <span>Total Weekly Deductions Allowed:</span>
              <span className="font-mono text-emerald-800">£{breakdown.totalAllowableDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Math Formula */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 font-mono">
          <h4 className="font-bold text-slate-800">Assessed Contribution Calculations:</h4>
          <div className="flex justify-between">
            <span>Assessable Weekly Income (Sources + Tariff):</span>
            <span>£{(breakdown.totalAssessableIncomeSources + breakdown.tariffIncome).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>– Total Allowable Deductions:</span>
            <span>– £{breakdown.totalAllowableDeductions.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-300" />
          <div className="flex justify-between text-slate-900 font-bold">
            <span>Net weekly excess income (Max contribution limit):</span>
            <span>£{breakdown.netWeeklyIncome.toFixed(2)}</span>
          </div>
        </div>

        {/* Section 6: Personal Budget, Housekeeping & Net Surplus */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>6. Personal Budget & Cash Flow Analysis</span>
            <span className="text-[10px] text-blue-900 font-mono font-bold uppercase tracking-wide normal-case bg-blue-50 px-2 py-0.5 rounded print:hidden">
              On-Screen Budget Tool
            </span>
          </h3>

          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-4 text-xs">
            <p className="text-[11px] text-slate-500 leading-normal">
              This section reconciles your real-world cash flows. Unlike statutory limits, it calculates your remaining cash surplus after paying the Council Care Bill, housing costs, disability-related expenses (DRE), and a specified housekeeping allowance.
            </p>

            {/* Formula Selector & Interactive Input (Hidden on Print) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
              {/* Formula */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-blue-500" />
                  Monthly Formula:
                </span>
                <div className="flex bg-slate-100 p-0.5 rounded-md text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => setUseAstronomical(true)}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      useAstronomical
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Astronomical (4.348)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseAstronomical(false)}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      !useAstronomical
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Standard (4.333)
                  </button>
                </div>
              </div>

              {/* Input */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Weekly Housekeeping:</span>
                <div className="relative rounded-md shadow-xs w-32">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <span className="text-slate-400 font-mono">£</span>
                  </div>
                  <input
                    type="number"
                    value={housekeeping === 0 ? '' : housekeeping}
                    onChange={(e) => setHousekeeping(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block w-full rounded-md border border-slate-200 py-1 pl-5 pr-7 text-right text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <span className="text-[9px] text-slate-400 font-mono">/wk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Display of selected values for Print Only */}
            <div className="hidden print:grid grid-cols-2 gap-4 pb-1 border-b border-slate-100 text-[11px] font-mono text-slate-500">
              <div>Monthly Conversion Factor: <span className="font-bold text-slate-800">{useAstronomical ? '4.34833 weeks/mo' : '4.33333 weeks/mo'}</span></div>
              <div className="text-right">Budgeted Weekly Housekeeping: <span className="font-bold text-slate-800">£{housekeeping.toFixed(2)}</span></div>
            </div>

            {/* Calculations Grid */}
            {(() => {
              const multiplier = useAstronomical ? 4.348333333 : (52 / 12);
              
              // Cash values
              const weeklyIn = breakdown.totalGrossIncome;
              const monthlyIn = weeklyIn * multiplier;

              const weeklyCare = breakdown.userWeeklyContribution;
              const monthlyCare = weeklyCare * multiplier;

              const weeklyHousing = breakdown.netHousingCosts;
              const monthlyHousing = weeklyHousing * multiplier;

              const weeklyDre = breakdown.totalDre;
              const monthlyDre = weeklyDre * multiplier;

              const weeklyHousekeeping = housekeeping;
              const monthlyHousekeeping = housekeeping * multiplier;

              // Remaining Surplus
              const weeklyDisposable = weeklyIn - weeklyCare - weeklyHousing - weeklyDre;
              const monthlyDisposable = weeklyDisposable * multiplier;

              const finalWeeklySurplus = weeklyDisposable - weeklyHousekeeping;
              const finalMonthlySurplus = finalWeeklySurplus * multiplier;

              return (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-12 gap-2 font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 text-[9px]">
                    <span className="col-span-6">Budget Item</span>
                    <span className="col-span-3 text-right">Weekly Cash Flow</span>
                    <span className="col-span-3 text-right">Monthly Cash Flow</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-slate-600 text-xs">
                    <span className="col-span-6">1. Total Actual Inflow (Benefits & Pensions):</span>
                    <span className="col-span-3 text-right font-mono">£{weeklyIn.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono text-slate-800 font-bold">£{monthlyIn.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">2. Less Estimated Council Care Bill:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyCare.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyCare.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">3. Less Net Rent, Mortgage & Council Tax:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyHousing.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyHousing.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">4. Less Actual Disability-Related Spend (DRE):</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyDre.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyDre.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className="grid grid-cols-12 gap-2 items-center text-slate-800 font-extrabold bg-blue-50/50 p-2 rounded text-xs">
                    <span className="col-span-6">5. Net Cash Remaining (Disposable Income):</span>
                    <span className="col-span-3 text-right font-mono">£{weeklyDisposable.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono text-blue-900 font-black">£{monthlyDisposable.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">6. Less Budgeted Housekeeping Allowance:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyHousekeeping.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyHousekeeping.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className={`p-3 rounded-xl border grid grid-cols-12 gap-2 items-center text-xs ${
                    finalWeeklySurplus >= 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                  }`}>
                    <span className="col-span-6">
                      {finalWeeklySurplus >= 0 ? 'Anticipated Net Cash Surplus (Pocket Money):' : 'Anticipated Budget Shortfall:'}
                    </span>
                    <span className="col-span-3 text-right font-mono">£{finalWeeklySurplus.toFixed(2)} /wk</span>
                    <span className={`col-span-3 text-right font-mono text-sm font-extrabold ${finalWeeklySurplus >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      £{finalMonthlySurplus.toFixed(2)} /mo
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Disclaimer / Notice footer */}
        <div className="border-t border-slate-100 pt-6 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Advisory Disclaimer
          </h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            This statement is an independent estimation tool based on government guidelines (Care Act charging regulations). It is designed to assist you in preparing for a council financial assessment. It does not guarantee funding or constitute legal binding advice. Councils may interpret specific incomes and Disability Related Expenditure (DRE) depending on local guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};
