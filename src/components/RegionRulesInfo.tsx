/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Region } from '../types';
import { Shield, Sparkles, CheckCircle, HelpCircle } from 'lucide-react';

interface RegionRulesInfoProps {
  region: Region;
}

export const RegionRulesInfo: React.FC<RegionRulesInfoProps> = ({ region }) => {
  const getRules = () => {
    switch (region) {
      case 'england':
        return {
          title: "England Charging Rules",
          ucl: "£23,250",
          lcl: "£14,250",
          tariff: "£1 per week for every £250 (or part thereof) over £14,250.",
          mig: "Over pension age baseline is £228.70 per week.",
          highlights: [
            "Below £14,250, savings are fully disregarded.",
            "Above £23,250, you are a full self-funder (pay 100% of care cost).",
            "Primary home is excluded from non-residential care means test."
          ]
        };
      case 'wales':
        return {
          title: "Wales Charging Rules",
          ucl: "£24,000",
          lcl: "£24,000 (Flat limit)",
          tariff: "None. No tariff income is charged.",
          mig: "Over pension age baseline is £249.50 per week.",
          highlights: [
            "Statutory maximum charge cap of £100 per week for home care.",
            "If capital is below £24,000, assets are fully disregarded.",
            "If above £24,000, you pay the statutory cap of £100 per week."
          ]
        };
      case 'scotland':
        return {
          title: "Scotland Charging Rules",
          ucl: "£32,750",
          lcl: "£20,250",
          tariff: "£1 per week for every £250 (or part thereof) over £20,250.",
          mig: "Over pension age baseline is £238.00 per week.",
          highlights: [
            "Free Personal Care is 100% free for everyone assessed as needing it.",
            "Means tests apply only to non-personal care (like cooking meals, shopping, housework).",
            "Below £20,250, capital is fully disregarded."
          ]
        };
      case 'ni':
        return {
          title: "Northern Ireland Charging Rules",
          ucl: "£23,250",
          lcl: "£14,250",
          tariff: "None for Trust-provided care.",
          mig: "Over pension age baseline is £228.70 per week.",
          highlights: [
            "Domiciliary (home) care provided directly by Health Trusts is free of charge.",
            "Financial assessment only applies to private arrangements you book yourself.",
            "Standard limits match England if assessing private or top-up contributions."
          ]
        };
    }
  };

  const rules = getRules();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden" id="region-rules-panel">
      <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-2">
        <Shield className="h-4 w-4 text-blue-900 shrink-0" />
        <h3 className="font-bold text-slate-700 text-xs uppercase tracking-widest">{rules.title}</h3>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block font-semibold text-[10px] uppercase tracking-wider">Upper Capital Limit</span>
            <span className="text-sm font-bold text-blue-900 font-mono">{rules.ucl}</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
            <span className="text-slate-500 block font-semibold text-[10px] uppercase tracking-wider">Lower Capital Limit</span>
            <span className="text-sm font-bold text-blue-900 font-mono">{rules.lcl}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-start border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-medium shrink-0">Tariff Income:</span>
            <span className="text-slate-800 text-right pl-4 font-mono font-bold">{rules.tariff}</span>
          </div>
          <div className="flex justify-between items-start pb-1">
            <span className="text-slate-500 font-medium shrink-0">Base Pension-Age MIG:</span>
            <span className="text-slate-800 text-right pl-4 font-mono font-bold">{rules.mig}</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-slate-200 pt-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Regional Highlights:</span>
          <ul className="space-y-1.5">
            {rules.highlights.map((h, i) => (
              <li key={i} className="flex gap-2 text-xs text-slate-600 leading-normal">
                <CheckCircle className="h-3.5 w-3.5 text-blue-800 shrink-0 mt-0.5" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
