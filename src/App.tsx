/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinancialAssessmentInput, CalculationBreakdown, SavedAssessment } from './types';
import { calculateAssessment, getDefaultInput } from './utils/calculator';
import { DemographicsForm } from './components/DemographicsForm';
import { CareCostForm } from './components/CareCostForm';
import { CapitalForm } from './components/CapitalForm';
import { IncomeForm } from './components/IncomeForm';
import { ExpensesForm } from './components/ExpensesForm';
import { StHelensFormDetails } from './components/StHelensFormDetails';
import { CalculationSummary } from './components/CalculationSummary';
import { RegionRulesInfo } from './components/RegionRulesInfo';
import { DetailedReport } from './components/DetailedReport';
import { FAQSection } from './components/FAQSection';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  Printer,
  Bookmark,
  RefreshCw,
  HelpCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  PlusCircle,
  Trash2,
  FolderOpen,
  Info,
  BookOpen,
  Coffee,
  User,
  Cpu,
  ExternalLink
} from 'lucide-react';

export default function App() {
  const [input, setInput] = useState<FinancialAssessmentInput>(() => {
    // Attempt to load current working draft from localStorage
    const savedDraft = localStorage.getItem('care_calculator_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (e) {
        return getDefaultInput();
      }
    }
    return getDefaultInput();
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [viewingReport, setViewingReport] = useState<boolean>(false);
  const [savedAssessments, setSavedAssessments] = useState<SavedAssessment[]>([]);
  const [saveName, setSaveName] = useState<string>('');
  const [showSavedList, setShowSavedList] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showHowToModal, setShowHowToModal] = useState<boolean>(false);
  const [showReadmeModal, setShowReadmeModal] = useState<boolean>(false);
  const [readmePage, setReadmePage] = useState<number>(1);

  // Auto-save draft to localStorage when input changes
  useEffect(() => {
    localStorage.setItem('care_calculator_draft', JSON.stringify(input));
  }, [input]);

  // Load saved list on mount
  useEffect(() => {
    const list = localStorage.getItem('care_calculator_saved_assessments');
    if (list) {
      try {
        setSavedAssessments(JSON.parse(list));
      } catch (e) {
        setSavedAssessments([]);
      }
    }
  }, []);

  const handleInputChange = (updates: Partial<FinancialAssessmentInput>) => {
    setInput((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all entries back to default example values?')) {
      setInput(getDefaultInput());
      setCurrentStep(0);
      setViewingReport(false);
    }
  };

  // Saved Assessments Management
  const handleSaveCurrent = () => {
    if (!saveName.trim()) {
      alert('Please enter a name for this assessment.');
      return;
    }

    const newSaved: SavedAssessment = {
      id: crypto.randomUUID(),
      name: saveName.trim(),
      date: new Date().toLocaleDateString(),
      input,
    };

    const updated = [newSaved, ...savedAssessments];
    setSavedAssessments(updated);
    localStorage.setItem('care_calculator_saved_assessments', JSON.stringify(updated));
    setSaveName('');
    setShowSaveDialog(false);
    alert(`"${newSaved.name}" has been successfully saved!`);
  };

  const handleLoadSaved = (saved: SavedAssessment) => {
    setInput(saved.input);
    setShowSavedList(false);
    setCurrentStep(0);
    setViewingReport(false);
    alert(`Loaded "${saved.name}" assessment successfully.`);
  };

  const handleDeleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved calculation?')) {
      const updated = savedAssessments.filter((item) => item.id !== id);
      setSavedAssessments(updated);
      localStorage.setItem('care_calculator_saved_assessments', JSON.stringify(updated));
    }
  };

  // Safely bound currentStep when St Helens mode is turned on or off
  useEffect(() => {
    const maxStep = (input.isStHelensMode ? 6 : 5) - 1;
    if (currentStep > maxStep) {
      setCurrentStep(maxStep);
    }
  }, [input.isStHelensMode, currentStep]);

  const breakdown = calculateAssessment(input);

  const steps = [
    { label: 'Assessment Year, Country & Age Group', component: <DemographicsForm input={input} onChange={handleInputChange} /> },
    { label: 'Care Package', component: <CareCostForm input={input} onChange={handleInputChange} /> },
    { label: 'Capital & Savings', component: <CapitalForm input={input} onChange={handleInputChange} /> },
    { label: 'Weekly Income', component: <IncomeForm input={input} onChange={handleInputChange} /> },
    { label: 'Expenses & DRE', component: <ExpensesForm input={input} onChange={handleInputChange} /> },
    ...(input.isStHelensMode ? [
      { label: 'St Helens Council Unofficial Form Details', component: <StHelensFormDetails input={input} onChange={handleInputChange} /> }
    ] : []),
  ];

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewingReport(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" id="app-root-container">
      
      {/* 1. Header & Navigation Brand */}
      <header className={`sticky top-0 z-30 shadow-md print:hidden transition-all duration-300 ${input.isStHelensMode ? 'bg-rose-950 text-white border-b border-rose-900' : 'bg-blue-900 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-lg transition-all ${input.isStHelensMode ? 'bg-rose-600 text-white' : 'bg-white/20 text-white'}`}>
              {input.isStHelensMode ? '🏛️' : 'C'}
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight uppercase">
                {input.isStHelensMode ? 'St Helens Care Document Generator' : 'Council Care Contribution Calculator'}
              </h1>
              <p className={`text-[10px] uppercase tracking-widest font-mono ${input.isStHelensMode ? 'text-rose-300' : 'text-blue-200'}`}>
                {input.isStHelensMode ? 'Unofficial Draft Prep Mode' : 'Financial Year 2026/27'}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2">
            {/* Saved Estimates Button */}
            <button
              type="button"
              id="saved-list-trigger"
              onClick={() => setShowSavedList(!showSavedList)}
              className="flex items-center gap-1 px-2.5 py-1 rounded border border-blue-700 bg-blue-800/50 text-[11px] font-semibold text-white hover:bg-blue-800 transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5 text-blue-200" />
              <span className="hidden sm:inline">Saved ({savedAssessments.length})</span>
            </button>

            {/* Save Current Button */}
            <button
              type="button"
              id="save-current-trigger"
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-white text-[11px] font-bold text-blue-900 hover:bg-slate-100 transition-colors"
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Save</span>
            </button>

            {/* Reset Button */}
            <button
              type="button"
              id="reset-calculator-btn"
              onClick={handleReset}
              className="p-1 rounded border border-blue-700 bg-blue-800/50 hover:bg-blue-800 text-white transition-colors"
              title="Reset all fields"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Drawer / Popup lists */}
      <AnimatePresence>
        {/* Saved List Panel Overlay */}
        {showSavedList && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSavedList(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-6 flex flex-col justify-between"
              id="saved-list-drawer"
            >
              <div className="space-y-6 overflow-y-auto flex-1 pr-1">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-900" />
                    Saved Estimates
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowSavedList(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase"
                  >
                    Close
                  </button>
                </div>

                {savedAssessments.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Bookmark className="h-8 w-8 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400">No saved estimations found.</p>
                    <p className="text-[11px] text-slate-400 leading-normal max-w-xs mx-auto">
                      Use the "Save" button in the header bar to store scenarios to compare side-by-side.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedAssessments.map((item) => {
                      const itemBreakdown = calculateAssessment(item.input);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleLoadSaved(item)}
                          className="p-3 rounded border border-slate-200 bg-white hover:border-blue-900 hover:bg-slate-50 cursor-pointer transition-all flex justify-between items-center group gap-3"
                          id={`saved-item-${item.id}`}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 text-xs group-hover:text-blue-900 transition-colors truncate">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono truncate">
                              Assessed: {item.date} • {item.input.region.toUpperCase()}
                            </p>
                          </div>
                          
                          <div className="text-right shrink-0 min-w-[75px] px-1">
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Net Excess</span>
                            <span className="text-xs font-mono font-bold text-slate-600">
                              £{itemBreakdown.netWeeklyIncome.toFixed(2)}
                            </span>
                          </div>

                          <div className="text-right shrink-0 min-w-[85px] px-1">
                            <span className="text-[9px] text-indigo-400 uppercase tracking-wider block font-bold">Contribution</span>
                            <span className="text-xs font-mono font-bold text-blue-900">
                              £{itemBreakdown.userWeeklyContribution.toFixed(2)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteSaved(item.id, e)}
                            className="p-1 rounded text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all shrink-0"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4">
                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  Saved estimates are stored in your local browser cache. They will persist until you clear your browser data.
                </p>
              </div>
            </motion.div>
          </>
        )}

        {/* Save Dialog Popup */}
        {showSaveDialog && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaveDialog(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 top-24 mx-auto max-w-sm bg-white rounded-xl shadow-xl z-50 p-5 space-y-4 border border-slate-200"
              id="save-dialog-modal"
            >
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Save Current Estimate</h3>
              <p className="text-xs text-slate-500 leading-normal">Give this calculation a memorable name to differentiate it in your list.</p>
              <div className="space-y-1">
                <label htmlFor="saveNameInput" className="text-[10px] font-bold uppercase text-slate-500">Estimate Name</label>
                <input
                  type="text"
                  id="saveNameInput"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="e.g. Grandma Joan - 12hr package"
                  className="block w-full rounded border border-slate-200 p-2 text-xs focus:border-blue-900 focus:outline-none"
                  maxLength={40}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveCurrent();
                  }}
                />
              </div>
              <div className="flex gap-2 justify-end pt-2 text-[10px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => setShowSaveDialog(false)}
                  className="px-3.5 py-2 rounded border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="dialog-save-confirm-btn"
                  onClick={handleSaveCurrent}
                  className="px-4 py-2 rounded bg-blue-900 text-white hover:bg-blue-800"
                >
                  Save Estimation
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* About Modal */}
        {showAboutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 top-16 mx-auto max-w-lg bg-white rounded-xl shadow-xl z-50 p-6 space-y-5 border border-slate-200 overflow-y-auto max-h-[85vh]"
              id="about-dialog-modal"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3" id="about-modal-header">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-indigo-600" />
                    About the Project
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5" id="about-app-version">
                    Version 1.1.13 (Build 13)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase cursor-pointer"
                  id="about-modal-close-top"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="about-team-grid">
                {/* Team Lead Card */}
                <div className="bg-indigo-50/30 border border-indigo-100 rounded-xl p-4 space-y-2.5" id="lead-dev-card">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded" id="lead-dev-icon-box">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 block">Lead Developer</span>
                      <h4 className="font-bold text-xs text-slate-800">AI Coding Agent</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Designed and built the core calculator machinery, including regional legislation thresholds, statutory MIG deductions, savings tariff algorithms, dynamic accordion panels, and fully formatted printable statement reports. Powered by Gemini.
                  </p>
                </div>

                {/* Ideas Man Card */}
                <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-4 space-y-2.5" id="ideas-man-card">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 text-blue-700 rounded" id="ideas-man-icon-box">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 block">Ideas Man</span>
                      <h4 className="font-bold text-xs text-slate-800">armstrongfj</h4>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    The creative visionary behind the calculation flow, the custom user interface style, and policy edge-cases. Dedicated to building accessible public tools that keep citizens' sixpences safe and ensure fair financial assessments.
                  </p>
                </div>
              </div>

              {/* Buy Me a Coffee section */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-3" id="coffee-cta-section">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5" id="coffee-icon-box">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-bold text-xs text-amber-950 flex items-center gap-1.5" id="coffee-header-title">
                      Buy Me a Coffee
                    </h5>
                    <p className="text-[11px] text-amber-900/80 leading-normal">
                      Support the Ideas Man! Your generous contributions keep armstrongfj fueled, biscuits flowing, and ensure this tool remains free, robust, and accessible to everyone.
                    </p>
                  </div>
                </div>
                <div className="pt-1.5 flex justify-end" id="coffee-button-container">
                  <a
                    href="https://buymeacoffee.com/armstrongfj"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFDD00] hover:bg-[#ffea45] active:scale-95 text-xs font-extrabold text-slate-900 transition-all cursor-pointer shadow-sm"
                    id="buy-coffee-link-btn"
                  >
                    <span>☕ Buy Me a Coffee</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              <div className="flex justify-end pt-2" id="about-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  id="about-modal-close-btn"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* How To Use Modal */}
        {showHowToModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHowToModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 top-12 mx-auto max-w-lg bg-white rounded-xl shadow-xl z-50 p-6 space-y-4 border border-slate-200 overflow-y-auto max-h-[90vh]"
              id="howto-dialog-modal"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3" id="howto-modal-header">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4 text-blue-600" />
                  How to Use this Calculator
                </h3>
                <button
                  type="button"
                  onClick={() => setShowHowToModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase cursor-pointer"
                  id="howto-modal-close-top"
                >
                  Close
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed" id="howto-content-body">
                <p>
                  This wizard walks you through a complete standard financial means test for home care, matching current regional charging laws and limits.
                </p>

                <div className="space-y-3.5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100" id="howto-steps-list">
                  <div className="relative pl-7" id="howto-step-1">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center font-mono">1</span>
                    <h5 className="font-bold text-slate-800">Step 1: Set Assessment parameters</h5>
                    <p className="text-[11px] text-slate-500">
                      Choose the <strong>Financial Assessment Year</strong>, your home country, and age group. This sets your legal protected income baseline (Minimum Income Guarantee / MIG).
                    </p>
                  </div>

                  <div className="relative pl-7" id="howto-step-2">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center font-mono">2</span>
                    <h5 className="font-bold text-slate-800">Step 2: Setup Your Care Package</h5>
                    <p className="text-[11px] text-slate-500">
                      Enter the care hours scheduled per week and hourly charge rate, or toggle to enter a custom overall care budget.
                    </p>
                  </div>

                  <div className="relative pl-7" id="howto-step-3">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center font-mono">3</span>
                    <h5 className="font-bold text-slate-800">Step 3: Declare Capital & Savings</h5>
                    <p className="text-[11px] text-slate-500">
                      Enter liquid savings, stocks, and secondary property value (your primary home is fully ignored). See if you are below the magic disregard shield, in the slidey tariff zone, or above the self-funder cliff.
                    </p>
                  </div>

                  <div className="relative pl-7" id="howto-step-4">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center font-mono">4</span>
                    <h5 className="font-bold text-slate-800">Step 4: Input Pensions & Benefits</h5>
                    <p className="text-[11px] text-slate-500">
                      Enter weekly State Pension, occupational pensions, and disability benefits like PIP, DLA, or Attendance Allowance. Remember, earnings from jobs are 100% ignored.
                    </p>
                  </div>

                  <div className="relative pl-7" id="howto-step-5">
                    <span className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-[11px] flex items-center justify-center font-mono">5</span>
                    <h5 className="font-bold text-slate-800">Step 5: Deduct Disability Expenses & Housing</h5>
                    <p className="text-[11px] text-slate-500">
                      Declare weekly housing costs (rent, mortgage, council tax) and any <strong>Disability-Related Expenditure (DRE)</strong> (extra fuel bills, laundry help, gardening help, lifelines) to increase your disregards and lower your bill.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 space-y-1.5 text-[11px]" id="howto-sidebar-tip">
                  <h6 className="font-bold text-blue-950 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-blue-700" />
                    Compare and Print
                  </h6>
                  <p className="text-slate-600 leading-normal">
                    The calculations sidebar updates instantly as you fill the steps. Click <strong>"Save"</strong> in the top header to save comparison scenarios, and click <strong>"Create Printable Statement"</strong> at the end to get an official itemized report to hand to your visiting officer!
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2" id="howto-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowHowToModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  id="howto-modal-close-btn"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}

        {/* Ladybird Book README Modal */}
        {showReadmeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReadmeModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed inset-x-4 top-10 mx-auto max-w-2xl bg-[#FAF6EE] text-amber-950 rounded-2xl shadow-2xl z-50 p-6 border-2 border-amber-300 overflow-y-auto max-h-[92vh] font-serif"
              id="readme-dialog-modal"
            >
              {/* Ladybird Book Header */}
              <div className="flex justify-between items-center border-b border-amber-200 pb-3" id="readme-modal-header">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-amber-900 text-sm sm:text-base uppercase tracking-wider">
                    The Ladybird Book of Home Care
                  </h3>
                  <p className="text-[10px] text-amber-700 italic font-sans uppercase tracking-widest font-bold">
                    A Guide for Sensible Citizens who Wish to Keep their Sixpences
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReadmeModal(false)}
                  className="text-amber-700 hover:text-amber-900 text-xs font-bold uppercase cursor-pointer font-sans border border-amber-200 px-2 py-1 rounded bg-amber-50"
                  id="readme-modal-close-top"
                >
                  Close
                </button>
              </div>

              {/* Book Page Navigation Tabs */}
              <div className="flex flex-wrap gap-1 py-3 border-b border-amber-100 font-sans text-[10px] uppercase font-bold" id="readme-pages-nav">
                {[1, 2, 3, 4, 5, 6].map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setReadmePage(pNum)}
                    className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                      readmePage === pNum
                        ? 'bg-amber-800 text-white'
                        : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                    }`}
                    id={`readme-nav-page-${pNum}`}
                  >
                    Page {pNum}
                  </button>
                ))}
              </div>

              {/* Active Book Page Content */}
              <div className="py-5 space-y-4 min-h-[320px]" id="readme-book-page-content">
                {readmePage === 1 && (
                  <div className="space-y-3" id="readme-page-1-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 1: The King is Rich, but the Squire is Poor
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is a picture of <strong>Whitehall</strong>. It is in London. In Whitehall, there are very grand stone buildings. The people inside them have very large checkbooks. They are very rich. They spend millions of pounds on big computers and shiny train tracks.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is a picture of <strong>Town Hall</strong>. It is in your neighborhood. It is built of gray brick. The roof is leaking. The Town Hall belongs to the <strong>Local Council</strong>. The Council is very poor. They do not have enough money to sweep the streets or fix the swings in the park.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      Because the Council is poor, they look at your savings account with hungry eyes. They would like some of your money to pay for the ladies and gentlemen who come to help you make your tea and brush your hair.
                    </p>
                    <div className="bg-[#FFFDF9] border border-amber-200 p-3.5 rounded-xl font-mono text-[10px] text-amber-900 whitespace-pre overflow-x-auto text-center" id="readme-page-1-diagram">
{` [ Whitehall: Rich & Far Away ]
              ▲
              │ (Hands out rules, keeps the big chests)
              ▼
 [ Town Hall: Poor & Hungry ]
              ▲
              │ (Wants to empty your piggy bank)
              ▼
   [ Your Little Wallet ]`}
                    </div>
                  </div>
                )}

                {readmePage === 2 && (
                  <div className="space-y-3" id="readme-page-2-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 2: The Man with the Clipboard
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is <strong>Mr. Gribble</strong>. He works for the Council. He is a Visiting Officer. Mr. Gribble is a very polite man, but you must not let him eat your biscuits.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      Mr. Gribble is coming to do a <strong>Financial Assessment</strong>. He has a very long form on a heavy clipboard. He wants to know about:
                    </p>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-950/90">
                      <li>Your pension from the government.</li>
                      <li>Your extra pension from when you worked at the biscuit factory.</li>
                      <li>The coins hidden under your mattress.</li>
                      <li>Your shares in the railway.</li>
                    </ul>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      Mr. Gribble wants to add all these numbers together. The bigger the number he writes down, the more you will have to pay for your own care, and the less the poor Council has to spend.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900 font-bold italic">
                      This book will teach you how to make Mr. Gribble's clipboard look much less frightening.
                    </p>
                  </div>
                )}

                {readmePage === 3 && (
                  <div className="space-y-3" id="readme-page-3-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 3: The Magic Invisible Shields
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      In England, Scotland, Wales, and Northern Ireland, the King has written some rules. The Council must follow these rules, even if they make the Council cry. These are called <strong>Capital Limits</strong>.
                    </p>
                    <div className="space-y-2 border-l-2 border-amber-600 pl-3">
                      <p className="text-xs leading-relaxed text-amber-950/90">
                        1. <strong>The Lower Shield</strong>: If your total savings are below the <strong>Lower Capital Limit</strong> (usually £14,250 in England), your savings are protected by a magic spell. The Council must pretend they do not exist!
                      </p>
                      <p className="text-xs leading-relaxed text-amber-950/90">
                        2. <strong>The Upper Cliff</strong>: If your savings are above the <strong>Upper Capital Limit</strong> (usually £23,250 in England), the Council will rub their hands together. They will say: <em>"Aha! You are a Self-Funder! You must pay for everything yourself!"</em>
                      </p>
                      <p className="text-xs leading-relaxed text-amber-950/90">
                        3. <strong>The Slidey Middle (Tariff Income)</strong>: If you are between the two limits, the Council pretends you earn <strong>£1 a week for every £250</strong> you own. This is not real money. It is pretend money. But you must pay real coins because of it.
                      </p>
                    </div>
                    <div className="bg-[#FFFDF9] border border-amber-200 p-3.5 rounded-xl font-mono text-[9px] text-amber-950 overflow-x-auto" id="readme-page-3-diagram">
{`+-------------------------------------------------------+
|  YOUR SAVINGS                                         |
+-------------------------------------------------------+
|  Above Upper Limit   -->  [ YOU PAY 100% OF THE BILL ]| <-- The Cliff!
+-------------------------------------------------------+
|  Between Limits      -->  [ THE SLIDEY TARIFF ZONE ]  | <-- Pretend Income!
+-------------------------------------------------------+
|  Below Lower Limit   -->  [ DISREGARDED & SAFE! ]     | <-- The Shield!
+-------------------------------------------------------+`}
                    </div>
                  </div>
                )}

                {readmePage === 4 && (
                  <div className="space-y-3" id="readme-page-4-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 4: Peter and Jane Learn about the MIG
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is <strong>Jane</strong>. Jane is seventy-five. Jane likes a cup of tea and a slice of sponge cake.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      The law says that Jane must always have enough money left over to buy her tea, sponge cake, and newspapers. This is called the <strong>Minimum Income Guarantee (MIG)</strong>.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      The Council is <strong>forbidden</strong> from making you so poor that your weekly income falls below the MIG. Even if you have a very expensive care package, you are legally entitled to keep this basic pocket money.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950/90 font-sans font-medium">
                      <li>The Council wants your MIG to be as small as possible.</li>
                      <li>You want your MIG to be as big as possible.</li>
                      <li>The <strong>Home Care Calculator</strong> knows the exact statutory MIG rates for your age and region, so the Council cannot play any tricks.</li>
                    </ul>
                  </div>
                )}

                {readmePage === 5 && (
                  <div className="space-y-3" id="readme-page-5-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 5: The Wizard's Secret Disregard (DRE)
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is a picture of <strong>Disability Related Expenditure</strong>, or <strong>DRE</strong> for short. It is a very long name for a very clever trick.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      If you are poorly or disabled, you have to spend extra money just to stay warm and clean. The Council must subtract these extra expenses from your income <em>before</em> they calculate your bill. This makes your "assessable income" look smaller.
                    </p>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      To pay as little as is practical, you must tell the Council about every single extra penny you spend because of your health. You can count:
                    </p>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-amber-950/90 list-disc pl-5">
                      <li><strong>The Coal & Gas</strong>: Heating on high</li>
                      <li><strong>The Laundry</strong>: Washing sheets often</li>
                      <li><strong>The Special Boots</strong>: For swollen feet</li>
                      <li><strong>The Garden help</strong>: Neighbor boy mows</li>
                      <li><strong>The Hairdryer</strong>: Arm-lifting assist</li>
                    </ul>
                    <div className="bg-[#FFFDF9] border border-amber-200 p-3.5 rounded-xl font-mono text-[9px] text-amber-900 overflow-x-auto" id="readme-page-5-diagram">
{`  [ Your Total Weekly Income ]
               │
               ▼
  (Minus) [ Minimum Income Guarantee ]
  (Minus) [ Rent & Council Tax ]
  (Minus) [ Disability Expenses (DRE) ] <--- Add as many as you can!
               │
               ▼
  [ The Only Part the Council Can Touch ]`}
                    </div>
                  </div>
                )}

                {readmePage === 6 && (
                  <div className="space-y-3" id="readme-page-6-body">
                    <h4 className="text-lg font-bold text-amber-900 border-b border-amber-100 pb-1">
                      Page 6: Our Wonderful App
                    </h4>
                    <p className="text-xs leading-relaxed text-amber-950/90">
                      This is a picture of our <strong>Home Care Calculator</strong>. It is a very clever machine that lives in your computer or telephone. It has been built to help you, your children, and your advisors prepare for the visit from Mr. Gribble.
                    </p>
                    <h5 className="font-bold text-xs text-amber-900 font-sans uppercase tracking-wider">Why you should use it:</h5>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs text-amber-950/90">
                      <li><strong>No Sneaky Business</strong>: It knows the exact rules for England, Scotland, Wales, and Northern Ireland. If the Council tries to charge you English rates in Cardiff, our machine will sound the alarm.</li>
                      <li><strong>The Savings Drawer</strong>: You can save your calculations to compare different care packages or to keep a record before Mr. Gribble arrives.</li>
                      <li><strong>The Proof Paper</strong>: You can print a beautiful, official-looking <strong>Detailed Statement</strong> to hand to the Council. When Mr. Gribble sees this, he will realize you are a very clever person who has read this book, and he will be very careful with his pencil.</li>
                    </ol>
                    <p className="text-xs leading-relaxed italic text-amber-900 font-semibold text-center py-2 border-t border-amber-200 mt-3">
                      "Use the calculator wisely, keep your receipts for your special boots, and do not let the Town Hall take your biscuit money."
                    </p>
                  </div>
                )}
              </div>

              {/* Page Selector & Bottom Footer */}
              <div className="flex justify-between items-center border-t border-amber-200 pt-3.5 mt-3 font-sans" id="readme-modal-actions">
                <button
                  type="button"
                  disabled={readmePage === 1}
                  onClick={() => setReadmePage((prev) => prev - 1)}
                  className="px-3 py-1.5 rounded text-xs font-bold uppercase border border-amber-200 hover:bg-amber-100 text-amber-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                  id="readme-btn-prev"
                >
                  Previous Page
                </button>
                <span className="text-xs font-bold text-amber-800">
                  Page {readmePage} of 6
                </span>
                {readmePage < 6 ? (
                  <button
                    type="button"
                    onClick={() => setReadmePage((prev) => prev + 1)}
                    className="px-4 py-1.5 rounded text-xs font-bold uppercase bg-amber-800 hover:bg-amber-900 text-white cursor-pointer"
                    id="readme-btn-next"
                  >
                    Next Page
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowReadmeModal(false)}
                    className="px-4 py-1.5 rounded text-xs font-bold uppercase bg-amber-900 hover:bg-amber-950 text-white cursor-pointer"
                    id="readme-btn-finish"
                  >
                    Finish Guide
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full" id="main-content-area">
        
        {/* Help, Guide, & Developer Info Utility Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6 bg-slate-50 p-2.5 rounded-xl border border-slate-200 print:hidden shadow-xs" id="quick-links-action-bar">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 ml-1.5 hidden sm:inline">Resources:</span>
          
          {/* About Button */}
          <button
            type="button"
            onClick={() => setShowAboutModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            id="about-app-btn"
          >
            <Info className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
            <span>About</span>
          </button>

          {/* How to Use Button */}
          <button
            type="button"
            onClick={() => setShowHowToModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
            id="howto-guide-btn"
          >
            <HelpCircle className="h-3.5 w-3.5 text-blue-600" />
            <span>How to Use</span>
          </button>

          {/* Git Readme Button */}
          <button
            type="button"
            onClick={() => setShowReadmeModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-900 transition-all cursor-pointer shadow-2xs"
            id="ladybird-guide-btn"
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-700" />
            <span>Ladybird Guide (README)</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          
          {/* Detailed Statement View */}
          {viewingReport ? (
            <motion.div
              key="report-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <DetailedReport
                input={input}
                breakdown={breakdown}
                onBack={() => setViewingReport(false)}
              />
            </motion.div>
          ) : (
            /* Main Interactive Wizard / Sidebar view */
            <motion.div
              key="calculator-view"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              
              {/* Wizard Side (Left 8/12) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Intro Hero Banner - High Density Style */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900 text-white font-mono px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Notice</span>
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Non-Residential Care Means Test</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">
                    Calculate your personal contribution to Care in the Home.
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Social care in the UK is means-tested. This wizard calculates assessments aligning with the Care Act, regional thresholds (England, Scotland, Wales, Northern Ireland), Minimum Income Guarantee (MIG) baselines, and disability expenditure allowances.
                  </p>
                </div>

                {/* Wizard Tab Progress Header */}
                <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-2.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <span>STEP {currentStep + 1} OF {steps.length}</span>
                    <span className="text-blue-900">{steps[currentStep].label}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {steps.map((step, idx) => (
                      <button
                        key={idx}
                        type="button"
                        id={`step-indicator-btn-${idx}`}
                        onClick={() => setCurrentStep(idx)}
                        className={`h-1.5 flex-1 rounded transition-all ${
                          idx === currentStep
                            ? 'bg-blue-900'
                            : idx < currentStep
                            ? 'bg-emerald-600'
                            : 'bg-slate-100'
                        }`}
                        title={`Go to: ${step.label}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                  {/* Step Header */}
                  <div className="bg-slate-100 px-5 py-3 border-b border-slate-200">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {currentStep + 1}. {steps[currentStep].label}
                    </h2>
                  </div>

                  <div className="p-5 sm:p-6 space-y-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.15 }}
                      >
                        {steps[currentStep].component}
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Footer Inside Card */}
                    <div className="flex justify-between items-center border-t border-slate-200 pt-5 mt-6">
                      <button
                        type="button"
                        id="wizard-prev-btn"
                        onClick={handlePrevStep}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-1 px-3.5 py-2 rounded text-xs font-bold uppercase tracking-wider border transition-all ${
                          currentStep === 0
                            ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                            : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        Back
                      </button>

                      <button
                        type="button"
                        id="wizard-next-btn"
                        onClick={handleNextStep}
                        className="flex items-center gap-1 px-4 py-2 rounded bg-blue-900 hover:bg-blue-800 text-xs font-bold uppercase tracking-wider text-white transition-all shadow-sm cursor-pointer"
                      >
                        <span>{currentStep === steps.length - 1 ? 'View Statement' : 'Continue'}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <FAQSection />
              </div>

              {/* Sidebar Summary (Right 4/12) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Active Region quick details */}
                <RegionRulesInfo region={input.region} />

                {/* Interactive Dynamic Estimates Panel */}
                <CalculationSummary breakdown={breakdown} region={input.region} input={input} />

                {/* Generate Statement Shortcut Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center space-y-2.5 shadow-sm">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">Printable Statement</h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    Generate a formal, itemized contribution statement with detailed breakdown tables to print or download.
                  </p>
                  <button
                    type="button"
                    id="sidebar-statement-btn"
                    onClick={() => {
                      setViewingReport(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded border border-slate-300 hover:bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all cursor-pointer bg-white"
                  >
                    <Printer className="h-4 w-4 text-slate-500" />
                    Create Printable Statement
                  </button>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 mt-20 print:hidden">
        <p className="text-[10px] text-slate-500 max-w-2xl text-center md:text-left leading-normal">
          DISCLAIMER: This calculator is provided for indicative purposes only. Final financial assessments are conducted by the Council's Visiting Officer and may vary based on verified documentation and changes in national charging policy.
        </p>
        <div className="flex space-x-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">
          <span>Help</span>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </footer>
    </div>
  );
}
