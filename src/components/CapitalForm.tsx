/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput } from '../types';
import { Coins, HelpCircle, ShieldCheck, Home } from 'lucide-react';

interface CapitalFormProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

export const CapitalForm: React.FC<CapitalFormProps> = ({ input, onChange }) => {
  const { bankAccounts, investments, otherProperty } = input.capital;

  const handleUpdate = (updates: Partial<typeof input.capital>) => {
    onChange({
      capital: {
        ...input.capital,
        ...updates,
      },
    });
  };

  const totalCapital = bankAccounts + investments + otherProperty;

  // Regional Capital Limits (for UI guidance)
  let upperLimit = 23250;
  let lowerLimit = 14250;
  if (input.region === 'wales') {
    upperLimit = 24000;
    lowerLimit = 24000;
  } else if (input.region === 'scotland') {
    upperLimit = 32750;
    lowerLimit = 20250;
  }

  const isAboveLimit = totalCapital > upperLimit;

  return (
    <div className="space-y-6" id="capital-form-section">
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Coins className="h-5 w-5 text-indigo-600" />
          Capital and Savings
        </label>
        <p className="text-sm text-slate-500">
          Your capital determines if you qualify for council financial support. If your capital is above the limit, you pay the full care cost (except for Wales' £100 cap, or Scotland/NI free care).
        </p>
      </div>

      {/* Primary Home Disregard Reassurance Card */}
      <div className="flex gap-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
        <Home className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" id="primary-home-icon" />
        <div className="text-xs text-indigo-900 leading-relaxed space-y-1">
          <p className="font-semibold text-indigo-950">Is your primary home included?</p>
          <p>
            <strong>No!</strong> For non-residential care (care in your own home), <strong>the value of your primary residence is 100% ignored</strong>. You will never be forced to sell your home to pay for care at home.
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Cash & Bank Accounts */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="bankAccounts" className="text-sm font-medium text-slate-700">Cash & Bank Accounts</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-slate-400">£</span>
            </div>
            <input
              type="number"
              name="bankAccounts"
              id="bankAccounts"
              min="0"
              step="1"
              value={bankAccounts || ''}
              onChange={(e) => handleUpdate({ bankAccounts: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="block w-full rounded-lg border border-slate-200 py-2.5 pl-7 pr-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="10000"
            />
          </div>
          <p className="text-[10px] text-slate-400">Current accounts, savings, ISAs, premium bonds</p>
        </div>

        {/* Investments, Stocks, Shares */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="investments" className="text-sm font-medium text-slate-700">Investments, Stocks, Shares</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-slate-400">£</span>
            </div>
            <input
              type="number"
              name="investments"
              id="investments"
              min="0"
              step="1"
              value={investments || ''}
              onChange={(e) => handleUpdate({ investments: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="block w-full rounded-lg border border-slate-200 py-2.5 pl-7 pr-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="0"
            />
          </div>
          <p className="text-[10px] text-slate-400">Investment bonds, stocks, unit trusts, unit shares</p>
        </div>

        {/* Other Properties */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="otherProperty" className="text-sm font-medium text-slate-700">Other Properties / Land</label>
          </div>
          <div className="relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm text-slate-400">£</span>
            </div>
            <input
              type="number"
              name="otherProperty"
              id="otherProperty"
              min="0"
              step="1"
              value={otherProperty || ''}
              onChange={(e) => handleUpdate({ otherProperty: Math.max(0, parseFloat(e.target.value) || 0) })}
              className="block w-full rounded-lg border border-slate-200 py-2.5 pl-7 pr-3 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
              placeholder="0"
            />
          </div>
          <p className="text-[10px] text-slate-400">Holiday homes, buy-to-let properties (market value minus mortgage)</p>
        </div>
      </div>

      {/* Threshold Status & Visual Indicator */}
      <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-white space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-bold text-slate-800">Total Assessable Capital</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {input.relationshipStatus === 'couple' ? 'Your personal share (assumed 50% for joint accounts)' : 'Your individual capital'}
            </p>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            £{totalCapital.toLocaleString()}
          </div>
        </div>

        {/* Visual progress bar */}
        <div className="space-y-1.5">
          <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            {/* Lower limit bar segment */}
            <div
              className="absolute top-0 left-0 h-full bg-emerald-500"
              style={{ width: `${Math.min(100, (totalCapital / upperLimit) * 100)}%` }}
            />
            {/* Tariff income segment */}
            {totalCapital > lowerLimit && !isAboveLimit && (
              <div
                className="absolute top-0 h-full bg-indigo-500"
                style={{
                  left: `${(lowerLimit / upperLimit) * 100}%`,
                  width: `${((totalCapital - lowerLimit) / upperLimit) * 100}%`,
                }}
              />
            )}
            {/* Above limit segment */}
            {isAboveLimit && (
              <div
                className="absolute top-0 right-0 h-full bg-red-500"
                style={{
                  left: `${(upperLimit / totalCapital) * 100}%`,
                  width: `${(1 - (upperLimit / totalCapital)) * 100}%`,
                }}
              />
            )}
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>£0</span>
            {input.region !== 'wales' && (
              <span className="text-emerald-600 font-bold">
                Lower Limit: £{lowerLimit.toLocaleString()} (Free)
              </span>
            )}
            <span className="text-red-600 font-bold">
              Upper Limit: £{upperLimit.toLocaleString()} (Self-Funded)
            </span>
          </div>
        </div>

        {/* Feedback Alert depending on rules */}
        {isAboveLimit ? (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2 items-start text-xs text-red-800 leading-normal">
            <ShieldCheck className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Self-Funding Capital Threshold Exceeded</p>
              <p className="mt-0.5">
                {input.region === 'wales' ? (
                  <span>
                    Your savings are above £24,000. You are a self-funder. However, because you live in Wales, your weekly care cost contribution is capped at a statutory maximum of <strong>£100 per week</strong>.
                  </span>
                ) : input.region === 'ni' ? (
                  <span>
                    Your savings are above the threshold, but in Northern Ireland, domiciliary care provided directly by Health Trusts is free of charge.
                  </span>
                ) : input.region === 'scotland' && input.ageCategory === 'pension-age' ? (
                  <span>
                    Your savings are above the threshold, but personal care in Scotland is free. You would only pay care costs for housekeeping or shopping services.
                  </span>
                ) : (
                  <span>
                    Your capital is above £{upperLimit.toLocaleString()}. You are classed as a "Self-Funder" and must pay the full cost of your care. Once your capital falls below £{upperLimit.toLocaleString()}, you can apply for council support.
                  </span>
                )}
              </p>
            </div>
          </div>
        ) : totalCapital > lowerLimit && input.region !== 'wales' ? (
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-2 items-start text-xs text-indigo-800 leading-normal">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Tariff Income Applicable</p>
              <p className="mt-0.5">
                Your capital is between the lower limit of £{lowerLimit.toLocaleString()} and upper limit of £{upperLimit.toLocaleString()}.
                The council assumes you can contribute <strong>£1 per week for every £250</strong> (or part of £250) of savings above the lower limit. This is called "Tariff Income" and is added to your weekly income.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-2 items-start text-xs text-emerald-800 leading-normal">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Capital Fully Protected</p>
              <p className="mt-0.5">
                Your capital is below the lower threshold of £{lowerLimit.toLocaleString()}. The council will ignore your capital savings completely during your means test, and calculate your contribution based solely on your weekly income and allowable expenses.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
