/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput, Region, AgeCategory, DisabilityPremiumType } from '../types';
import { MapPin, User, ShieldAlert, Award, HelpCircle, Calendar } from 'lucide-react';

interface DemographicsFormProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

export const DemographicsForm: React.FC<DemographicsFormProps> = ({ input, onChange }) => {
  const handleYearChange = (financialYear: '2024-25' | '2025-26' | '2026-27') => {
    onChange({ financialYear });
  };

  const handleRegionChange = (region: Region) => {
    onChange({ region });
  };

  const handleAgeChange = (ageCategory: AgeCategory) => {
    onChange({ ageCategory });
  };

  const handleDisabilityChange = (disabilityPremium: DisabilityPremiumType) => {
    onChange({ disabilityPremium });
  };

  return (
    <div className="space-y-8" id="demographics-form-section">
      {/* Financial Year Selection */}
      <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Calendar className="h-4 w-4 text-indigo-600" />
            Financial Assessment Year
          </label>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest font-mono">Select</span>
        </div>
        <p className="text-xs text-slate-500 leading-normal">
          Assessments use statutory limits (MIG and premiums) which are adjusted annually by the government. Compare how much you keep across different tax years.
        </p>
        <div className="grid grid-cols-3 gap-2 pt-1.5">
          {([
            { id: '2024-25', label: '2024/25', desc: 'Baseline rules' },
            { id: '2025-26', label: '2025/26', desc: 'Uprated rates' },
            { id: '2026-27', label: '2026/27', desc: 'Current (April 2026)' },
          ] as const).map((y) => (
            <button
              key={y.id}
              type="button"
              id={`year-btn-${y.id}`}
              onClick={() => handleYearChange(y.id)}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                input.financialYear === y.id
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              <span className="text-xs font-bold">{y.label}</span>
              <span className="text-[9px] opacity-75 mt-0.5">{y.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Region Selection */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <MapPin className="h-5 w-5 text-indigo-600" />
          Where in the UK do you live?
        </label>
        <p className="text-sm text-slate-500">
          Financial assessment rules, capital limits, and statutory limits vary significantly between nations.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { id: 'england', label: 'England', desc: 'Tariff income on £14k–£23k' },
            { id: 'wales', label: 'Wales', desc: 'Flat £24k limit & £100/wk cap' },
            { id: 'scotland', label: 'Scotland', desc: 'Free personal care over 65' },
            { id: 'ni', label: 'N. Ireland', desc: 'Free Trust-provided care' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              id={`region-btn-${r.id}`}
              onClick={() => handleRegionChange(r.id as Region)}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all hover:shadow-sm ${
                input.region === r.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`font-medium ${input.region === r.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                {r.label}
              </span>
              <span className="mt-1 text-xs text-slate-400">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Category */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <User className="h-5 w-5 text-indigo-600" />
          What is your age group?
        </label>
        <p className="text-sm text-slate-500">
          Your Minimum Income Guarantee (MIG) depends on your age. Councils must leave you with this money to live on.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: 'under-25', label: 'Aged 18 to 24', desc: 'Lower MIG rate' },
            { id: '25-to-pension', label: 'Aged 25 to Pension Age', desc: 'Standard working-age MIG' },
            { id: 'pension-age', label: 'State Pension Age or over', desc: 'Higher pension-age MIG' },
          ].map((a) => (
            <button
              key={a.id}
              type="button"
              id={`age-btn-${a.id}`}
              onClick={() => handleAgeChange(a.id as AgeCategory)}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all hover:shadow-sm ${
                input.ageCategory === a.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`font-medium ${input.ageCategory === a.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                {a.label}
              </span>
              <span className="mt-1 text-xs text-slate-400">{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Disability Premiums */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Award className="h-5 w-5 text-indigo-600" />
            Disability Premiums
          </label>
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
            <div className="absolute right-0 top-6 hidden w-64 rounded-lg bg-slate-800 p-2 text-xs text-white shadow-md group-hover:block z-10">
              Disability premiums increase your Minimum Income Guarantee (MIG), allowing you to keep more of your weekly income before paying for care.
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Select if you receive qualifying disability benefits (PIP, DLA, or Attendance Allowance) and meet criteria.
        </p>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              id: 'none',
              label: 'No Disability Premium',
              desc: 'Standard Minimum Income Guarantee applies.',
            },
            {
              id: 'standard',
              label: 'Standard Disability Premium',
              desc: 'You receive standard PIP/DLA care or Attendance Allowance.',
            },
            {
              id: 'enhanced',
              label: 'Enhanced Disability Premium',
              desc: 'You receive PIP enhanced rate daily living or DLA highest care.',
            },
            {
              id: 'severe',
              label: 'Severe Disability Premium',
              desc: "You receive standard/enhanced PIP/DLA/AA, live alone, and no one gets Carer's Allowance (or if a couple, both get PIP/DLA/AA and again, no carer's allowance paid).",
            },
          ].map((dp) => (
            <button
              key={dp.id}
              type="button"
              id={`disability-btn-${dp.id}`}
              onClick={() => handleDisabilityChange(dp.id as DisabilityPremiumType)}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all hover:shadow-sm ${
                input.disabilityPremium === dp.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`font-medium ${input.disabilityPremium === dp.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                {dp.label}
              </span>
              <span className="mt-1 text-xs text-slate-500 leading-relaxed">{dp.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
        <h4 className="font-semibold text-slate-800 text-sm uppercase tracking-wider">Other Circumstances</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700">Do you receive Carer's Allowance?</span>
            <span className="text-xs text-slate-400">Or have an underlying entitlement (adds £45.60/wk carer premium to MIG)</span>
          </div>
          <button
            type="button"
            id="carer-premium-toggle"
            onClick={() => onChange({ hasCarerPremium: !input.hasCarerPremium })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              input.hasCarerPremium ? 'bg-indigo-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                input.hasCarerPremium ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="h-px bg-slate-200 my-2" />

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-700">Are you part of a couple?</span>
            <span className="text-xs text-slate-400">Financial assessments are individual, but we will remind you how joint assets are split.</span>
          </div>
          <div className="flex gap-2">
            {['single', 'couple'].map((status) => (
              <button
                key={status}
                type="button"
                id={`status-btn-${status}`}
                onClick={() => onChange({ relationshipStatus: status as 'single' | 'couple' })}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  input.relationshipStatus === status
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Note */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 leading-relaxed space-y-1">
          <p className="font-semibold text-amber-900">Important Note on Couples and Finances:</p>
          <p>
            The council **cannot** carry out a joint assessment. They will assess you only as an individual.
            However, for joint bank accounts or joint investments, they will assume a 50/50 split of the capital unless proven otherwise.
          </p>
        </div>
      </div>
    </div>
  );
};
