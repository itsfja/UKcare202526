/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { FinancialAssessmentInput, CalculationBreakdown } from '../types';
import { Printer, Download, ArrowLeft, Heart, CheckCircle, ShieldAlert, Sparkles, Banknote, Sliders, Copy, Check, ExternalLink, AlertCircle, Share2, Smartphone, X } from 'lucide-react';

interface DetailedReportProps {
  input: FinancialAssessmentInput;
  breakdown: CalculationBreakdown;
  onBack: () => void;
}

export const DetailedReport: React.FC<DetailedReportProps> = ({ input, breakdown, onBack }) => {
  const [housekeeping, setHousekeeping] = useState<number>(206.98);
  const [useAstronomical, setUseAstronomical] = useState<boolean>(true);
  const [isIframe, setIsIframe] = useState<boolean>(false);
  const [showIframePrintHelp, setShowIframePrintHelp] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showMobileAssist, setShowMobileAssist] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsIframe(window.self !== window.top);
    }
  }, []);

  const handlePrint = () => {
    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile WebView or device detected where direct print is often blocked/unsupported
      setShowMobileAssist(true);
    } else {
      if (typeof window !== 'undefined' && window.self !== window.top) {
        setShowIframePrintHelp(true);
      }
      try {
        window.print();
      } catch (err) {
        console.warn("Printing failed or blocked by iframe security:", err);
        setShowMobileAssist(true); // Fallback to assist on PC too if printing fails
      }
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        alert("Please select and copy the report manually from the page.");
      }
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  const handleDownloadText = async (shouldCopy?: boolean) => {
    const textContent = input.isStHelensMode ? `
================================================================================
          ST HELENS BOROUGH COUNCIL - INTEGRATED HEALTH & SOCIAL CARE
                 UNOFFICIAL FINANCIAL ASSESSMENT FORM (DRAFT)
================================================================================
This is a draft preparation statement for a formal Care Act means-tested visit.
Prepared: ${input.assessmentDate || new Date().toLocaleDateString()}
LAS Reference Number: ${input.customerRef || 'N/A'}
Visiting Officer: ${input.assessorName || 'N/A'}

================================================================================
1. YOUR PERSONAL DETAILS
================================================================================
Assessed Person : ${input.stHelens?.title || ''} ${input.stHelens?.firstName || ''} ${input.stHelens?.lastName || input.customerName || ''}
Address         : ${input.stHelens?.address || 'N/A'}
Date of Birth   : ${input.stHelens?.dob || 'N/A'}
N.I. Number     : ${input.nino || 'N/A'}
Home Telephone  : ${input.stHelens?.phone || 'N/A'}
Mobile Number   : ${input.stHelens?.mobile || 'N/A'}
Marital Status  : ${input.stHelens?.maritalStatus?.toUpperCase() || 'N/A'}
Applied Service : ${input.stHelens?.services?.toUpperCase() || 'N/A'} (Community / Respite / Permanent)

================================================================================
2. PEOPLE LIVING WITH YOU
================================================================================
${(input.stHelens?.peopleLivingWith && input.stHelens.peopleLivingWith.filter(p => p.name).length > 0)
  ? input.stHelens.peopleLivingWith.filter(p => p.name).map((p, idx) => `Occupant #${idx+1}:
  - Name: ${p.name || 'N/A'}
  - DoB: ${p.dob || 'N/A'}
  - Relationship: ${p.relationship || 'N/A'}
  - N.I. Number (if partner): ${p.nino || 'N/A'}`).join('\n\n')
  : 'None (Living Alone)'
}

================================================================================
3. INCOME & BENEFITS
================================================================================
CUSTOMER'S WEEKLY BENEFITS:
- State Retirement Pension: £${input.income.statePension.toFixed(2)}
- Pension Credit: £${input.income.pensionCredit.toFixed(2)}
- Attendance Allowance: £${input.income.attendanceAllowance.toFixed(2)}
- Personal Independence Payment (Daily Living): £${input.income.pipCare.toFixed(2)}
- Personal Independence Payment (Mobility): £${input.income.pipMobility.toFixed(2)} (Disregarded)
- Disability Living Allowance (Care): £${input.income.dlaCare.toFixed(2)}
- Disability Living Allowance (Mobility): £${input.income.dlaMobility.toFixed(2)} (Disregarded)
- Other Benefits: £${input.income.otherBenefits.toFixed(2)}

PARTNER'S WEEKLY BENEFITS & OTHER:
- ESA / Income Support / Universal Credit: (See booklet draft details)
- Is Carer's Allowance paid to anyone looking after you? : ${input.stHelens?.carersAllowancePaid ? 'YES (' + input.stHelens?.carersAllowancePaidTo + ')' : 'NO'}
- Housing Benefit active?: ${input.stHelens?.housingBenefitPaid ? 'YES (£' + input.stHelens?.housingBenefitAmount + ')' : 'NO'}
- Council Tax Support active?: ${input.stHelens?.councilTaxBenefitPaid ? 'YES (£' + input.stHelens?.councilTaxBenefitAmount + ')' : 'NO'}

PRIVATE & OCCUPATIONAL PENSIONS:
${(input.stHelens?.pensions && input.stHelens.pensions.length > 0)
  ? input.stHelens.pensions.map((p, idx) => `Pension #${idx+1}:
  - Provider: ${p.provider || 'N/A'}
  - Net Amount: £${p.netAmount.toFixed(2)} (${p.frequency})
  - Payee: ${p.payee || 'N/A'}
  - Proof Provided: ${p.evidence ? 'Yes' : 'No'}`).join('\n\n')
  : `None declared. Main value of £${input.income.occupationalPension.toFixed(2)}/wk entered in calculator.`
}
- Passing 50% to spouse/partner? (Residential Care only): ${input.stHelens?.passHalfOccupationalPension ? 'YES' : 'NO'}

EARNINGS FROM EMPLOYMENT (FULLY DISREGARDED UNDER CARE ACT 2014):
${(input.stHelens?.earnings && input.stHelens.earnings.length > 0)
  ? input.stHelens.earnings.map((e, idx) => `Earnings #${idx+1}:
  - Employer: ${e.employer || 'N/A'}
  - Net Pay: £${e.netAmount.toFixed(2)} (${e.frequency})
  - Payee: ${e.payee || 'N/A'}
  - Proof Provided: ${e.evidence ? 'Yes' : 'No'}`).join('\n\n')
  : `None declared. Main value of £${input.income.employmentEarnings.toFixed(2)}/wk entered.`
}

================================================================================
4. CAPITAL AND SAVINGS
================================================================================
Main Assessable Capital in Calculator: £${breakdown.totalCapital.toLocaleString()}
Tariff Income Applied from Savings    : £${breakdown.tariffIncome.toFixed(2)} /week (Standard England £14,250 to £23,250 bands)

DETAILED BANK ACCOUNTS & INVESTMENTS:
${(input.stHelens?.capitalAccounts && input.stHelens.capitalAccounts.length > 0)
  ? input.stHelens.capitalAccounts.map((a, idx) => `Account #${idx+1}:
  - Bank/Society: ${a.bank || 'N/A'}
  - Account No: ${a.accountNo || 'N/A'}
  - Balance/Value: £${a.amount.toLocaleString()}
  - Holder: ${a.holder || 'N/A'}
  - Evidence attached: ${a.evidence ? 'Yes' : 'No'}`).join('\n\n')
  : 'Summed under Cash & Bank Accounts in main calculator.'
}

- Have you gifted or transferred away any capital/savings?: ${input.stHelens?.giftedCapital ? 'YES' : 'NO'}
${input.stHelens?.giftedCapital ? `  Details of gift: ${input.stHelens?.giftedDetails || 'N/A'}` : ''}

================================================================================
5. WILL AND EXECUTOR DETAILS
================================================================================
Has Will been made? : ${input.stHelens?.willMade?.toUpperCase() || 'UNKNOWN'}
Where is WILL held? : ${input.stHelens?.willLocation || 'N/A'}

EXECUTORS DETAILS:
${(input.stHelens?.executors && input.stHelens.executors.length > 0)
  ? input.stHelens.executors.map((e, idx) => `Executor #${idx+1}:
  - Name: ${e.name || 'N/A'}
  - Address: ${e.address || 'N/A'}`).join('\n\n')
  : 'None entered.'
}

================================================================================
6. WHERE YOU LIVE & ACCOMMODATION
================================================================================
Property Type: ${input.stHelens?.propertyType?.toUpperCase() || 'N/A'} ${input.stHelens?.propertyTypeOther ? '(' + input.stHelens.propertyTypeOther + ')' : ''}
Council Tax: ${input.stHelens?.paysCouncilTax ? 'Liable for Annual Council Tax of £' + input.stHelens.annualCouncilTax.toLocaleString() : 'Not Liable'}

6.2 OWNER-OCCUPIER:
- Sole Owner: ${input.stHelens?.soleOwner?.toUpperCase() || 'N/A'}
- Joint Owner: ${input.stHelens?.jointOwner?.toUpperCase() || 'N/A'}
${input.stHelens?.jointOwner === 'yes' ? `  Details of other owners & share: ${input.stHelens?.otherOwnersShare || 'N/A'}` : ''}
- Mortgage secured on home: ${input.stHelens?.mortgageSecured?.toUpperCase() || 'N/A'}
- Title deeds held where: ${input.stHelens?.deedsLocation || 'N/A'}

6.3 RENTED ACCOMMODATION:
- Partner or relative owns it: ${input.stHelens?.partnerOrRelativeOwns?.toUpperCase() || 'N/A'}
${input.stHelens?.partnerOrRelativeOwns === 'yes' ? `  Relationship to you: ${input.stHelens?.relativeRelationship || 'N/A'}` : ''}
- Renting from private landlord: ${input.stHelens?.rentedPrivateLandlord?.toUpperCase() || 'N/A'}
- Renting from housing association: ${input.stHelens?.rentedHousingAssociation?.toUpperCase() || 'N/A'}
- Rent Amount: £${input.stHelens?.rentAmount || 0} (${input.stHelens?.rentFrequency || 'weekly'})
- Rent includes service charges: ${input.stHelens?.serviceChargesIncluded?.toUpperCase() || 'NO'}

6.4 OTHER LIVING ARRANGEMENTS:
- Details: ${input.stHelens?.otherLivingArrangements || 'None'}

================================================================================
7. DETAILS OF FORMER HOMES
================================================================================
Ever owned a home (if not now)?: ${input.stHelens?.everOwnedHome?.toUpperCase() || 'NO'}
${input.stHelens?.everOwnedHome === 'yes' ? `Address: ${input.stHelens?.formerHomeAddress || 'N/A'}
Sold/Transferred date: ${input.stHelens?.formerHomeDateSold || 'N/A'}` : ''}

================================================================================
8. DETAILS OF OTHER PROPERTY OR LAND
================================================================================
Own other land or property?: ${input.stHelens?.ownOtherProperty?.toUpperCase() || 'NO'}
${input.stHelens?.ownOtherProperty === 'yes' ? `Address: ${input.stHelens?.otherPropertyAddress || 'N/A'}
Is it occupied? : ${input.stHelens?.otherPropertyOccupied?.toUpperCase() || 'N/A'}
Rental income received? : ${input.stHelens?.otherPropertyRentalIncome?.toUpperCase() || 'N/A'} (£${input.stHelens?.otherPropertyRentAmount || 0}/${input.stHelens?.otherPropertyRentFrequency || 'weekly'})
Mortgage details: ${input.stHelens?.otherPropertyMortgage ? 'YES - Details: ' + input.stHelens?.otherPropertyMortgageDetails : 'NO'}` : ''}

================================================================================
9. DISABILITY RELATED EXPENDITURE (DRE)
================================================================================
These are extra weekly costs incurred because of your illness or disability.
(Note: Receipts/invoices are required as proof of payment by St Helens Council).

Itemized Weekly DRE Claims:
- Careline / Community Alarm: £${(input.stHelens?.dreItems?.careline || input.expenses.dreCommunityAlarm).toFixed(2)} /week
- Specialist Laundry: £${(input.stHelens?.dreItems?.washingLaundry || input.expenses.dreExtraLaundry).toFixed(2)} /week
- Chiropody: £${(input.stHelens?.dreItems?.chiropody || 0).toFixed(2)} /week
- Specialist Clothing/Footwear: £${(input.stHelens?.dreItems?.clothingFootwear || input.expenses.dreSpecialClothing).toFixed(2)} /week
- Additional Bedding (Incontinence): £${(input.stHelens?.dreItems?.bedding || 0).toFixed(2)} /week
- Extra metered water: £${(input.stHelens?.dreItems?.meteredWater || 0).toFixed(2)} /week
- Extra heating (above average): £${(input.stHelens?.dreItems?.extraHeating || input.expenses.dreExtraHeating).toFixed(2)} /week
- Cleaning / Domestic help: £${(input.stHelens?.dreItems?.cleaningDomestic || 0).toFixed(2)} /week
- Basic garden maintenance: £${(input.stHelens?.dreItems?.gardenMaintenance || 0).toFixed(2)} /week
- Hire/repair of equipment: £${(input.stHelens?.dreItems?.equipmentHireRepair || input.expenses.dreMobilityEquipment).toFixed(2)} /week
- Privately arranged care: £${(input.stHelens?.dreItems?.privateCare || 0).toFixed(2)} /week
- Additional Continence Products (non-NHS): £${(input.stHelens?.dreItems?.continence || 0).toFixed(2)} /week
- Other: £${(input.stHelens?.dreItems?.other1 || 0).toFixed(2)} /week (${input.stHelens?.dreItems?.other1Desc || 'N/A'})
- Other: £${(input.stHelens?.dreItems?.other2 || 0).toFixed(2)} /week (${input.stHelens?.dreItems?.other2Desc || 'N/A'})

Total Calculated DRE in assessment: £${breakdown.totalDre.toFixed(2)} /week

================================================================================
10. FINANCIAL REPRESENTATIVE
================================================================================
Managing Affairs: ${input.stHelens?.hasRep ? 'Assisted by Financial Representative' : 'Applicant manages own affairs'}
Representative Type: ${input.stHelens?.repType?.toUpperCase() || 'NONE'}

CONTACT DETAILS:
- Full Name: ${input.stHelens?.repName || 'N/A'}
- Relationship: ${input.stHelens?.repRelationship || 'N/A'}
- Address: ${input.stHelens?.repAddress || 'N/A'}
- Telephone: ${input.stHelens?.repPhone || 'N/A'}

================================================================================
11. DRAFT STATEMENT SUMMARY
================================================================================
Total Gross Weekly Income   : £${breakdown.totalGrossIncome.toFixed(2)}
Total Allowable Deductions  : £${breakdown.totalAllowableDeductions.toFixed(2)}
(Includes MIG of £${breakdown.totalMig.toFixed(2)}, housing costs £${breakdown.netHousingCosts.toFixed(2)}, DRE £${breakdown.totalDre.toFixed(2)})

Maximum Weekly Contribution : £${breakdown.maximumWeeklyCharge.toFixed(2)}
Weekly Cost of Care Package : £${breakdown.actualWeeklyCareCost.toFixed(2)}

--------------------------------------------------------------------------------
FINAL ASSESSMENT ESTIMATE:
- CUSTOMER WEEKLY CONTRIBUTION : £${breakdown.userWeeklyContribution.toFixed(2)}
- ST HELENS COUNCIL CONTRIBUTION: £${breakdown.councilWeeklyContribution.toFixed(2)}
================================================================================

DECLARATION SIGNATURES:
--------------------------------------------------------------------------------
I declare that to the best of my knowledge and belief, the details provided in this financial assessment draft represent a true and full statement of my capital, savings, assets, benefits, pensions, housing outgoings, and disability-related expenditures (DRE) for the financial year ${input.financialYear}.

Signed (Customer/Representative): ________________________   Date: ___________

Signed (Visiting Officer):       ________________________   Date: ___________

================================================================================
*This is a preparatory draft document generated for St Helens Council visiting officers.*
` : `
==================================================
   UK COUNCIL HOME CARE CONTRIBUTION STATEMENT
==================================================
Date of Assessment: ${new Date().toLocaleDateString()}
Region: ${input.region.toUpperCase()}
Age Category: ${input.ageCategory}
Relationship Status: ${input.relationshipStatus}
Disability Premium Status: ${input.disabilityPremium}
Carer Premium: ${input.hasCarerPremium ? 'Yes' : 'No'}


--------------------------------------------------
1. CARE PACKAGE COSTS
--------------------------------------------------
Care hours/week: ${input.carePackage.useCustomWeeklyCost ? 'N/A' : input.carePackage.hoursPerWeek + ' hours'}
Hourly rate: ${input.carePackage.useCustomWeeklyCost ? 'N/A' : '£' + input.carePackage.hourlyRate.toFixed(2)}
Total weekly care cost: £${breakdown.actualWeeklyCareCost.toFixed(2)}

--------------------------------------------------
2. CAPITAL AND SAVINGS
--------------------------------------------------
Bank Accounts & Cash: £${input.capital.bankAccounts.toLocaleString()}
Investments / Shares: £${input.capital.investments.toLocaleString()}
Other Property: £${input.capital.otherProperty.toLocaleString()}
Total Assessable Capital: £${breakdown.totalCapital.toLocaleString()}
Tariff Income Applied: £${breakdown.tariffIncome.toFixed(2)} /week
Self-Funder status: ${breakdown.isSelfFunder ? 'YES' : 'NO'}

--------------------------------------------------
3. WEEKLY INCOME
--------------------------------------------------
State Pension: £${input.income.statePension.toFixed(2)}
Pension Credit: £${input.income.pensionCredit.toFixed(2)}
Attendance Allowance: £${input.income.attendanceAllowance.toFixed(2)}
PIP Daily Living: £${input.income.pipCare.toFixed(2)}
DLA Care Component: £${input.income.dlaCare.toFixed(2)}
Occupational / Private Pension: £${input.income.occupationalPension.toFixed(2)}
Employment Earnings (Disregarded): £${input.income.employmentEarnings.toFixed(2)}
Other Income / Benefits: £${(input.income.otherBenefits + input.income.otherIncome).toFixed(2)}

Total Gross Income: £${breakdown.totalGrossIncome.toFixed(2)}
Total Disregarded Income: £${breakdown.totalDisregardedIncome.toFixed(2)}
Total Assessable Income: £${breakdown.totalAssessableIncomeSources.toFixed(2)}

--------------------------------------------------
4. ALLOWABLE DEDUCTIONS & EXPENSES
--------------------------------------------------
Minimum Income Guarantee (MIG): £${breakdown.totalMig.toFixed(2)}
Net Housing Costs (after support): £${breakdown.netHousingCosts.toFixed(2)}
Total Disability Related Expenditure (DRE): £${breakdown.totalDre.toFixed(2)}
Total Deductions allowed: £${breakdown.totalAllowableDeductions.toFixed(2)}

--------------------------------------------------
5. ASSESSMENT BREAKDOWN SUMMARY
--------------------------------------------------
Net Weekly Income Above Deductions: £${breakdown.netWeeklyIncome.toFixed(2)}
Maximum Weekly Care Charge: £${breakdown.maximumWeeklyCharge.toFixed(2)}

==================================================
ESTIMATED WEEKLY CONTRIBUTION SUMMARY:
--------------------------------------------------
YOUR WEEKLY CONTRIBUTION: £${breakdown.userWeeklyContribution.toFixed(2)}
COUNCIL WEEKLY CONTRIBUTION: £${breakdown.councilWeeklyContribution.toFixed(2)}
==================================================

*Disclaimer: This is an estimated advice statement. Actual funding depends on a formal means test and care needs assessment performed by your local council.*
`;

    if (shouldCopy === true) {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(textContent)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch((err) => {
            console.error("Copying to clipboard failed:", err);
            fallbackCopyToClipboard(textContent);
          });
      } else {
        fallbackCopyToClipboard(textContent);
      }
      return;
    }

    const isMobile = typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const fileName = input.isStHelensMode
      ? `St_Helens_Care_Contribution_Report_${new Date().toISOString().split('T')[0]}.txt`
      : `Home_Care_Contribution_Report_${new Date().toISOString().split('T')[0]}.txt`;

    // Mobile: Prefer Native Sharing (allows directly sharing the text file to Whatsapp, Drive, Gmail, or native PDF printer)
    if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
      try {
        const file = new File([textContent], fileName, { type: 'text/plain;charset=utf-8' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: input.isStHelensMode ? 'St Helens Care Contribution Report' : 'Home Care Contribution Report',
          });
          return;
        }
      } catch (err) {
        console.warn("Native file sharing failed, falling back to text share:", err);
      }

      try {
        await navigator.share({
          title: input.isStHelensMode ? 'St Helens Care Contribution Report' : 'Home Care Contribution Report',
          text: textContent,
        });
        return;
      } catch (err) {
        console.warn("Native text sharing failed, falling back to blob download:", err);
      }
    }

    try {
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Standard blob download failed, displaying mobile assistance panel instead:", err);
      setShowMobileAssist(true);
    }
  };

  const handleCopyToClipboard = () => {
    handleDownloadText(true);
  };

  return (
    <div className="space-y-6" id="detailed-report-view">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 border border-slate-200 rounded-2xl print:hidden">
        <button
          type="button"
          onClick={onBack}
          id="report-back-btn"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Calculator Edit
        </button>
        <div className="flex flex-wrap gap-2 justify-end">
          <button
            type="button"
            id="report-copy-btn"
            onClick={handleCopyToClipboard}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
          <button
            type="button"
            id="report-download-btn"
            onClick={handleDownloadText}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download TXT
          </button>
          <button
            type="button"
            id="report-print-btn"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="h-4 w-4" />
            Print Full Report
          </button>
        </div>
      </div>

      {/* Embedded Iframe Info Hint */}
      {(isIframe || showIframePrintHelp) && (
        <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-amber-900 print:hidden shadow-xs">
          <div className="flex gap-2.5 items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-amber-950 uppercase tracking-wide text-[10px]">Embedded Frame Print Tip</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed font-sans">
                Your browser blocks printing inside secure embedded preview frames. For best results on PC, click <strong>"Open in a new tab"</strong> at the top right of your screen to print normally, or use the <strong>"Copy to Clipboard"</strong> button to paste the report instantly into any text editor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Print Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm print:border-0 print:shadow-none print:p-0">
        
        {/* Report Brand Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4 ${input.isStHelensMode ? 'border-rose-100' : 'border-slate-100'}`}>
          <div>
            {input.isStHelensMode ? (
              <>
                <div className="flex items-center gap-1.5 text-rose-700 font-extrabold text-[10px] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded border border-rose-100 w-fit">
                  <span>🏛️ St Helens Council Draft Statement</span>
                </div>
                <h1 className="text-xl font-black text-rose-950 mt-1.5 tracking-tight uppercase">St Helens Borough Council</h1>
                <p className="text-xs text-slate-500 font-medium">Adult Social Care Services • Financial Assessment Draft Report</p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-sm uppercase tracking-wider">
                  <Heart className="h-4 w-4" />
                  <span>Independent Assessment</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mt-1">Financial Assessment Report</h1>
                <p className="text-xs text-slate-400 mt-0.5">Council Care at Home Contribution Assessment Estimate</p>
              </>
            )}
          </div>
          <div className="text-left sm:text-right font-mono text-xs text-slate-500 space-y-1">
            <div>Date: {input.isStHelensMode ? input.assessmentDate : new Date().toLocaleDateString()}</div>
            <div>Region: <span className="font-bold text-slate-800">{input.region.toUpperCase()}</span></div>
            <div>Status: <span className="font-bold text-slate-800">{input.relationshipStatus.toUpperCase()}</span></div>
          </div>
        </div>

        {/* St Helens Unofficial Metadata Box */}
        {input.isStHelensMode && (
          <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-700">
            <div>
              <span className="text-[10px] text-rose-800 font-sans font-extrabold uppercase block mb-0.5">Assessed Customer</span>
              <span className="font-bold text-rose-950">{input.customerName || 'Margaret Davies'}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-800 font-sans font-extrabold uppercase block mb-0.5">LAS ID / Reference</span>
              <span className="font-bold text-rose-950">{input.customerRef || 'STH-4491-X'}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-800 font-sans font-extrabold uppercase block mb-0.5">National Insurance</span>
              <span className="font-bold text-rose-950">{input.nino || 'QQ 12 34 56 C'}</span>
            </div>
            <div>
              <span className="text-[10px] text-rose-800 font-sans font-extrabold uppercase block mb-0.5">Visiting Officer</span>
              <span className="font-bold text-rose-950">{input.assessorName || 'Officer Gribble'}</span>
            </div>
          </div>
        )}

        {/* Highlight Result Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Personal Cost</span>
            <span className="text-3xl font-black text-indigo-300 mt-1">£{breakdown.userWeeklyContribution.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">estimated personal contribution</span>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Weekly Council Funded</span>
            <span className="text-3xl font-black text-emerald-400 mt-1">£{breakdown.councilWeeklyContribution.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">estimated local authority funding</span>
          </div>
          <div className="flex flex-col justify-center items-center py-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Value of Care</span>
            <span className="text-3xl font-black text-white mt-1">£{breakdown.actualWeeklyCareCost.toFixed(2)}</span>
            <span className="text-[10px] text-slate-500 mt-0.5">hours * hourly charge rate</span>
          </div>
        </div>

        {/* Section 1: Demographics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            1. Applicant Demographics & Variables
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-xs font-medium">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">UK Region</span>
              <span className="text-slate-800 font-bold capitalize">{input.region}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Age Category</span>
              <span className="text-slate-800 font-bold">
                {input.ageCategory === 'pension-age' ? 'Pension Age +' : input.ageCategory === 'under-25' ? 'Aged 18-24' : 'Aged 25 to Pension'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Disability Premium</span>
              <span className="text-slate-800 font-bold capitalize">{input.disabilityPremium}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Carer Status</span>
              <span className="text-slate-800 font-bold">{input.hasCarerPremium ? 'Receives Carer Premium' : 'No Carer Premium'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Capital and Means Test */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            2. Capital means test (excluding main home)
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Cash, Savings, Bank and ISA Accounts:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.bankAccounts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Stocks, Shares and Private Investments:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.investments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Other Properties, Land or Assets:</span>
              <span className="font-bold text-slate-800 font-mono">£{input.capital.otherProperty.toLocaleString()}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold text-sm">
              <span>Total Assessed Assets:</span>
              <span className="font-mono text-indigo-900">£{breakdown.totalCapital.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 pt-1">
              <span>Tariff Income calculated from excess savings:</span>
              <span className="font-mono font-semibold text-indigo-700">£{breakdown.tariffIncome.toFixed(2)} /week</span>
            </div>
          </div>
        </div>

        {/* Section 3: Income details */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            3. Weekly income assessment details
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>State Retirement Pension:</span>
              <span className="font-mono">£{input.income.statePension.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Pension Credit (Guarantee or Savings):</span>
              <span className="font-mono">£{input.income.pensionCredit.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Attendance Allowance / PIP / DLA Care:</span>
              <span className="font-mono">
                £{(input.income.attendanceAllowance + input.income.pipCare + input.income.dlaCare).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Occupational & Private Pensions:</span>
              <span className="font-mono">£{input.income.occupationalPension.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Earnings from employment (100% Ignored):</span>
              <span className="font-mono line-through">£{input.income.employmentEarnings.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Other eligible benefits & other income:</span>
              <span className="font-mono">£{(input.income.otherBenefits + input.income.otherIncome).toFixed(2)}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold">
              <span>Total Assessable Weekly Income Sources:</span>
              <span className="font-mono">£{breakdown.totalAssessableIncomeSources.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Allowable Expenses & Deductions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">
            4. Allowable Expenses & Income Protections
          </h3>
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Minimum Income Guarantee (MIG) baseline:</span>
              <span className="font-mono">£{breakdown.baseMig.toFixed(2)}</span>
            </div>
            {(breakdown.disabilityPremiumAmount > 0 || breakdown.carerPremiumAmount > 0) && (
              <div className="flex justify-between items-center text-slate-600">
                <span>Disability & Carer MIG Premium additions:</span>
                <span className="font-mono">
                  + £{(breakdown.disabilityPremiumAmount + breakdown.carerPremiumAmount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-slate-600">
              <span>Net Allowable Housing Costs (Rent, Mortgage, Council Tax paid):</span>
              <span className="font-mono">£{breakdown.netHousingCosts.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-emerald-700 font-semibold">
              <span>Disability Related Expenditure (DRE) total:</span>
              <span className="font-mono">£{breakdown.totalDre.toFixed(2)}</span>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between items-center text-slate-800 font-extrabold">
              <span>Total Weekly Deductions Allowed:</span>
              <span className="font-mono text-emerald-800">£{breakdown.totalAllowableDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Section 5: Math Formula */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 font-mono">
          <h4 className="font-bold text-slate-800">Assessed Contribution Calculations:</h4>
          <div className="flex justify-between">
            <span>Assessable Weekly Income (Sources + Tariff):</span>
            <span>£{(breakdown.totalAssessableIncomeSources + breakdown.tariffIncome).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-600">
            <span>– Total Allowable Deductions:</span>
            <span>– £{breakdown.totalAllowableDeductions.toFixed(2)}</span>
          </div>
          <div className="h-px bg-slate-300" />
          <div className="flex justify-between text-slate-900 font-bold">
            <span>Net weekly excess income (Max contribution limit):</span>
            <span>£{breakdown.netWeeklyIncome.toFixed(2)}</span>
          </div>
        </div>

        {/* Section 6: Personal Budget, Housekeeping & Net Surplus */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2 flex justify-between items-center">
            <span>6. Personal Budget & Cash Flow Analysis</span>
            <span className="text-[10px] text-blue-900 font-mono font-bold uppercase tracking-wide normal-case bg-blue-50 px-2 py-0.5 rounded print:hidden">
              On-Screen Budget Tool
            </span>
          </h3>

          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-4 text-xs">
            <p className="text-[11px] text-slate-500 leading-normal">
              This section reconciles your real-world cash flows. Unlike statutory limits, it calculates your remaining cash surplus after paying the Council Care Bill, housing costs, disability-related expenses (DRE), and a specified housekeeping allowance.
            </p>

            {/* Formula Selector & Interactive Input (Hidden on Print) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
              {/* Formula */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <span className="font-semibold text-slate-600 flex items-center gap-1">
                  <Sliders className="h-3.5 w-3.5 text-blue-500" />
                  Monthly Formula:
                </span>
                <div className="flex bg-slate-100 p-0.5 rounded-md text-[9px] font-bold">
                  <button
                    type="button"
                    onClick={() => setUseAstronomical(true)}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      useAstronomical
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Astronomical (4.348)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseAstronomical(false)}
                    className={`px-2 py-1 rounded transition-all cursor-pointer ${
                      !useAstronomical
                        ? 'bg-blue-900 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Standard (4.333)
                  </button>
                </div>
              </div>

              {/* Input */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center justify-between">
                <span className="font-semibold text-slate-600">Weekly Housekeeping:</span>
                <div className="relative rounded-md shadow-xs w-32">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                    <span className="text-slate-400 font-mono">£</span>
                  </div>
                  <input
                    type="number"
                    value={housekeeping === 0 ? '' : housekeeping}
                    onChange={(e) => setHousekeeping(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="block w-full rounded-md border border-slate-200 py-1 pl-5 pr-7 text-right text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono font-bold"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <span className="text-[9px] text-slate-400 font-mono">/wk</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Static Display of selected values for Print Only */}
            <div className="hidden print:grid grid-cols-2 gap-4 pb-1 border-b border-slate-100 text-[11px] font-mono text-slate-500">
              <div>Monthly Conversion Factor: <span className="font-bold text-slate-800">{useAstronomical ? '4.34833 weeks/mo' : '4.33333 weeks/mo'}</span></div>
              <div className="text-right">Budgeted Weekly Housekeeping: <span className="font-bold text-slate-800">£{housekeeping.toFixed(2)}</span></div>
            </div>

            {/* Calculations Grid */}
            {(() => {
              const multiplier = useAstronomical ? 4.348333333 : (52 / 12);
              
              // Cash values
              const weeklyIn = breakdown.totalGrossIncome;
              const monthlyIn = weeklyIn * multiplier;

              const weeklyCare = breakdown.userWeeklyContribution;
              const monthlyCare = weeklyCare * multiplier;

              const weeklyHousing = breakdown.netHousingCosts;
              const monthlyHousing = weeklyHousing * multiplier;

              const weeklyDre = breakdown.totalDre;
              const monthlyDre = weeklyDre * multiplier;

              const weeklyHousekeeping = housekeeping;
              const monthlyHousekeeping = housekeeping * multiplier;

              // Remaining Surplus
              const weeklyDisposable = weeklyIn - weeklyCare - weeklyHousing - weeklyDre;
              const monthlyDisposable = weeklyDisposable * multiplier;

              const finalWeeklySurplus = weeklyDisposable - weeklyHousekeeping;
              const finalMonthlySurplus = finalWeeklySurplus * multiplier;

              return (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-12 gap-2 font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 text-[9px]">
                    <span className="col-span-6">Budget Item</span>
                    <span className="col-span-3 text-right">Weekly Cash Flow</span>
                    <span className="col-span-3 text-right">Monthly Cash Flow</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-slate-600 text-xs">
                    <span className="col-span-6">1. Total Actual Inflow (Benefits & Pensions):</span>
                    <span className="col-span-3 text-right font-mono">£{weeklyIn.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono text-slate-800 font-bold">£{monthlyIn.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">2. Less Estimated Council Care Bill:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyCare.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyCare.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">3. Less Net Rent, Mortgage & Council Tax:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyHousing.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyHousing.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">4. Less Actual Disability-Related Spend (DRE):</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyDre.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyDre.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className="grid grid-cols-12 gap-2 items-center text-slate-800 font-extrabold bg-blue-50/50 p-2 rounded text-xs">
                    <span className="col-span-6">5. Net Cash Remaining (Disposable Income):</span>
                    <span className="col-span-3 text-right font-mono">£{weeklyDisposable.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono text-blue-900 font-black">£{monthlyDisposable.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 items-center text-red-600/80 text-xs">
                    <span className="col-span-6">6. Less Budgeted Housekeeping Allowance:</span>
                    <span className="col-span-3 text-right font-mono">–£{weeklyHousekeeping.toFixed(2)}</span>
                    <span className="col-span-3 text-right font-mono">–£{monthlyHousekeeping.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-slate-200" />

                  <div className={`p-3 rounded-xl border grid grid-cols-12 gap-2 items-center text-xs ${
                    finalWeeklySurplus >= 0
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                      : 'bg-rose-50 border-rose-200 text-rose-950 font-bold'
                  }`}>
                    <span className="col-span-6">
                      {finalWeeklySurplus >= 0 ? 'Anticipated Net Cash Surplus (Pocket Money):' : 'Anticipated Budget Shortfall:'}
                    </span>
                    <span className="col-span-3 text-right font-mono">£{finalWeeklySurplus.toFixed(2)} /wk</span>
                    <span className={`col-span-3 text-right font-mono text-sm font-extrabold ${finalWeeklySurplus >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
                      £{finalMonthlySurplus.toFixed(2)} /mo
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Disclaimer / Notice footer */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          {input.isStHelensMode && (
            <div className="bg-rose-50/40 border border-rose-100 p-5 rounded-2xl space-y-4 text-xs text-slate-700">
              <h4 className="font-extrabold uppercase text-rose-950 text-[10px] tracking-widest">
                ✍️ Unofficial Care Assessment Declaration & Agreement (St Helens Council Draft)
              </h4>
              <p className="leading-relaxed">
                I declare that to the best of my knowledge and belief, the details provided in this financial assessment draft represent a true and full statement of my capital, savings, assets, weekly benefit and pension income, housing outgoings, and disability-related expenditures (DRE) for the financial year {input.financialYear}. I understand this draft serves as preparation for the visiting officer.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wide">
                    <span>Signature of Person Assessed / Representative</span>
                    <span>Date</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-10 border-b border-dashed border-slate-300" />
                  <div className="flex justify-between text-[10px] uppercase font-bold text-slate-400 font-sans tracking-wide">
                    <span>Visiting Officer / Assessor Signature</span>
                    <span>Date</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Advisory Disclaimer
          </h4>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {input.isStHelensMode ? (
              <span>St Helens Council will verify all evidence, receipts, and bank statements during their formal means-test visit. This care document generator provides a high-fidelity preparatory draft to help you compile your documents and anticipate charges. It does not bind St Helens Council or replace the official Care Act 2014 assessment process.</span>
            ) : (
              <span>This statement is an independent estimation tool based on government guidelines (Care Act charging regulations). It is designed to assist you in preparing for a council financial assessment. It does not guarantee funding or constitute legal binding advice. Councils may interpret specific incomes and Disability Related Expenditure (DRE) depending on local guidelines.</span>
            )}
          </p>
        </div>
      </div>

      {/* Mobile Print / Share Assist Modal */}
      {showMobileAssist && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in print:hidden" id="mobile-assist-modal-overlay">
          <div 
            className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-md w-full overflow-hidden flex flex-col animate-scale-up"
            id="mobile-assist-modal-container"
          >
            {/* Header */}
            <div className={`p-5 text-white flex justify-between items-center ${input.isStHelensMode ? 'bg-rose-950' : 'bg-indigo-950'}`} id="mobile-assist-header">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-indigo-300 animate-pulse" />
                <div>
                  <h3 className="font-extrabold text-xs uppercase tracking-wider">Mobile Assist Companion</h3>
                  <p className="text-[10px] text-indigo-200">Pixel 10 Pro XL & Android Support</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileAssist(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                id="mobile-assist-close-top"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 flex-1" id="mobile-assist-content">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3 text-xs text-blue-900 leading-relaxed">
                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-950">Why did this happen?</p>
                  <p className="mt-1">
                    Android WebViews and signed wrapper apps often block raw desktop print commands and direct file-system downloads (Blob links).
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-sans leading-relaxed">
                We have prepared native, 100% reliable system routes for your Pixel device. Choose one of the options below:
              </p>

              {/* Action list */}
              <div className="space-y-3" id="mobile-assist-actions">
                {/* 1. Share File */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileAssist(false);
                    handleDownloadText(false);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  id="mobile-assist-share-btn"
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                      <Share2 className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Share Statement File</p>
                      <p className="text-[10px] text-slate-400">Send TXT to Drive, Gmail, or print as PDF</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </button>

                {/* 2. Copy Full Text */}
                <button
                  type="button"
                  onClick={() => {
                    handleDownloadText(true);
                  }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  id="mobile-assist-copy-btn"
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5 text-emerald-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">Copy Full Text Report</p>
                      <p className="text-[10px] text-slate-400">Paste directly into Word, Docs, or email</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold ${copied ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {copied ? 'Copied!' : 'Copy'}
                  </span>
                </button>
              </div>

              {/* Android printing guide */}
              <div className="pt-2">
                <p className="font-bold text-[10px] text-slate-400 uppercase tracking-wider mb-2">💡 Quick Android PDF & Print Hack</p>
                <ol className="text-[11px] text-slate-500 list-decimal pl-4 space-y-1 font-sans">
                  <li>Tap the <strong>Share Statement File</strong> button above.</li>
                  <li>In the sharing list, select your preferred email application or save to your Google Drive folder.</li>
                  <li>Open the file from your computer or phone to print it normally. Alternatively, choose the system "Print" button if available in the share menu!</li>
                </ol>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end" id="mobile-assist-footer">
              <button
                type="button"
                onClick={() => setShowMobileAssist(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                id="mobile-assist-dismiss-btn"
              >
                Close Assistant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
