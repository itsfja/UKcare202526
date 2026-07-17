/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CalculationBreakdown, Region, FinancialAssessmentInput } from '../types';
import { ShieldCheck, Calendar, Info, HeartHandshake, Sparkles, TrendingUp, ChevronDown, ChevronUp, Banknote, Sliders } from 'lucide-react';

interface CalculationSummaryProps {
  breakdown: CalculationBreakdown;
  region: Region;
  input?: FinancialAssessmentInput;
}

export const CalculationSummary: React.FC<CalculationSummaryProps> = ({ breakdown, region, input }) => {
  const [budgetOpen, setBudgetOpen] = useState(true);
  const [housekeeping, setHousekeeping] = useState<number>(206.98);
  const [useAstronomical, setUseAstronomical] = useState<boolean>(true);
  const {
    isSelfFunder,
    selfFunderReason,
    totalCapital,
    upperCapitalLimit,
    tariffIncome,
    totalGrossIncome,
    totalDisregardedIncome,
    totalAssessableIncomeSources,
    totalMig,
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
  } = breakdown;

  // Percentage calculations for visual split-bar
  const totalCost = actualWeeklyCareCost || 1;
  const userPercent = Math.min(100, (userWeeklyContribution / totalCost) * 100);
  const councilPercent = Math.max(0, 100 - userPercent);

  return (
    <div className="bg-white border-2 border-blue-900 rounded-xl shadow-lg flex flex-col overflow-hidden sticky top-6 animate-fade-in" id="calculation-summary-panel">
      {/* Design Header */}
      <div className="bg-blue-900 px-4 py-3 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-xs uppercase tracking-widest text-blue-100">Calculation Summary</h3>
        <span className="text-[10px] bg-blue-800/80 px-2 py-0.5 rounded border border-blue-700 text-blue-200 font-semibold uppercase">Indicative</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Main Big Contribution Display */}
        <div className="text-center bg-slate-50 rounded-lg p-5 border border-slate-200 shadow-sm space-y-1 relative overflow-hidden">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Your Weekly Contribution</span>
          <div className="text-5xl font-extrabold text-blue-900 tracking-tight font-mono">
            £{userWeeklyContribution.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">estimated contribution</span>

          {/* Contribution Tag Badge */}
          <div className="inline-flex pt-2">
            {isFreeHomeCare ? (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-200">
                <Sparkles className="h-3 w-3" />
                100% Free Care
              </span>
            ) : isSelfFunder ? (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                {region === 'wales' ? 'Wales Max Cap Applied' : 'Self-Funder (Full Cost)'}
              </span>
            ) : userWeeklyContribution === 0 ? (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                No Contribution
              </span>
            ) : userWeeklyContribution === actualWeeklyCareCost ? (
              <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200">
                Pays Care In Full
              </span>
            ) : (
              <span className="bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                Assisted Funding
              </span>
            )}
          </div>
        </div>

        {/* Visual Share Split Bar */}
        <div className="space-y-2 bg-white rounded-lg p-3.5 border border-slate-200">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-slate-500">
            <span>Your share</span>
            <span>Council share</span>
          </div>
          <div className="relative h-3.5 w-full bg-slate-100 rounded overflow-hidden flex border border-slate-200">
            {userPercent > 0 && (
              <div
                className="bg-blue-900 h-full transition-all duration-500"
                style={{ width: `${userPercent}%` }}
              />
            )}
            {councilPercent > 0 && (
              <div
                className="bg-emerald-600 h-full transition-all duration-500"
                style={{ width: `${councilPercent}%` }}
              />
            )}
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-bold text-blue-900 font-mono">£{userWeeklyContribution.toFixed(2)} ({userPercent.toFixed(0)}%)</span>
            <span className="font-bold text-emerald-700 font-mono">£{councilWeeklyContribution.toFixed(2)} ({councilPercent.toFixed(0)}%)</span>
          </div>
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2 mt-1">
            Care package weekly cost: <strong className="font-mono text-slate-600">£{actualWeeklyCareCost.toFixed(2)}</strong>
          </div>
        </div>

        {/* 📋 Care Cost Calculation Detail */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 space-y-2.5">
          <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-widest flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="flex items-center gap-1">
              <HeartHandshake className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              Cost of Care Calculation
            </span>
            <span className="text-[9px] text-indigo-900 bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">weekly</span>
          </h4>
          <div className="text-xs space-y-1.5">
            {input ? (
              <>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Calculation Basis:</span>
                  <span className="font-semibold text-slate-700">
                    {input.carePackage.useCustomWeeklyCost ? 'Custom Budget' : 'Standard Rate'}
                  </span>
                </div>
                {!input.carePackage.useCustomWeeklyCost ? (
                  <>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Assessed Care Hours:</span>
                      <span className="font-mono text-slate-700 font-semibold">{input.carePackage.hoursPerWeek} hrs / week</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Hourly Charge Rate:</span>
                      <span className="font-mono text-slate-700 font-semibold">£{input.carePackage.hourlyRate.toFixed(2)} / hr</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium italic">
                      Formula: {input.carePackage.hoursPerWeek} hrs × £{input.carePackage.hourlyRate.toFixed(2)}/hr
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-slate-500">
                    <span>Direct Care Budget:</span>
                    <span className="font-mono text-slate-700 font-semibold">£{input.carePackage.totalWeeklyCost.toFixed(2)} / week</span>
                  </div>
                )}
                <div className="h-px bg-slate-100 my-1" />
              </>
            ) : null}
            <div className="flex justify-between items-center text-slate-800 font-bold">
              <span>Total Weekly Cost:</span>
              <span className="font-mono text-slate-950">£{actualWeeklyCareCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Council Share (Funding):</span>
              <span className="font-mono text-emerald-600 font-bold">£{councilWeeklyContribution.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 text-[11px]">
              <span>Your Share (Contribution):</span>
              <span className="font-mono text-blue-900 font-bold">£{userWeeklyContribution.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Quick math breakdown steps */}
        <div className="bg-white rounded-lg p-3.5 border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-700 text-[10px] uppercase tracking-widest flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span>Calculation Formula</span>
            <span className="text-[9px] text-blue-900 bg-slate-100 px-1.5 py-0.5 rounded font-mono uppercase font-semibold">weekly</span>
          </h4>

          {isFreeHomeCare ? (
            <p className="text-xs text-slate-500 leading-relaxed">
              In your region ({region === 'ni' ? 'Northern Ireland' : 'Scotland (for over-65s)'}), home care is provided free of charge, so no financial assessment formula applies.
            </p>
          ) : isSelfFunder && region !== 'wales' ? (
            <p className="text-xs text-slate-500 leading-relaxed">
              Because your capital (<strong className="font-mono">£{totalCapital.toLocaleString()}</strong>) exceeds the council limit of <strong className="font-mono">£{upperCapitalLimit.toLocaleString()}</strong>, you are classed as a self-funder. You pay the full cost of your care.
            </p>
          ) : (
            <div className="space-y-1.5 text-xs font-medium">
              {/* Assessable Income */}
              <div className="flex justify-between items-center text-slate-600">
                <span>Assessable Income:</span>
                <span className="font-mono text-slate-800">£{totalAssessableIncomeSources.toFixed(2)}</span>
              </div>

              {/* Tariff Income */}
              {tariffIncome > 0 && (
                <div className="flex justify-between items-center text-blue-950 bg-slate-50 px-1 py-0.5 rounded border border-slate-200/50">
                  <span>+ Capital Tariff Income:</span>
                  <span className="font-mono font-bold text-blue-900">£{tariffIncome.toFixed(2)}</span>
                </div>
              )}

              {/* Minimum Income Guarantee */}
              <div className="flex justify-between items-center text-slate-600">
                <span>– Income Guarantee (MIG):</span>
                <span className="font-mono text-red-600 font-bold">– £{totalMig.toFixed(2)}</span>
              </div>

              {/* Net Housing Costs */}
              {netHousingCosts > 0 && (
                <div className="flex justify-between items-center text-slate-500">
                  <span>– Net Housing Costs:</span>
                  <span className="font-mono text-red-600">– £{netHousingCosts.toFixed(2)}</span>
                </div>
              )}

              {/* Disability related costs */}
              {totalDre > 0 && (
                <div className="flex justify-between items-center text-slate-600">
                  <span>– Disability Costs (DRE):</span>
                  <span className="font-mono text-red-600 font-bold">– £{totalDre.toFixed(2)}</span>
                </div>
              )}

              <div className="h-px bg-slate-200 my-1" />

              {/* Maximum assessed contribution */}
              <div className="flex justify-between items-center text-slate-900 font-bold bg-slate-50 px-2 py-1 rounded border border-slate-100">
                <span>Maximum Contribution Limit:</span>
                <span className="font-mono text-blue-900 text-sm">£{maximumWeeklyCharge.toFixed(2)}</span>
              </div>

              {walesCapApplies && totalCapital > 24000 && (
                <div className="text-[10px] text-slate-500 leading-normal bg-slate-100 p-2 rounded border border-slate-200 mt-1">
                  * Note: Wales cap limits your maximum weekly charge to £100, regardless of your savings being above £24,000.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 💰 Personal Cash Flow & Surplus Analyzer (On-screen Budget Tool) */}
        <div className="border border-blue-200 bg-blue-50/20 rounded-lg overflow-hidden">
          <button
            type="button"
            id="budget-accordion-toggle"
            onClick={() => setBudgetOpen(!budgetOpen)}
            className="w-full flex items-center justify-between p-3 text-left font-bold text-slate-800 text-xs bg-blue-50/50 hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-blue-900">
              <Banknote className="h-4 w-4 text-blue-600 shrink-0" />
              Personal Monthly Surplus Analyzer
            </span>
            {budgetOpen ? (
              <ChevronUp className="h-4 w-4 text-blue-600 shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-blue-400 shrink-0" />
            )}
          </button>
          {budgetOpen && (
            <div className="p-3.5 border-t border-blue-100 text-xs text-slate-600 space-y-4 leading-relaxed animate-fade-in" id="budget-detail-content">
              <p className="text-[11px] text-slate-500 leading-normal">
                Determine exactly what cash is left over each month after paying the Council Care Bill, statutory housing bills, disability-related expenses, and custom housekeeping costs.
              </p>

              {/* Conversion Formula Selector */}
              <div className="bg-white p-2 rounded border border-slate-100 flex items-center justify-between gap-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="h-3 w-3 text-indigo-500" />
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
                    title="365.25 days / 7 days / 12 months = 4.3483 weeks per month"
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
                    title="52 weeks / 12 months = 4.3333 weeks per month"
                  >
                    Standard (4.333)
                  </button>
                </div>
              </div>

              {/* Weekly Housekeeping Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="housekeeping-budget-input" className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Weekly Housekeeping Cost:
                  </label>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    (Est: £{(housekeeping * (useAstronomical ? 4.348333333 : 4.333333333)).toFixed(2)} /mo)
                  </span>
                </div>
                <div className="relative rounded-md shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-xs text-slate-400 font-mono">£</span>
                  </div>
                  <input
                    type="number"
                    id="housekeeping-budget-input"
                    value={housekeeping === 0 ? '' : housekeeping}
                    onChange={(e) => setHousekeeping(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-12 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-slate-800 font-mono font-bold"
                    placeholder="206.98"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-[10px] text-slate-400 font-semibold font-mono">/wk</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 leading-tight">
                  Enter bills, food, utilities, etc. Default is £206.98 (which covers every bill except her minor gambling peccadillo).
                </p>
              </div>

              {/* Calculations Stack */}
              {(() => {
                const multiplier = useAstronomical ? 4.348333333 : (52 / 12);
                
                // Actual cash flows
                const actualWeeklyIncome = totalGrossIncome;
                const actualMonthlyIncome = actualWeeklyIncome * multiplier;

                const actualWeeklyCarePaid = userWeeklyContribution;
                const actualMonthlyCarePaid = actualWeeklyCarePaid * multiplier;

                const actualWeeklyHousing = netHousingCosts;
                const actualMonthlyHousing = actualWeeklyHousing * multiplier;

                const actualWeeklyDre = totalDre;
                const actualMonthlyDre = actualWeeklyDre * multiplier;

                const actualWeeklyHousekeeping = housekeeping;
                const actualMonthlyHousekeeping = housekeeping * multiplier;

                // Surplus calculations
                const actualWeeklyRemaining = actualWeeklyIncome - actualWeeklyCarePaid - actualWeeklyHousing - actualWeeklyDre;
                const actualMonthlyRemaining = actualWeeklyRemaining * multiplier;

                const finalWeeklySurplus = actualWeeklyRemaining - actualWeeklyHousekeeping;
                const finalMonthlySurplus = finalWeeklySurplus * multiplier;

                return (
                  <div className="space-y-3 pt-1 border-t border-blue-100">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">
                      <span className="col-span-6">Item</span>
                      <span className="col-span-3 text-right">Weekly</span>
                      <span className="col-span-3 text-right">Monthly</span>
                    </div>

                    {/* Gross Income */}
                    <div className="grid grid-cols-12 gap-2 items-center text-[11px] font-semibold text-slate-700">
                      <span className="col-span-6 flex items-center gap-1">Actual Cash Income</span>
                      <span className="col-span-3 text-right font-mono text-slate-600">£{actualWeeklyIncome.toFixed(2)}</span>
                      <span className="col-span-3 text-right font-mono text-slate-600">£{actualMonthlyIncome.toFixed(2)}</span>
                    </div>

                    {/* Subtract Fixed Costs */}
                    <div className="space-y-1.5 bg-slate-50 p-2 rounded border border-slate-100">
                      {actualWeeklyCarePaid > 0 && (
                        <div className="grid grid-cols-12 gap-2 items-center text-[10px] text-slate-500 font-medium">
                          <span className="col-span-6">– Care Bill Contribution</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualWeeklyCarePaid.toFixed(2)}</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualMonthlyCarePaid.toFixed(2)}</span>
                        </div>
                      )}
                      {actualWeeklyHousing > 0 && (
                        <div className="grid grid-cols-12 gap-2 items-center text-[10px] text-slate-500 font-medium">
                          <span className="col-span-6">– Rent/Mortgage/Council Tax</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualWeeklyHousing.toFixed(2)}</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualMonthlyHousing.toFixed(2)}</span>
                        </div>
                      )}
                      {actualWeeklyDre > 0 && (
                        <div className="grid grid-cols-12 gap-2 items-center text-[10px] text-slate-500 font-medium">
                          <span className="col-span-6">– Disability Expenses (DRE)</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualWeeklyDre.toFixed(2)}</span>
                          <span className="col-span-3 text-right font-mono text-red-600">–£{actualMonthlyDre.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Remaining disposable before housekeeping */}
                    <div className="grid grid-cols-12 gap-2 items-center text-[11px] font-bold text-slate-800 bg-blue-50/50 p-1.5 rounded">
                      <span className="col-span-6">Disposable Cash Flow</span>
                      <span className="col-span-3 text-right font-mono">£{actualWeeklyRemaining.toFixed(2)}</span>
                      <span className="col-span-3 text-right font-mono">£{actualMonthlyRemaining.toFixed(2)}</span>
                    </div>

                    {/* Housekeeping deduction */}
                    {actualWeeklyHousekeeping > 0 && (
                      <div className="grid grid-cols-12 gap-2 items-center text-[10px] font-semibold text-slate-500 px-1.5">
                        <span className="col-span-6">– Weekly Housekeeping</span>
                        <span className="col-span-3 text-right font-mono text-red-600">–£{actualWeeklyHousekeeping.toFixed(2)}</span>
                        <span className="col-span-3 text-right font-mono text-red-600">–£{actualMonthlyHousekeeping.toFixed(2)}</span>
                      </div>
                    )}

                    {/* Final remaining surplus / pocket money */}
                    <div className={`p-2.5 rounded-xl border text-center space-y-1 ${
                      finalWeeklySurplus >= 0
                        ? 'bg-emerald-900 border-emerald-800 text-white'
                        : 'bg-rose-900 border-rose-800 text-white'
                    }`}>
                      <span className="text-[9px] font-bold uppercase tracking-widest block opacity-75">
                        {finalWeeklySurplus >= 0 ? 'Anticipated Monthly Remaining Surplus' : 'Anticipated Monthly Budget Shortfall'}
                      </span>
                      <div className="text-2xl font-black font-mono">
                        £{Math.abs(finalMonthlySurplus).toFixed(2)}
                      </div>
                      <span className="text-[9px] block opacity-75">
                        (Equivalent to £{Math.abs(finalWeeklySurplus).toFixed(2)} /week leftover pocket money)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Helpful advice callout */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex gap-2 items-start text-[11px] text-slate-600 leading-normal">
          <Info className="h-4 w-4 text-blue-900 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-slate-700">Official Assessment Required</p>
            <p className="mt-0.5">
              To receive actual funding assistance, you must request a <strong>Financial Assessment</strong> and a <strong>Care Needs Assessment</strong> from your local Social Services department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
