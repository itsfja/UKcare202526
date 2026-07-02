/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput } from '../types';
import { Wallet, HelpCircle, EyeOff, ShieldCheck } from 'lucide-react';

interface IncomeFormProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ input, onChange }) => {
  const {
    statePension,
    pensionCredit,
    pipMobility,
    pipCare,
    dlaMobility,
    dlaCare,
    attendanceAllowance,
    occupationalPension,
    employmentEarnings,
    otherBenefits,
    otherIncome,
  } = input.income;

  const handleUpdate = (updates: Partial<typeof input.income>) => {
    onChange({
      income: {
        ...input.income,
        ...updates,
      },
    });
  };

  const totalGross =
    statePension +
    pensionCredit +
    pipMobility +
    pipCare +
    dlaMobility +
    dlaCare +
    attendanceAllowance +
    occupationalPension +
    employmentEarnings +
    otherBenefits +
    otherIncome;

  const totalDisregarded = employmentEarnings + pipMobility + dlaMobility;
  const totalAssessable = totalGross - totalDisregarded;

  return (
    <div className="space-y-6" id="income-form-section">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Wallet className="h-5 w-5 text-indigo-600" />
          Weekly Income Details
        </label>
        <p className="text-sm text-slate-500">
          Enter all weekly incomes you receive. Some incomes like employment earnings or mobility components are fully disregarded (ignored) in your assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Section 1: Pensions & Credits */}
        <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-white">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>Pensions & Government Credits</span>
            <span className="text-xs font-normal text-slate-400">Weekly (£)</span>
          </h3>

          {/* State Pension */}
          <div className="space-y-1.5">
            <label htmlFor="statePension" className="text-xs font-medium text-slate-700">State Pension</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="statePension"
                min="0"
                step="0.01"
                value={statePension || ''}
                onChange={(e) => handleUpdate({ statePension: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="169.50"
              />
            </div>
          </div>

          {/* Pension Credit */}
          <div className="space-y-1.5">
            <label htmlFor="pensionCredit" className="text-xs font-medium text-slate-700">Pension Credit</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="pensionCredit"
                min="0"
                step="0.01"
                value={pensionCredit || ''}
                onChange={(e) => handleUpdate({ pensionCredit: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="48.65"
              />
            </div>
          </div>

          {/* Occupational Pension */}
          <div className="space-y-1.5">
            <label htmlFor="occupationalPension" className="text-xs font-medium text-slate-700">Occupational / Private Pensions</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="occupationalPension"
                min="0"
                step="0.01"
                value={occupationalPension || ''}
                onChange={(e) => handleUpdate({ occupationalPension: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Employment Earnings (DISREGARDED) */}
          <div className="space-y-1.5 relative">
            <div className="flex justify-between items-center">
              <label htmlFor="employmentEarnings" className="text-xs font-medium text-slate-500 flex items-center gap-1">
                Employment Earnings
                <EyeOff className="h-3.5 w-3.5 text-slate-400" />
              </label>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                100% IGNORED
              </span>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="employmentEarnings"
                min="0"
                step="0.01"
                value={employmentEarnings || ''}
                onChange={(e) => handleUpdate({ employmentEarnings: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-emerald-200 bg-emerald-50/20 py-2 pl-7 pr-3 text-sm text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>
            <p className="text-[10px] text-emerald-600 mt-1">
              To encourage working, any money earned from employment is fully ignored in care financial tests.
            </p>
          </div>
        </div>

        {/* Section 2: Disability Benefits */}
        <div className="space-y-4 p-4 border border-slate-200 rounded-xl bg-white">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>Disability & Living Benefits</span>
            <span className="text-xs font-normal text-slate-400">Weekly (£)</span>
          </h3>

          {/* Attendance Allowance */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="attendanceAllowance" className="text-xs font-medium text-slate-700">Attendance Allowance</label>
              <span className="text-[10px] text-slate-400">Lower: £72.65, Higher: £108.55</span>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="attendanceAllowance"
                min="0"
                step="0.01"
                value={attendanceAllowance || ''}
                onChange={(e) => handleUpdate({ attendanceAllowance: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="72.65"
              />
            </div>
          </div>

          {/* PIP / DLA Care Components */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label htmlFor="pipCare" className="text-xs font-medium text-slate-700">PIP Daily Living</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="pipCare"
                  min="0"
                  step="0.01"
                  value={pipCare || ''}
                  onChange={(e) => handleUpdate({ pipCare: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-lg border border-slate-200 py-2 pl-5 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="dlaCare" className="text-xs font-medium text-slate-700">DLA Care Component</label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="dlaCare"
                  min="0"
                  step="0.01"
                  value={dlaCare || ''}
                  onChange={(e) => handleUpdate({ dlaCare: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-lg border border-slate-200 py-2 pl-5 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Mobility Components (DISREGARDED) */}
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="pipMobility" className="text-[11px] font-medium text-slate-500">PIP Mobility</label>
                <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">IGNORED</span>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="pipMobility"
                  min="0"
                  step="0.01"
                  value={pipMobility || ''}
                  onChange={(e) => handleUpdate({ pipMobility: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-lg border border-emerald-200 bg-emerald-50/20 py-1.5 pl-5 pr-1 text-xs text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="dlaMobility" className="text-[11px] font-medium text-slate-500">DLA Mobility</label>
                <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">IGNORED</span>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="dlaMobility"
                  min="0"
                  step="0.01"
                  value={dlaMobility || ''}
                  onChange={(e) => handleUpdate({ dlaMobility: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-lg border border-emerald-200 bg-emerald-50/20 py-1.5 pl-5 pr-1 text-xs text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Other/Additional Benefits */}
          <div className="space-y-1.5 border-t border-slate-100 pt-3">
            <label htmlFor="otherBenefits" className="text-xs font-medium text-slate-700">Other Benefits (ESA, Universal Credit, etc.)</label>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-sm text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="otherBenefits"
                min="0"
                step="0.01"
                value={otherBenefits || ''}
                onChange={(e) => handleUpdate({ otherBenefits: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Other Income source */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-sm font-semibold text-slate-800">Any other weekly income?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Rental income, trust funds, etc.</p>
          </div>
          <div className="relative rounded-md shadow-sm w-full sm:w-48">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-slate-400">£</span>
            </div>
            <input
              type="number"
              id="otherIncome"
              min="0"
              step="0.01"
              value={otherIncome || ''}
              onChange={(e) => handleUpdate({ otherIncome: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="block w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Income Summary Card */}
      <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row justify-between items-stretch gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Weekly Income Analysis</h4>
          <p className="text-xs text-slate-400">
            Total gross income is evaluated, but disregarded benefits are stripped out of the means test.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800 self-center">
          <div className="px-3 text-center">
            <div className="text-xs text-slate-400 uppercase">Gross Income</div>
            <div className="text-lg font-bold">£{totalGross.toFixed(2)}</div>
          </div>
          <div className="px-3 text-center">
            <div className="text-xs text-emerald-400 font-medium uppercase flex items-center justify-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Assessable
            </div>
            <div className="text-lg font-extrabold text-emerald-300">£{totalAssessable.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
