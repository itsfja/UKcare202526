/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput, CalculationBreakdown } from '../types';
import { Printer, Download, ArrowLeft, Heart, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface DetailedReportProps {
  input: FinancialAssessmentInput;
  breakdown: CalculationBreakdown;
  onBack: () => void;
}

export const DetailedReport: React.FC<DetailedReportProps> = ({ input, breakdown, onBack }) => {
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
