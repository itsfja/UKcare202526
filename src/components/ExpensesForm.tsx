/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FinancialAssessmentInput } from '../types';
import { Home, Heart, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface ExpensesFormProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

export const ExpensesForm: React.FC<ExpensesFormProps> = ({ input, onChange }) => {
  const {
    rent,
    mortgage,
    councilTax,
    housingBenefit,
    councilTaxSupport,
    dreExtraHeating,
    dreCommunityAlarm,
    dreSpecialClothing,
    dreExtraLaundry,
    dreMobilityEquipment,
    dreSpecialDiet,
    dreOther,
    dreOtherDescription,
  } = input.expenses;

  const handleUpdate = (updates: Partial<typeof input.expenses>) => {
    onChange({
      expenses: {
        ...input.expenses,
        ...updates,
      },
    });
  };

  const grossHousing = rent + mortgage + councilTax;
  const housingSupport = housingBenefit + councilTaxSupport;
  const netHousing = Math.max(0, grossHousing - housingSupport);

  const totalDre =
    dreExtraHeating +
    dreCommunityAlarm +
    dreSpecialClothing +
    dreExtraLaundry +
    dreMobilityEquipment +
    dreSpecialDiet +
    dreOther;

  return (
    <div className="space-y-8" id="expenses-form-section">
      {/* 1. Housing Costs Section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
            <Home className="h-5 w-5 text-indigo-600" />
            Allowable Housing Costs
          </label>
          <p className="text-sm text-slate-500">
            The council deducts your net housing costs from your assessable income. This means you do not pay for care out of your rent or mortgage money.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 bg-white p-4 border border-slate-200 rounded-xl">
          {/* Rent & Benefit */}
          <div className="space-y-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Rent</h4>
            <div className="space-y-2">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="rent-input"
                  value={rent || ''}
                  onChange={(e) => handleUpdate({ rent: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  placeholder="Rent /wk"
                />
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="housingBenefit-input"
                  value={housingBenefit || ''}
                  onChange={(e) => handleUpdate({ housingBenefit: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  placeholder="Housing Benefit /wk"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Housing Benefit is subtracted from rent</p>
          </div>

          {/* Mortgage */}
          <div className="space-y-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Mortgage</h4>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="mortgage-input"
                value={mortgage || ''}
                onChange={(e) => handleUpdate({ mortgage: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                placeholder="Mortgage /wk"
              />
            </div>
            <p className="text-[10px] text-slate-400">Weekly interest/capital repayments actually paid</p>
          </div>

          {/* Council Tax & Support */}
          <div className="space-y-3 p-3 bg-slate-50/50 rounded-lg border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase">Council Tax</h4>
            <div className="space-y-2">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="councilTax-input"
                  value={councilTax || ''}
                  onChange={(e) => handleUpdate({ councilTax: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  placeholder="Council Tax /wk"
                />
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-xs text-slate-400">£</span>
                </div>
                <input
                  type="number"
                  id="councilTaxSupport-input"
                  value={councilTaxSupport || ''}
                  onChange={(e) => handleUpdate({ councilTaxSupport: Math.max(0, parseFloat(e.target.value) || 0) })}
                  className="block w-full rounded-md border border-slate-200 py-1.5 pl-6 pr-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                  placeholder="Council Tax Support /wk"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400">Support/Reduction is subtracted from Tax</p>
          </div>
        </div>

        {/* Net Housing summary */}
        <div className="flex justify-between items-center text-xs font-mono text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <span>Gross: £{grossHousing.toFixed(2)} — Benefit support: £{housingSupport.toFixed(2)}</span>
          <span className="font-bold text-indigo-700">Net Housing Allowed: £{netHousing.toFixed(2)}/wk</span>
        </div>
      </div>

      {/* 2. Disability Related Expenditure (DRE) Helper */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Heart className="h-5 w-5 text-indigo-600" />
              Disability Related Expenditure (DRE)
            </label>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Highly Effective
            </span>
          </div>
          <p className="text-sm text-slate-500">
            DRE is any extra cost you pay due to your disability or illness. The council is <strong>legally required</strong> to subtract these costs from your income before deciding your contribution. Entering these can significantly reduce what you pay!
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {/* Extra Heating */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Extra Heating / Energy costs</span>
                <div className="group relative">
                  <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                  <div className="absolute left-0 top-5 hidden w-56 rounded bg-slate-800 p-2 text-[10px] text-white shadow-md group-hover:block z-10">
                    Calculated if your fuel bill is above average because of spending more time at home or needing a warmer temperature due to your illness.
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400">Additional weekly heating, electricity, or laundry drying costs</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreExtraHeating"
                value={dreExtraHeating || ''}
                onChange={(e) => handleUpdate({ dreExtraHeating: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Community Alarm */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-700">Community Alarm System</span>
              </div>
              <p className="text-xs text-slate-400">Weekly fees paid for emergency response buttons, Careline, Lifeline, etc.</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreCommunityAlarm"
                value={dreCommunityAlarm || ''}
                onChange={(e) => handleUpdate({ dreCommunityAlarm: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Special Clothing / Footwear */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <span className="text-sm font-semibold text-slate-700">Specialist Clothing or Footwear</span>
              <p className="text-xs text-slate-400">Extra costs due to rapid wear and tear, or needing customized orthotics/clothes.</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreSpecialClothing"
                value={dreSpecialClothing || ''}
                onChange={(e) => handleUpdate({ dreSpecialClothing: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Extra Laundry */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <span className="text-sm font-semibold text-slate-700">Extra Laundry, Bedding, or Incontinence care</span>
              <p className="text-xs text-slate-400">Additional laundry loads (detergent, water, energy) due to skin conditions or incontinence.</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreExtraLaundry"
                value={dreExtraLaundry || ''}
                onChange={(e) => handleUpdate({ dreExtraLaundry: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Mobility Equipment Maintenance */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <span className="text-sm font-semibold text-slate-700">Mobility Equipment Maintenance</span>
              <p className="text-xs text-slate-400">Annual purchase or service costs of wheelchairs, hoists, scooters, or stairlifts (weekly equivalent).</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreMobilityEquipment"
                value={dreMobilityEquipment || ''}
                onChange={(e) => handleUpdate({ dreMobilityEquipment: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Special Dietary Requirements */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-0.5 max-w-md">
              <span className="text-sm font-semibold text-slate-700">Special Dietary Needs</span>
              <p className="text-xs text-slate-400">Weekly extra cost for specialist foods or diets prescribed or required due to health.</p>
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreSpecialDiet"
                value={dreSpecialDiet || ''}
                onChange={(e) => handleUpdate({ dreSpecialDiet: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Other DRE Costs */}
          <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-start gap-4 hover:bg-slate-50/50 transition-colors">
            <div className="space-y-2 flex-1">
              <span className="text-sm font-semibold text-slate-700 block">Other Disability Cost / Private Care Paid</span>
              <input
                type="text"
                id="dreOtherDescription"
                value={dreOtherDescription}
                onChange={(e) => handleUpdate({ dreOtherDescription: e.target.value })}
                placeholder="e.g. Paid private gardener/cleaner, wheelchair repairs..."
                className="block w-full rounded-md border border-slate-200 p-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="relative rounded-md shadow-sm w-32 shrink-0 mt-0 sm:mt-7">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-xs text-slate-400">£</span>
              </div>
              <input
                type="number"
                id="dreOther"
                value={dreOther || ''}
                onChange={(e) => handleUpdate({ dreOther: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="block w-full rounded-lg border border-slate-200 py-1.5 pl-6 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* DRE summary */}
        <div className="flex justify-between items-center text-xs font-mono text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <span className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            Total Weekly Disability Related Expenditure (DRE) Saved:
          </span>
          <span className="font-extrabold text-sm text-emerald-950">£{totalDre.toFixed(2)}/wk</span>
        </div>
      </div>
    </div>
  );
};
