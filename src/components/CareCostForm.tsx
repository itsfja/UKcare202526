/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput } from '../types';
import { Clock, HelpCircle, AlertCircle } from 'lucide-react';

interface CareCostFormProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

export const CareCostForm: React.FC<CareCostFormProps> = ({ input, onChange }) => {
  const { hoursPerWeek, hourlyRate, useCustomWeeklyCost, totalWeeklyCost } = input.carePackage;

  const handleUpdate = (updates: Partial<typeof input.carePackage>) => {
    onChange({
      carePackage: {
        ...input.carePackage,
        ...updates,
      },
    });
  };

  const calculatedWeeklyCost = hoursPerWeek * hourlyRate;
  const currentWeeklyCost = useCustomWeeklyCost ? totalWeeklyCost : calculatedWeeklyCost;

  return (
    <div className="space-y-6" id="care-cost-form-section">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Clock className="h-5 w-5 text-indigo-600" />
          Care Package Details
        </label>
        <p className="text-sm text-slate-500">
          Enter the details of your care at home package. This is used to calculate the ceiling of your potential weekly contribution.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex rounded-lg bg-slate-100 p-1">
        <button
          type="button"
          id="mode-hours-btn"
          onClick={() => handleUpdate({ useCustomWeeklyCost: false })}
          className={`flex-1 rounded-md py-2 text-sm font-medium text-center transition-all ${
            !useCustomWeeklyCost
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Calculate by Hours & Rate
        </button>
        <button
          type="button"
          id="mode-flat-btn"
          onClick={() => handleUpdate({ useCustomWeeklyCost: true })}
          className={`flex-1 rounded-md py-2 text-sm font-medium text-center transition-all ${
            useCustomWeeklyCost
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Enter Flat Weekly Cost
        </button>
      </div>

      {/* Care Hours & Rate Inputs */}
      {!useCustomWeeklyCost ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Hours per Week */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="hoursPerWeek" className="text-sm font-medium text-slate-700">Hours of care per week</label>
              <span className="text-xs text-slate-400">e.g. 10 hours</span>
            </div>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                name="hoursPerWeek"
                id="hoursPerWeek"
                min="0.5"
                max="168"
                step="0.5"
                value={hoursPerWeek || ''}
                onChange={(e) => handleUpdate({ hoursPerWeek: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-3 pl-4 pr-12 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="12"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-sm text-slate-400">hrs/wk</span>
              </div>
            </div>
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="hourlyRate" className="text-sm font-medium text-slate-700">Hourly care rate (£)</label>
              <span className="text-xs text-slate-400">UK average is around £20–£26</span>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                name="hourlyRate"
                id="hourlyRate"
                min="0"
                step="0.10"
                value={hourlyRate || ''}
                onChange={(e) => handleUpdate({ hourlyRate: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-3 pl-8 pr-4 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="22.50"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Flat Weekly Cost Input */
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="totalWeeklyCost" className="text-sm font-medium text-slate-700">Total Weekly Care Cost (£)</label>
            <span className="text-xs text-slate-400">Total charge for all home care hours</span>
          </div>
          <div className="relative rounded-md shadow-sm max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <span className="text-sm text-slate-400">£</span>
            </div>
            <input
              type="number"
              name="totalWeeklyCost"
              id="totalWeeklyCost"
              min="0"
              step="1"
              value={totalWeeklyCost || ''}
              onChange={(e) => handleUpdate({ totalWeeklyCost: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="block w-full rounded-lg border border-slate-200 py-3 pl-8 pr-12 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="250"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <span className="text-sm text-slate-400">/week</span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Box */}
      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h4 className="text-sm font-semibold text-slate-800">Total Care Cost Summary</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            {!useCustomWeeklyCost
              ? `Based on ${hoursPerWeek} hours/week at £${hourlyRate.toFixed(2)}/hour`
              : 'Flat weekly cost of care specified by you'}
          </p>
        </div>
        <div className="text-2xl font-bold text-indigo-900">
          £{currentWeeklyCost.toFixed(2)}
          <span className="text-xs font-normal text-slate-400 ml-1">/week</span>
        </div>
      </div>

      {/* Scotland Warning */}
      {input.region === 'scotland' && input.ageCategory === 'pension-age' && (
        <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <p className="font-semibold text-emerald-900">Free Personal Care in Scotland:</p>
            <p className="mt-1">
              You live in Scotland and are of pension age. In Scotland, personal care (help with washing, dressing, medication, eating) is 100% free of charge!
              The calculations below will assume a contribution of £0.00 for personal care. You would only pay charges for non-personal care tasks (e.g. housekeeping, shopping).
            </p>
          </div>
        </div>
      )}

      {/* Northern Ireland Warning */}
      {input.region === 'ni' && (
        <div className="flex gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed">
            <p className="font-semibold text-emerald-900">Free Trust Care in Northern Ireland:</p>
            <p className="mt-1">
              You live in Northern Ireland. Home care services organized and provided directly by Health and Social Care Trusts are free of charge.
              This assessment will reflect a contribution of £0.00, as Trusts do not levy care-at-home means tests.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
