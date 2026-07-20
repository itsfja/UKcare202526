import React, { useState } from 'react';
import { FinancialAssessmentInput, StHelensDetails } from '../types';
import { User, Home, Award, HelpCircle, FileText, Plus, Trash2, Users } from 'lucide-react';

interface StHelensFormDetailsProps {
  input: FinancialAssessmentInput;
  onChange: (updates: Partial<FinancialAssessmentInput>) => void;
}

type TabType = 'personal' | 'living' | 'property' | 'capital_will' | 'representative';

export const StHelensFormDetails: React.FC<StHelensFormDetailsProps> = ({ input, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  // Safely grab or initialize stHelens by deep merging with default values
  const defaultStHelens = {
    services: 'community' as const,
    title: '',
    firstName: '',
    lastName: '',
    address: '',
    dob: '',
    phone: '',
    mobile: '',
    maritalStatus: 'single' as const,
    peopleLivingWith: [],
    partnerBenefits: {},
    carersAllowancePaid: false,
    carersAllowancePaidTo: '',
    housingBenefitPaid: false,
    housingBenefitAmount: 0,
    councilTaxBenefitPaid: false,
    councilTaxBenefitAmount: 0,
    pensions: [],
    passHalfOccupationalPension: false,
    earnings: [],
    capitalAccounts: [],
    giftedCapital: false,
    giftedDetails: '',
    willMade: 'unknown' as const,
    executors: [],
    willLocation: '',
    propertyType: 'detached' as const,
    propertyTypeOther: '',
    paysCouncilTax: false,
    annualCouncilTax: 0,
    soleOwner: 'na' as const,
    jointOwner: 'na' as const,
    otherOwnersShare: '',
    mortgageSecured: 'na' as const,
    mortgageDetails: { provider: '', balance: 0, monthlyRepayment: 0 },
    deedsLocation: '',
    partnerOrRelativeOwns: 'na' as const,
    relativeRelationship: '',
    rentedPrivateLandlord: 'na' as const,
    rentedHousingAssociation: 'na' as const,
    rentAmount: 0,
    rentFrequency: 'weekly' as const,
    serviceChargesIncluded: 'no' as const,
    otherLivingArrangements: '',
    everOwnedHome: 'no' as const,
    formerHomeAddress: '',
    formerHomeDateSold: '',
    ownOtherProperty: 'no' as const,
    otherPropertyAddress: '',
    otherPropertyOccupied: 'na' as const,
    otherPropertyRentalIncome: 'na' as const,
    otherPropertyRentAmount: 0,
    otherPropertyRentFrequency: 'weekly' as const,
    otherPropertyMortgage: 'no' as const,
    otherPropertyMortgageDetails: '',
    dreItems: {
      careline: 0,
      continence: 0,
      washingLaundry: 0,
      chiropody: 0,
      clothingFootwear: 0,
      bedding: 0,
      meteredWater: 0,
      extraHeating: 0,
      cleaningDomestic: 0,
      gardenMaintenance: 0,
      equipmentHireRepair: 0,
      privateCare: 0,
      other1: 0,
      other1Desc: '',
      other2: 0,
      other2Desc: '',
    },
    hasRep: false,
    repType: 'none' as const,
    repName: '',
    repAddress: '',
    repPhone: '',
    repRelationship: '',
  };

  const stHelens = {
    ...defaultStHelens,
    ...(input.stHelens || {}),
    peopleLivingWith: input.stHelens?.peopleLivingWith || defaultStHelens.peopleLivingWith,
    partnerBenefits: {
      ...defaultStHelens.partnerBenefits,
      ...(input.stHelens?.partnerBenefits || {}),
    },
    pensions: input.stHelens?.pensions || defaultStHelens.pensions,
    earnings: input.stHelens?.earnings || defaultStHelens.earnings,
    capitalAccounts: input.stHelens?.capitalAccounts || defaultStHelens.capitalAccounts,
    executors: input.stHelens?.executors || defaultStHelens.executors,
    mortgageDetails: {
      ...defaultStHelens.mortgageDetails,
      ...(input.stHelens?.mortgageDetails || {}),
    },
    dreItems: {
      ...defaultStHelens.dreItems,
      ...(input.stHelens?.dreItems || {}),
    },
  };

  const updateStHelens = (updates: Partial<StHelensDetails>) => {
    onChange({
      stHelens: {
        ...stHelens,
        ...updates,
      },
    });
  };

  // Add person living with user
  const handleAddPerson = () => {
    const list = [...(stHelens.peopleLivingWith || [])];
    list.push({ name: '', dob: '', relationship: '', nino: '' });
    updateStHelens({ peopleLivingWith: list });
  };

  // Remove person living with user
  const handleRemovePerson = (index: number) => {
    const list = [...(stHelens.peopleLivingWith || [])];
    list.splice(index, 1);
    updateStHelens({ peopleLivingWith: list });
  };

  // Update person living with user
  const handleUpdatePerson = (index: number, key: 'name' | 'dob' | 'relationship' | 'nino', value: string) => {
    const list = [...(stHelens.peopleLivingWith || [])];
    list[index] = {
      ...list[index],
      [key]: value,
    };
    updateStHelens({ peopleLivingWith: list });
  };

  // Add capital account
  const handleAddAccount = () => {
    const list = [...(stHelens.capitalAccounts || [])];
    list.push({ holder: '', bank: '', accountNo: '', amount: 0, evidence: false });
    updateStHelens({ capitalAccounts: list });
  };

  // Remove capital account
  const handleRemoveAccount = (index: number) => {
    const list = [...(stHelens.capitalAccounts || [])];
    list.splice(index, 1);
    updateStHelens({ capitalAccounts: list });
  };

  // Update capital account
  const handleUpdateAccount = (index: number, key: 'holder' | 'bank' | 'accountNo' | 'amount' | 'evidence', value: any) => {
    const list = [...(stHelens.capitalAccounts || [])];
    list[index] = {
      ...list[index],
      [key]: value,
    };
    updateStHelens({ capitalAccounts: list });
  };

  // Add Executor
  const handleAddExecutor = () => {
    const list = [...(stHelens.executors || [])];
    list.push({ name: '', address: '' });
    updateStHelens({ executors: list });
  };

  // Remove Executor
  const handleRemoveExecutor = (index: number) => {
    const list = [...(stHelens.executors || [])];
    list.splice(index, 1);
    updateStHelens({ executors: list });
  };

  const handleUpdateExecutor = (index: number, key: 'name' | 'address', value: string) => {
    const list = [...(stHelens.executors || [])];
    list[index] = {
      ...list[index],
      [key]: value,
    };
    updateStHelens({ executors: list });
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 space-y-6" id="st-helens-section-details-container">
      
      {/* Dynamic St Helens banner */}
      <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 p-4 rounded-xl">
        <div className="p-2.5 bg-rose-600 rounded-lg text-white">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-sm text-rose-950 uppercase tracking-wide">
            St Helens Borough Council Template Form Integrations
          </h3>
          <p className="text-xs text-rose-800 leading-normal">
            This module generates an exact digital representation of the St Helens 11-Section paper booklet. Fill out the sections below to complete the full unofficial draft form.
          </p>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-100 overflow-x-auto gap-1 py-1" id="st-helens-tabs-header">
        {[
          { id: 'personal', label: '1 & 2. Personal & Occupants', icon: <User className="h-3.5 w-3.5" /> },
          { id: 'living', label: '6. Living Details', icon: <Home className="h-3.5 w-3.5" /> },
          { id: 'property', label: '7 & 8. Other Property', icon: <Award className="h-3.5 w-3.5" /> },
          { id: 'capital_will', label: '4 & 5. Accounts & Will', icon: <FileText className="h-3.5 w-3.5" /> },
          { id: 'representative', label: '10 & 11. Representative', icon: <Users className="h-3.5 w-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-rose-100 text-rose-900 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="pt-2" id="st-helens-tab-contents">
        
        {/* TAB 1: Personal Details */}
        {activeTab === 'personal' && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Section 1 & 2: Your Personal Details & Occupants
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Applying for Service Type</label>
                <select
                  value={stHelens.services}
                  onChange={(e) => updateStHelens({ services: e.target.value as any })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="community">Community Services (Home Care)</option>
                  <option value="respite">Respite Care</option>
                  <option value="permanent">Permanent Residential / Nursing</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="Mrs / Mr / Dr / Miss"
                  value={stHelens.title}
                  onChange={(e) => updateStHelens({ title: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                <select
                  value={stHelens.maritalStatus}
                  onChange={(e) => updateStHelens({ maritalStatus: e.target.value as any })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="widowed">Widowed</option>
                  <option value="partner">Living with Partner</option>
                  <option value="divorced">Divorced</option>
                  <option value="separated">Separated</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name(s)</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={stHelens.firstName}
                  onChange={(e) => {
                    const fn = e.target.value;
                    updateStHelens({ firstName: fn });
                    onChange({ customerName: `${fn} ${stHelens.lastName}`.trim() });
                  }}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Surname</label>
                <input
                  type="text"
                  placeholder="Surname"
                  value={stHelens.lastName}
                  onChange={(e) => {
                    const ln = e.target.value;
                    updateStHelens({ lastName: ln });
                    onChange({ customerName: `${stHelens.firstName} ${ln}`.trim() });
                  }}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Address</label>
                <input
                  type="text"
                  placeholder="Full address with postcode"
                  value={stHelens.address}
                  onChange={(e) => updateStHelens({ address: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={stHelens.dob}
                  onChange={(e) => updateStHelens({ dob: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Home Telephone</label>
                <input
                  type="text"
                  placeholder="01744 XXXXXX"
                  value={stHelens.phone}
                  onChange={(e) => updateStHelens({ phone: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  placeholder="07XXX XXXXXX"
                  value={stHelens.mobile}
                  onChange={(e) => updateStHelens({ mobile: e.target.value })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                />
              </div>
            </div>

            {/* People living with you table */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 block">
                  Section 2: People Living With You (None if alone)
                </label>
                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Person</span>
                </button>
              </div>

              {stHelens.peopleLivingWith.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No occupants added. Living alone is assumed.</p>
              ) : (
                <div className="space-y-3">
                  {stHelens.peopleLivingWith.map((person, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Name</span>
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => handleUpdatePerson(idx, 'name', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">DoB</span>
                        <input
                          type="text"
                          value={person.dob}
                          onChange={(e) => handleUpdatePerson(idx, 'dob', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="e.g. 15/09/1982"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Relationship / Partner NI</span>
                        <input
                          type="text"
                          value={person.relationship}
                          onChange={(e) => handleUpdatePerson(idx, 'relationship', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="e.g. Spouse / Son"
                        />
                      </div>
                      <div className="flex items-end gap-1.5 justify-between">
                        <div className="flex-1">
                          <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">NI Number (if spouse)</span>
                          <input
                            type="text"
                            value={person.nino || ''}
                            onChange={(e) => handleUpdatePerson(idx, 'nino', e.target.value)}
                            className="w-full rounded border border-slate-200 bg-white p-1 text-xs font-mono"
                            placeholder="e.g. AB 12 34 56 C"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemovePerson(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Remove person"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Living Arrangements */}
        {activeTab === 'living' && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Section 6: Where You Live & Property Type
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Property Type</label>
                <select
                  value={stHelens.propertyType}
                  onChange={(e) => updateStHelens({ propertyType: e.target.value as any })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="bungalow">Bungalow</option>
                  <option value="flat">Flat</option>
                  <option value="detached">Detached</option>
                  <option value="terraced">Terraced</option>
                  <option value="semi-detached">Semi Detached</option>
                  <option value="care-home">Registered Care Home</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {stHelens.propertyType === 'other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Describe Other</label>
                  <input
                    type="text"
                    value={stHelens.propertyTypeOther}
                    onChange={(e) => updateStHelens({ propertyTypeOther: e.target.value })}
                    className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                    placeholder="e.g. Park Home"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pays Council Tax?</label>
                <select
                  value={stHelens.paysCouncilTax ? 'yes' : 'no'}
                  onChange={(e) => updateStHelens({ paysCouncilTax: e.target.value === 'yes' })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
              {stHelens.paysCouncilTax && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Annual Council Tax Liabilty (£)</label>
                  <input
                    type="number"
                    value={stHelens.annualCouncilTax || ''}
                    onChange={(e) => updateStHelens({ annualCouncilTax: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                    placeholder="e.g. 1350"
                  />
                </div>
              )}
            </div>

            {/* Section 6.2: Owner Occupier details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                Section 6.2 - Owner Occupier Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Is Sole Owner?</label>
                  <select
                    value={stHelens.soleOwner}
                    onChange={(e) => updateStHelens({ soleOwner: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Is Joint Owner / Tenant in Common?</label>
                  <select
                    value={stHelens.jointOwner}
                    onChange={(e) => updateStHelens({ jointOwner: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {stHelens.jointOwner === 'yes' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Describe joint owners & shares</label>
                    <input
                      type="text"
                      value={stHelens.otherOwnersShare}
                      onChange={(e) => updateStHelens({ otherOwnersShare: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="e.g. Joint with daughter (50%)"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mortgage secured against property?</label>
                  <select
                    value={stHelens.mortgageSecured}
                    onChange={(e) => updateStHelens({ mortgageSecured: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Where are Title Deeds held?</label>
                  <input
                    type="text"
                    value={stHelens.deedsLocation}
                    onChange={(e) => updateStHelens({ deedsLocation: e.target.value })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                    placeholder="e.g. Halifax Society / In drawer"
                  />
                </div>
              </div>
            </div>

            {/* Section 6.3: Rented details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                Section 6.3 - Rented Accommodation Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Does partner/relative own it?</label>
                  <select
                    value={stHelens.partnerOrRelativeOwns}
                    onChange={(e) => updateStHelens({ partnerOrRelativeOwns: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {stHelens.partnerOrRelativeOwns === 'yes' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship to you</label>
                    <input
                      type="text"
                      value={stHelens.relativeRelationship}
                      onChange={(e) => updateStHelens({ relativeRelationship: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="e.g. Daughter / Landlord"
                    />
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rented from private landlord?</label>
                  <select
                    value={stHelens.rentedPrivateLandlord}
                    onChange={(e) => updateStHelens({ rentedPrivateLandlord: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">From Housing Association?</label>
                  <select
                    value={stHelens.rentedHousingAssociation}
                    onChange={(e) => updateStHelens({ rentedHousingAssociation: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="na">N/A</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rent Amount (£)</label>
                  <input
                    type="number"
                    value={stHelens.rentAmount || ''}
                    onChange={(e) => {
                      const rentVal = Math.max(0, parseFloat(e.target.value) || 0);
                      updateStHelens({ rentAmount: rentVal });
                      // Sync to main expenses
                      onChange({ expenses: { ...input.expenses, rent: rentVal } });
                    }}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                    placeholder="e.g. 120"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rent Frequency</label>
                  <select
                    value={stHelens.rentFrequency}
                    onChange={(e) => updateStHelens({ rentFrequency: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Includes service charges?</label>
                  <select
                    value={stHelens.serviceChargesIncluded}
                    onChange={(e) => updateStHelens({ serviceChargesIncluded: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Former Homes & Other Property */}
        {activeTab === 'property' && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Section 7 & 8: Former Homes & Other Property interest
            </h4>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
              <span className="text-[10px] text-rose-800 font-extrabold uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded">
                Section 7: Details of any former homes
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Have you ever owned a home (if not now)?</label>
                  <select
                    value={stHelens.everOwnedHome}
                    onChange={(e) => updateStHelens({ everOwnedHome: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {stHelens.everOwnedHome === 'yes' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Address of former home</label>
                      <input
                        type="text"
                        value={stHelens.formerHomeAddress}
                        onChange={(e) => updateStHelens({ formerHomeAddress: e.target.value })}
                        className="w-full rounded border border-slate-200 p-2 bg-white"
                        placeholder="e.g. 10 Boundary Road"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">When sold / transferred?</label>
                      <input
                        type="text"
                        value={stHelens.formerHomeDateSold}
                        onChange={(e) => updateStHelens({ formerHomeDateSold: e.target.value })}
                        className="w-full rounded border border-slate-200 p-2 bg-white"
                        placeholder="e.g. October 2024"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4">
              <span className="text-[10px] text-indigo-800 font-extrabold uppercase tracking-wider bg-indigo-100 px-2 py-0.5 rounded">
                Section 8: Details of any other property or land
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Own/interest in other land/property?</label>
                  <select
                    value={stHelens.ownOtherProperty}
                    onChange={(e) => updateStHelens({ ownOtherProperty: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {stHelens.ownOtherProperty === 'yes' && (
                  <>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Address of land/property</label>
                      <input
                        type="text"
                        value={stHelens.otherPropertyAddress}
                        onChange={(e) => updateStHelens({ otherPropertyAddress: e.target.value })}
                        className="w-full rounded border border-slate-200 p-2 bg-white"
                        placeholder="e.g. land in Warrington"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Is it occupied?</label>
                      <select
                        value={stHelens.otherPropertyOccupied}
                        onChange={(e) => updateStHelens({ otherPropertyOccupied: e.target.value as any })}
                        className="w-full rounded border border-slate-200 p-2 bg-white"
                      >
                        <option value="na">N/A</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {stHelens.ownOtherProperty === 'yes' && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200/40">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Receive rental income?</label>
                    <select
                      value={stHelens.otherPropertyRentalIncome}
                      onChange={(e) => updateStHelens({ otherPropertyRentalIncome: e.target.value as any })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                    >
                      <option value="na">N/A</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rent amount received (£)</label>
                    <input
                      type="number"
                      value={stHelens.otherPropertyRentAmount || ''}
                      onChange={(e) => updateStHelens({ otherPropertyRentAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="e.g. 500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Rent Frequency</label>
                    <select
                      value={stHelens.otherPropertyRentFrequency}
                      onChange={(e) => updateStHelens({ otherPropertyRentFrequency: e.target.value as any })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mortgage secured against it?</label>
                    <select
                      value={stHelens.otherPropertyMortgage}
                      onChange={(e) => updateStHelens({ otherPropertyMortgage: e.target.value as any })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Accounts & Wills */}
        {activeTab === 'capital_will' && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Section 4 & 5: Bank Accounts details & WILL details
            </h4>

            {/* Section 4: Bank accounts list */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 block">
                  Section 4: Bank Accounts, Savings & investments details
                </label>
                <button
                  type="button"
                  onClick={handleAddAccount}
                  className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Account</span>
                </button>
              </div>

              {stHelens.capitalAccounts.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No detailed bank accounts added. Sum is pulled from the main Capital panel.</p>
              ) : (
                <div className="space-y-3">
                  {stHelens.capitalAccounts.map((acct, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Account Holder(s)</span>
                        <input
                          type="text"
                          value={acct.holder}
                          onChange={(e) => handleUpdateAccount(idx, 'holder', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="e.g. Margaret Davies"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Bank / Society</span>
                        <input
                          type="text"
                          value={acct.bank}
                          onChange={(e) => handleUpdateAccount(idx, 'bank', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="e.g. Halifax / HSBC"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Account Number</span>
                        <input
                          type="text"
                          value={acct.accountNo}
                          onChange={(e) => handleUpdateAccount(idx, 'accountNo', e.target.value)}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs font-mono"
                          placeholder="e.g. 10294819"
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Balance (£)</span>
                        <input
                          type="number"
                          value={acct.amount || ''}
                          onChange={(e) => {
                            const val = Math.max(0, parseFloat(e.target.value) || 0);
                            handleUpdateAccount(idx, 'amount', val);
                            // Optionally sync total capital if user wishes
                          }}
                          className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          placeholder="12000"
                        />
                      </div>
                      <div className="flex items-end gap-1.5 justify-between">
                        <div>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5">Proof Seen?</span>
                          <select
                            value={acct.evidence ? 'yes' : 'no'}
                            onChange={(e) => handleUpdateAccount(idx, 'evidence', e.target.value === 'yes')}
                            className="w-full rounded border border-slate-200 bg-white p-1 text-xs"
                          >
                            <option value="no">No</option>
                            <option value="yes">Yes</option>
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAccount(idx)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Remove account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Have you gifted or transferred any savings?</label>
                <select
                  value={stHelens.giftedCapital ? 'yes' : 'no'}
                  onChange={(e) => updateStHelens({ giftedCapital: e.target.value === 'yes' })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {stHelens.giftedCapital && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Details of gift/transfer (Recipient, Date, Amount)</label>
                  <input
                    type="text"
                    value={stHelens.giftedDetails}
                    onChange={(e) => updateStHelens({ giftedDetails: e.target.value })}
                    className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                    placeholder="e.g. £10k to niece in June 2025"
                  />
                </div>
              )}
            </div>

            {/* Section 5: Wills & Executors */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4 border-t border-slate-100 pt-4">
              <span className="text-[10px] text-rose-800 font-extrabold uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded block w-fit">
                Section 5: Will / Executor Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Has a WILL been made by the applicant?</label>
                  <select
                    value={stHelens.willMade}
                    onChange={(e) => updateStHelens({ willMade: e.target.value as any })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                  >
                    <option value="unknown">Not Known</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Where is copy of WILL held?</label>
                  <input
                    type="text"
                    value={stHelens.willLocation}
                    onChange={(e) => updateStHelens({ willLocation: e.target.value })}
                    className="w-full rounded border border-slate-200 p-2 bg-white"
                    placeholder="e.g. Frodshams Solicitors / Safe"
                  />
                </div>
              </div>

              {stHelens.willMade === 'yes' && (
                <div className="space-y-3 border-t border-slate-200/40 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-600 block">Executors details</span>
                    <button
                      type="button"
                      onClick={handleAddExecutor}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-0.5 rounded"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Executor</span>
                    </button>
                  </div>

                  {stHelens.executors.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No executors added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {stHelens.executors.map((exec, idx) => (
                        <div key={idx} className="p-2.5 bg-white rounded border border-slate-200 flex flex-col sm:flex-row gap-2 text-xs">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={exec.name}
                              onChange={(e) => handleUpdateExecutor(idx, 'name', e.target.value)}
                              className="w-full rounded border border-slate-200 p-1 text-xs"
                              placeholder="Executor Name"
                            />
                          </div>
                          <div className="flex-[2] flex gap-2">
                            <input
                              type="text"
                              value={exec.address}
                              onChange={(e) => handleUpdateExecutor(idx, 'address', e.target.value)}
                              className="flex-1 rounded border border-slate-200 p-1 text-xs"
                              placeholder="Executor Address"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveExecutor(idx)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Representative & Declaration */}
        {activeTab === 'representative' && (
          <div className="space-y-6 animate-fade-in">
            <h4 className="text-xs font-black uppercase text-rose-900 tracking-wider">
              Section 10 & 11: Financial Representative details & declaration
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Has a Financial Representative?</label>
                <select
                  value={stHelens.hasRep ? 'yes' : 'no'}
                  onChange={(e) => updateStHelens({ hasRep: e.target.value === 'yes' })}
                  className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                >
                  <option value="no">No, managing own finances</option>
                  <option value="yes">Yes, assisted by representative</option>
                </select>
              </div>
              {stHelens.hasRep && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Representative Type</label>
                  <select
                    value={stHelens.repType}
                    onChange={(e) => updateStHelens({ repType: e.target.value as any })}
                    className="block w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-rose-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="voluntary">Section 10A: Voluntary Representative (Help with forms)</option>
                    <option value="deputy">Section 10B: Court of Protection Deputy</option>
                    <option value="poa">Section 10B: Power of Attorney</option>
                    <option value="appointee">Section 10B: DWP Appointee</option>
                  </select>
                </div>
              )}
            </div>

            {stHelens.hasRep && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-4 animate-fade-in text-xs">
                <span className="text-[10px] text-rose-800 font-extrabold uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded">
                  Section 10C: Representatives Contact Details
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={stHelens.repName}
                      onChange={(e) => updateStHelens({ repName: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="e.g. John Davies"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Relationship to Applicant</label>
                    <input
                      type="text"
                      value={stHelens.repRelationship}
                      onChange={(e) => updateStHelens({ repRelationship: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="e.g. Son / Friend"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Address</label>
                    <input
                      type="text"
                      value={stHelens.repAddress}
                      onChange={(e) => updateStHelens({ repAddress: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="Full address with postcode"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Telephone Number</label>
                    <input
                      type="text"
                      value={stHelens.repPhone}
                      onChange={(e) => updateStHelens({ repPhone: e.target.value })}
                      className="w-full rounded border border-slate-200 p-2 bg-white"
                      placeholder="Telephone / Mobile"
                    />
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-[11px] text-rose-800 leading-normal">
                  💡 <strong>Requirement Reminder</strong>: Formal representatives (Deputy, POA, or Appointee) must provide photocopy proof of their Court, DWP, or solicitor authorization along with the completed booklet.
                </div>
              </div>
            )}

            {/* Declaration Preview */}
            <div className="p-4 bg-slate-900 text-slate-300 rounded-xl space-y-2 border border-slate-800">
              <h5 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1">
                ✍️ Declaration Summary (Section 11)
              </h5>
              <p className="text-[10px] leading-relaxed">
                By submitting this form draft, you declare the information is correct and complete, and you consent to St Helens Council verifying these figures with the Department for Work and Pensions (DWP) and local revenues division to prevent benefit and public fund fraud.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
