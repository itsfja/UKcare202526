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
  FolderOpen
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

  const breakdown = calculateAssessment(input);

  const steps = [
    { label: 'Location & Age', component: <DemographicsForm input={input} onChange={handleInputChange} /> },
    { label: 'Care Package', component: <CareCostForm input={input} onChange={handleInputChange} /> },
    { label: 'Capital & Savings', component: <CapitalForm input={input} onChange={handleInputChange} /> },
    { label: 'Weekly Income', component: <IncomeForm input={input} onChange={handleInputChange} /> },
    { label: 'Expenses & DRE', component: <ExpensesForm input={input} onChange={handleInputChange} /> },
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
      <header className="sticky top-0 bg-blue-900 text-white z-30 shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex justify-between items-center">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-lg text-white">C</div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight uppercase">Council Care Contribution Calculator</h1>
              <p className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Financial Year 2026/27</p>
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
                          
                          <div className="text-right shrink-0 px-1">
                            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Excess Income</span>
                            <span className="text-xs font-mono font-bold text-blue-900">
                              £{itemBreakdown.netWeeklyIncome.toFixed(2)}
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
      </AnimatePresence>

      {/* 3. Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
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
                <CalculationSummary breakdown={breakdown} region={input.region} />

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
