/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationBreakdown, Region } from '../types';
import { ShieldCheck, Calendar, Info, HeartHandshake, Sparkles, TrendingUp } from 'lucide-react';

interface CalculationSummaryProps {
  breakdown: CalculationBreakdown;
  region: Region;
}

export const CalculationSummary: React.FC<CalculationSummaryProps> = ({ breakdown, region }) => {
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
