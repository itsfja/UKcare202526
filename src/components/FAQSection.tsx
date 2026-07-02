/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldQuestion } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FAQItem[] = [
    {
      question: "Will they make me sell my house to pay for care in my own home?",
      answer: (
        <p>
          <strong>No, absolutely not.</strong> For care provided in your own home (non-residential care), the value of your primary residence is <strong>100% ignored</strong>. You are completely protected from having your main home included in the financial means test.
        </p>
      ),
    },
    {
      question: "What is the Minimum Income Guarantee (MIG)?",
      answer: (
        <p>
          The Minimum Income Guarantee is a statutory floor set by the government. It is the amount of weekly income you <strong>must be left with</strong> to pay for food, utilities, and daily essentials after paying your care contribution. Councils are legally forbidden from charging you if doing so would take your income below your MIG level.
        </p>
      ),
    },
    {
      question: "What counts as Disability Related Expenditure (DRE)?",
      answer: (
        <div className="space-y-1">
          <p>
            DRE represents any additional costs you incur directly because of a disability, age, or health condition. Standard examples that councils must consider include:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Additional heating or energy bills (due to limited mobility or poor circulation).</li>
            <li>Community alarm response services (like Lifeline or Careline buttons).</li>
            <li>Extra laundry services or specialized bedding (due to skin conditions or incontinence).</li>
            <li>Purchase, repair, or maintenance of wheelchairs, stairlifts, or hoists.</li>
            <li>Specialist organic or allergen diets prescribed by doctors.</li>
            <li>Necessary gardening or cleaning services you can no longer do yourself.</li>
          </ul>
        </div>
      ),
    },
    {
      question: "How does the council treat capital, savings, and joint accounts?",
      answer: (
        <p>
          Capital includes cash, savings accounts, ISA accounts, stocks, shares, premium bonds, and secondary properties. Your primary home is excluded. If you have joint savings accounts with a spouse or partner, the council will assume a <strong>50/50 split</strong> of those funds unless you prove that you own a different share.
        </p>
      ),
    },
    {
      question: "What happens if my capital savings drop below the limit?",
      answer: (
        <p>
          If your capital is currently above the upper threshold (e.g. £23,250 in England), you are a "self-funder" and pay 100% of care costs. However, once your capital drops close to or below the upper threshold, you should contact your local council immediately to request a new financial assessment. The council will start funding care from that point onwards.
        </p>
      ),
    },
    {
      question: "Can the council force me to use my employment earnings to pay for care?",
      answer: (
        <p>
          <strong>No.</strong> Under national care guidelines, all earnings from employment, self-employment, or apprentice wages are <strong>fully disregarded</strong>. This is to encourage disabled or elderly people to remain in or seek work if they wish to do so.
        </p>
      ),
    },
  ];

  return (
    <div className="space-y-4" id="faq-section-accordion">
      <div className="flex items-center gap-2 mb-2">
        <ShieldQuestion className="h-5 w-5 text-indigo-600" />
        <h3 className="font-extrabold text-slate-800 text-lg">Frequently Asked Questions</h3>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed">
        Understand your legal rights, statutory limits, and how means tests protect your assets under national legislation.
      </p>

      <div className="space-y-2">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-xl border transition-all ${
                isOpen ? 'border-indigo-600 bg-indigo-50/10 shadow-2xs' : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                id={`faq-btn-${index}`}
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-800 text-sm focus:outline-none"
              >
                <span className="pr-4">{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-indigo-600 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
