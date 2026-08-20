import type { Article } from "../types";

export const loanArticles = [
  {
    title: "Home Loan Guide for Beginners",
    slug: "home-loan-guide",
    description: "What EMI, tenure, interest and lender terms mean when you compare a home loan.",
    category: "loans",
    publishedAt: "2026-08-15",
    updatedAt: "2026-08-17",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "home-loan",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["home-loan-emi-calculation", "home-loan-tenure-comparison", "home-loan-prepayment"],
    sections: [
      {
        id: "read-cost-together",
        heading: "Read the EMI and lifetime cost together",
        paragraphs: [
          "A lower EMI can make a home loan feel easier to manage, but it does not necessarily make the loan cheaper. Before choosing a tenure or comparing offers, read the monthly payment alongside total interest and total repayment.",
          "Those figures come from the amount borrowed, interest rate and tenure. Lender charges and later changes to the loan terms can affect what you actually pay, so the EMI is a starting point rather than the whole comparison.",
        ],
      },
      {
        id: "numbers-to-read",
        heading: "The numbers to read together",
        list: [
          "Principal: the amount you borrow and need to repay.",
          "Interest rate: the rate used to calculate interest on the outstanding balance.",
          "Tenure: the period over which the scheduled repayments run.",
          "EMI: the regular monthly payment containing both principal and interest.",
          "Total interest and repayment: the interest added over the tenure and the full amount repaid through the scheduled EMIs.",
        ],
      },
      {
        id: "reducing-balance",
        heading: "How a reducing-balance EMI changes",
        paragraphs: [
          "In a monthly reducing-balance loan, interest is calculated on the principal still outstanding. Part of each EMI pays that interest and the rest reduces principal, leaving a lower balance for the next month.",
          [
            { text: "Early EMIs therefore contain more interest, while later EMIs usually direct more money to principal when the rate and payment stay unchanged. See " },
            { text: "how a home-loan EMI is calculated", link: { kind: "article", slug: "home-loan-emi-calculation" } },
            { text: " for the formula and an amortization example." },
          ],
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹40 lakh for 20 years",
        paragraphs: [
          "Consider a ₹40,00,000 loan at 8.5% a year for 20 years, calculated on a monthly reducing balance. With a constant rate, regular monthly payments and no fees or prepayments, the rounded figures are:",
        ],
        table: {
          caption: "Illustrative ₹40 lakh home loan at 8.5% for 20 years",
          headers: ["Monthly EMI", "Total interest", "Total repayment"],
          rows: [["₹34,713", "₹43,31,103", "₹83,31,103"]],
        },
      },
      {
        id: "tenure-and-terms",
        heading: "A longer tenure changes more than the EMI",
        paragraphs: [
          "Spreading the same loan over more months usually lowers the EMI. But the balance remains outstanding for longer, so total interest can rise. The lower monthly payment and the higher lifetime cost need to be considered together.",
          [
            { text: "The worked example above shows why affordability cannot be judged from ₹34,713 alone: interest adds ₹43,31,103 over the full tenure under these assumptions. The " },
            { text: "home-loan tenure comparison", link: { kind: "article", slug: "home-loan-tenure-comparison" } },
            { text: " shows this trade-off across several tenures without changing the loan amount or rate." },
          ],
          "A floating rate can also change the EMI, tenure or both after the loan starts. Check how the lender handles rate changes instead of assuming the opening schedule will remain fixed.",
        ],
      },
      {
        id: "offer-checklist",
        heading: "What to check before accepting an offer",
        paragraphs: [
          [
            { text: "If you may repay extra later, read the lender’s prepayment terms and how a part-payment would change the schedule. The " },
            { text: "home-loan prepayment guide", link: { kind: "article", slug: "home-loan-prepayment" } },
            { text: " explains the questions to ask without assuming every lender treats prepayment the same way." },
          ],
        ],
        list: [
          "Rate type and how a rate reset may affect the EMI or tenure.",
          "EMI, tenure, total interest and total repayment for the same loan amount.",
          "Processing, legal, valuation, insurance and other applicable charges.",
          "Prepayment and foreclosure terms, including any conditions or charges.",
          "Figures and conditions in the sanction letter, loan agreement and repayment schedule.",
        ],
      },
      {
        id: "compare-your-scenario",
        heading: "Compare one actual loan scenario",
        paragraphs: [
          "Use the amount, rate and tenure from an offer you are considering. Start with the EMI, then read the total interest and total repayment. Change the rate or tenure one at a time to see what moves.",
        ],
        callout: {
          title: "Check the EMI and full-tenure cost",
          text: [
            { text: "Enter the offer’s figures in the " },
            { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } },
            { text: "." },
          ],
        },
      },
    ],
    faq: [
      { question: "What should I check before planning a home-loan prepayment?", answer: "Check how the lender will apply the amount, whether the EMI or tenure will change, when the revised schedule starts and whether any conditions or charges apply. Ask for the updated repayment schedule after the payment is posted." },
    ],
  },
  {
    title: "How Home Loan EMI Is Calculated: Principal, Interest and Reducing Balance",
    slug: "home-loan-emi-calculation",
    description: "How the home-loan EMI formula works, why the principal and interest split changes each month, and what an amortization schedule shows.",
    category: "loans",
    publishedAt: "2026-08-16",
    updatedAt: "2026-08-16",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "home-loan",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["home-loan-guide", "home-loan-tenure-comparison"],
    sections: [
      { id: "what-an-emi-contains", heading: "What a home-loan EMI contains", paragraphs: ["A home-loan EMI has two parts: interest for the period and repayment of principal. The EMI may stay constant when the rate and tenure stay constant, but the split between those two parts changes each month.", "Under a monthly reducing-balance loan, the month’s interest is calculated on the outstanding principal. The rest of the EMI reduces that principal, so the next month starts with a slightly lower balance."] },
      { id: "emi-formula", heading: "The EMI formula", paragraphs: ["For a standard monthly amortizing loan, EMI = [P × r × (1 + r)^n] ÷ [(1 + r)^n − 1].", "Here, P is the loan principal, r is the monthly interest rate, and n is the total number of monthly instalments. The formula sets one regular payment that repays the principal and calculated interest over the selected tenure, subject to the stated assumptions."] },
      { id: "monthly-rate-and-instalments", heading: "Monthly rate and number of instalments", paragraphs: ["If the annual interest rate is R per cent, the monthly rate used by this model is r = R ÷ 12 ÷ 100. A 20-year tenure has 240 monthly instalments, so n is 240.", "The monthly rate is a decimal in the formula. For example, 8.5% a year becomes 0.085 ÷ 12, or about 0.0070833 per month."] },
      { id: "reducing-balance", heading: "What monthly reducing balance means", paragraphs: ["Interest is not repeatedly calculated on the original loan amount. It is calculated on the principal still outstanding for that month. After the principal component of an EMI is deducted, the lower balance is used for the next month’s interest.", "This is why the interest component normally falls and the principal component normally rises over the schedule when the EMI and rate do not change."] },
      { id: "worked-example", heading: "Worked example: the first three EMIs", paragraphs: ["Consider a ₹10,00,000 loan at 8.5% a year for 20 years. Using the same monthly reducing-balance convention as the ArthaSiddhi Home Loan EMI Calculator, the EMI is ₹8,678 when rounded to the nearest rupee. Each value in the table is rounded separately, so the displayed principal and interest may differ from the displayed EMI by ₹1."], table: { caption: "First three months of the illustrative ₹10 lakh loan", headers: ["Month", "EMI", "Interest", "Principal", "Balance after EMI"], rows: [["1", "₹8,678", "₹7,083", "₹1,595", "₹9,98,405"], ["2", "₹8,678", "₹7,072", "₹1,606", "₹9,96,799"], ["3", "₹8,678", "₹7,061", "₹1,618", "₹9,95,181"]] } },
      { id: "early-emis", heading: "Why early EMIs contain more interest", paragraphs: ["At the start, almost the full principal is outstanding. Applying the monthly rate to that larger balance produces a larger interest amount, leaving less of the EMI for principal.", "Later in the loan, the outstanding principal is lower. Monthly interest is then lower too, so more of the same EMI can reduce principal."] },
      { id: "amortization-schedule", heading: "What the amortization schedule shows", paragraphs: ["An amortization schedule lists each EMI, its principal and interest components, and the outstanding balance after payment. It lets you see the shift in the EMI split rather than treating the EMI as one unexplained number.", "A floating-rate reset, a missed payment, a prepayment, lender rounding or a different interest-accrual convention can change the actual schedule."] },
      { id: "costs-outside-emi", heading: "What the EMI formula does not include", paragraphs: ["The formula above covers principal and interest under its assumptions. It does not automatically include processing fees, legal or valuation charges, insurance, switching charges, penalties or every other borrowing cost.", "For applicable retail term loans, the lender’s Key Facts Statement should show key terms and the annual percentage rate, which reflects the all-in cost covered by the KFS rules. Check the KFS, sanction letter and loan agreement for the actual costs attached to an offer."], callout: { title: "Calculate the full schedule", text: [{ text: "Enter your loan amount, rate and tenure in the " }, { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } }, { text: " to see the EMI, total interest and month-by-month schedule." }] } },
    ],
    faq: [
      { question: "Why does the interest part fall even when the EMI stays the same?", answer: "Each principal payment reduces the outstanding balance. Under a monthly reducing-balance model, the next month’s interest is calculated on that lower balance." },
      { question: "Will a lender’s schedule always match a calculator exactly?", answer: "Not always. Payment dates, rate resets, daily or monthly accrual, rounding and lender-specific terms can create differences. Use the lender’s repayment schedule for the contractual figures." },
    ],
    references: [
      { title: "Housing Loans — FAQs", publisher: "Reserve Bank of India", url: "https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701", sourceType: "official", accessedAt: "2026-08-16" },
      { title: "Key Facts Statement (KFS) for Loans & Advances", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0", sourceType: "official", accessedAt: "2026-08-16" },
    ],
  },
  {
    title: "Home Loan Tenure: 15 vs 20 vs 25 vs 30 Years",
    slug: "home-loan-tenure-comparison",
    description: "A ₹50 lakh home-loan comparison showing how 15, 20, 25 and 30-year tenures change the EMI and total interest at the same rate.",
    category: "loans",
    publishedAt: "2026-08-16",
    updatedAt: "2026-08-16",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "home-loan",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["home-loan-guide", "home-loan-emi-calculation", "home-loan-prepayment"],
    sections: [
      { id: "comparison", heading: "The 15, 20, 25 and 30-year comparison", paragraphs: ["This example keeps the loan amount and rate unchanged: ₹50,00,000 at 8.5% a year on a monthly reducing balance. It assumes a constant rate, regular monthly EMIs, no prepayment, no missed payments and no fees or charges."], table: { caption: "₹50 lakh home loan at 8.5% a year", headers: ["Tenure", "Monthly EMI", "Total interest"], rows: [["15 years", "₹49,237", "₹38,62,656 (₹38.63 lakh)"], ["20 years", "₹43,391", "₹54,13,879 (₹54.14 lakh)"], ["25 years", "₹40,261", "₹70,78,406 (₹70.78 lakh)"], ["30 years", "₹38,446", "₹88,40,443 (₹88.40 lakh)"]] } },
      { id: "why-emi-falls", heading: "Why a longer tenure lowers the EMI", paragraphs: ["The same principal is spread over more monthly instalments. That reduces the amount due each month, although interest continues to be charged while the balance remains outstanding.", "The EMI reduction becomes progressively smaller in this example. Moving from 15 to 20 years lowers the displayed EMI by ₹5,846, while moving from 25 to 30 years lowers it by ₹1,815."] },
      { id: "why-interest-rises", heading: "Why total interest rises", paragraphs: ["A longer tenure keeps principal outstanding for more months. Even though each EMI is lower, interest is calculated over a longer period, so the total can rise substantially.", "The 30-year option in this example has a displayed EMI ₹4,945 lower than the 20-year option. Its total interest is ₹34,26,564 higher, or about ₹34.27 lakh. The monthly reduction and the lifetime increase need to be read together."] },
      { id: "rate-reset", heading: "A floating rate can change the comparison", paragraphs: ["The table assumes 8.5% throughout. A floating-rate home loan may reset during its tenure, changing the EMI, the number of instalments, or both.", "For applicable EMI-based floating-rate loans, RBI instructions require the regulated entity to communicate the impact of a reset and provide the applicable options. These can include a higher EMI, longer tenure, a combination, switching to a fixed rate under the lender’s policy, and part or full prepayment. Do not assume the lender will apply the same outcome in every case."] },
      { id: "choosing-tenure", heading: "There is no single correct tenure", paragraphs: ["A shorter tenure needs a higher monthly payment but reduces the time over which interest accrues. A longer tenure lowers the required EMI but can leave less room for future rate increases and can materially raise total interest.", "The suitable tenure depends on cash flow, other essential commitments and the loan terms. This comparison does not recommend one tenure for every borrower."] },
      { id: "compare-own-numbers", heading: "Compare your own amount and rate", paragraphs: ["A ₹50 lakh example cannot represent every loan. Changing the amount or rate can materially change both the EMI and the gap between tenures."], callout: { title: "Test another tenure", text: [{ text: "Use the " }, { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } }, { text: " to compare the EMI, total interest and repayment schedule for your own inputs." }] } },
    ],
    faq: [
      { question: "Does the lowest EMI mean the lowest-cost tenure?", answer: "No. A lower EMI commonly comes from spreading repayment over more months, which can increase total interest. Compare both figures." },
      { question: "Does the table predict what a floating-rate loan will cost?", answer: "No. It holds the rate at 8.5% for the full tenure. Actual floating rates and the resulting repayment schedule can change." },
    ],
    references: [
      { title: "Housing Loans — FAQs", publisher: "Reserve Bank of India", url: "https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701", sourceType: "official", accessedAt: "2026-08-16" },
      { title: "FAQs on Reset of Floating Interest Rate on EMI-based Personal Loans", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQRFIR10012025.pdf", sourceType: "official", accessedAt: "2026-08-16" },
    ],
  },
  {
    title: "How Home Loan Prepayment Changes Principal, Tenure and Interest",
    slug: "home-loan-prepayment",
    description: "What a home-loan part-prepayment does to outstanding principal, future interest, EMI and tenure, subject to the lender’s terms.",
    category: "loans",
    publishedAt: "2026-08-16",
    updatedAt: "2026-08-16",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "home-loan",
    calculatorGuideRole: "supporting",
    relatedCalculators: [],
    relatedArticles: ["home-loan-guide", "home-loan-tenure-comparison"],
    sections: [
      { id: "what-prepayment-does", heading: "What a part-prepayment does", paragraphs: ["A part-prepayment is an amount paid in addition to the scheduled EMI and applied to outstanding principal. Once the lender applies it, the principal used for later interest calculations is lower.", "This is different from paying an EMI early. Confirm how the lender will identify and apply the additional amount before transferring it."] },
      { id: "why-interest-can-fall", heading: "Why future interest can fall", paragraphs: ["Under a monthly reducing-balance convention, interest for a month is calculated on the outstanding principal. Reducing that principal earlier means later interest starts from a lower base.", "The actual saving depends on when the prepayment is credited, the amount, future rates, the remaining tenure, the lender’s recalculation method and whether the EMI or tenure changes. This article does not calculate an individual saving."] },
      { id: "what-can-change", heading: "What may happen after prepayment", paragraphs: ["The lender’s terms and the borrower’s permitted instruction determine the revised schedule. Do not assume that every lender automatically reduces tenure or automatically reduces EMI."], table: { caption: "Common ways a revised schedule may be handled", headers: ["Possible treatment", "What it generally means", "What to confirm"], rows: [["Tenure reduces", "EMI stays similar and fewer instalments remain", "Revised final payment date"], ["EMI reduces", "Tenure stays similar and the required monthly payment falls", "Revised EMI and effective date"], ["Another permitted treatment", "The lender applies its documented process or an available borrower instruction", "How the amount is allocated and when the revised schedule starts"]] } },
      { id: "floating-rate-reset", heading: "Floating-rate resets and borrower options", paragraphs: ["For applicable EMI-based floating-rate loans, RBI instructions require regulated entities to communicate the effect of benchmark-rate resets. The available options can include increasing EMI, extending tenure, using a combination, switching to fixed rate under the lender’s policy, and part or full prepayment.", "Those reset options do not mean every lender handles an ordinary voluntary prepayment in exactly the same way. Ask for the revised amortization schedule after the amount is applied."] },
      { id: "charges", heading: "Check whether a charge can apply", paragraphs: ["Do not assume that every loan can be prepaid without a charge. RBI protections restrict prepayment charges for applicable floating-rate loans, including specified protections for individuals borrowing for non-business purposes. Treatment outside the protected cases can depend on the lender category, whether the loan is fixed, floating or dual-rate, when it was sanctioned or renewed, and the applicable rules and loan terms.", "For loans sanctioned or renewed on or after 1 January 2026, the RBI’s 2025 Directions set the current framework across covered regulated entities. For a dual or special-rate loan, the rate structure at the time of prepayment matters. Check the lender’s current terms rather than relying on a general statement."] },
      { id: "documents-to-check", heading: "Documents and instructions to check", list: ["Sanction letter: the approved rate structure, tenure and conditions.", "Key Facts Statement: applicable key terms, APR and disclosed charges.", "Loan agreement: the prepayment or foreclosure clause and reset terms.", "Current lender instructions: minimum amount, notice, payment route and schedule-revision process.", "Revised amortization schedule: how principal, EMI and remaining tenure changed after posting."] },
      { id: "calculator-scope", heading: "Start with the original loan schedule", paragraphs: ["The Home Loan EMI Calculator shows the original EMI, total interest and schedule for the amount, rate and tenure entered. It does not estimate the saving from a later part-prepayment."], callout: { title: "Review the original loan schedule", text: [{ text: "Open the " }, { text: "Home Loan EMI Calculator", link: { kind: "calculator", slug: "home-loan" } }, { text: " to view the monthly reducing-balance schedule before considering any lender-specific prepayment treatment." }] } },
    ],
    faq: [
      { question: "Does a part-prepayment always reduce the tenure?", answer: "No. The lender may reduce tenure, reduce EMI, or apply another permitted treatment according to its terms and the available borrower instruction. Ask for the revised schedule." },
      { question: "Is home-loan prepayment always free?", answer: "No blanket statement covers every loan. Current RBI protections apply to specified cases, while fixed, dual-rate or otherwise excluded loans can follow different terms. Check the sanction letter, KFS, agreement and current lender instructions." },
    ],
    references: [
      { title: "Housing Loans — FAQs", publisher: "Reserve Bank of India", url: "https://rbi.org.in/CommonPerson/english/scripts/FAQs.aspx?Id=701", sourceType: "official", accessedAt: "2026-08-16" },
      { title: "FAQs on Reset of Floating Interest Rate on EMI-based Personal Loans", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/commonman/Upload/English/FAQs/PDFs/FAQRFIR10012025.pdf", sourceType: "official", accessedAt: "2026-08-16" },
      { title: "Reserve Bank of India (Pre-payment Charges on Loans) Directions, 2025", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12878&Mode=0", sourceType: "official", accessedAt: "2026-08-16" },
      { title: "Key Facts Statement (KFS) for Loans & Advances", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0", sourceType: "official", accessedAt: "2026-08-16" },
    ],
  },
  {
    title: "Personal Loan EMI Explained: Interest, Tenure and Total Repayment",
    slug: "personal-loan-emi-explained",
    description: "How to read a personal-loan EMI, total interest and scheduled repayment under the calculator's reducing-balance assumptions.",
    category: "loans",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "8 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "personal-loan",
    calculatorGuideRole: "core",
    relatedCalculators: [],
    relatedArticles: ["personal-loan-tenure-comparison", "personal-loan-calculator-vs-lender-quote", "home-loan-emi-calculation"],
    sections: [
      {
        id: "read-results-together",
        heading: "Read the EMI and total repayment together",
        paragraphs: [
          "A personal-loan EMI estimate is determined by the principal entered, the annual interest rate and the repayment tenure. The monthly payment matters for cash flow, while total interest and total scheduled repayment show the modeled cost over the full tenure.",
          "The ArthaSiddhi Personal Loan Calculator applies one constant annual rate to a regular monthly reducing-balance schedule. It estimates a repayment scenario; it is not a lender quote, sanction, approval or eligibility decision.",
        ],
      },
      {
        id: "inputs-and-results",
        heading: "What the calculator inputs and results mean",
        list: [
          "Principal: the loan amount entered for the calculation.",
          "Annual interest rate: the constant entered rate used across the modeled tenure.",
          "Tenure: the number of years converted into regular monthly instalments.",
          "Monthly EMI: the modeled monthly payment containing principal and interest.",
          "Total interest: the interest accumulated across the modeled repayment schedule.",
          "Total payment: principal plus modeled interest, not necessarily the full all-in borrowing cost.",
        ],
      },
      {
        id: "worked-example",
        heading: "Worked example: ₹5 lakh at an illustrative 12% for five years",
        paragraphs: [
          "For a principal of ₹5,00,000, an illustrative constant annual rate of 12% and a 60-month tenure, the approved loan engine produces:",
          "The ₹11,122.22 EMI is the regular modeled payment. The ₹6,67,333.43 total is principal plus interest in this schedule; it does not automatically include processing fees, insurance, taxes, charges or financed add-ons.",
        ],
        table: {
          caption: "Engine-generated personal-loan repayment estimate",
          headers: ["Principal", "Illustrative annual rate", "Tenure", "Monthly EMI", "Total interest", "Total scheduled repayment"],
          rows: [["₹5,00,000.00", "12%", "5 years", "₹11,122.22", "₹1,67,333.43", "₹6,67,333.43"]],
        },
      },
      {
        id: "reducing-balance",
        heading: "The schedule uses a monthly reducing balance",
        paragraphs: [
          "Each month, interest is calculated on the principal still outstanding. The rest of that month's EMI reduces principal, so the interest and principal portions change even when the regular EMI stays similar.",
          [
            { text: "This guide focuses on interpreting a personal-loan result. For the detailed generic formula derivation and amortization mathematics, see " },
            { text: "How Home Loan EMI Is Calculated", link: { kind: "article", slug: "home-loan-emi-calculation" } },
            { text: "." },
          ],
        ],
      },
      {
        id: "tenure-trade-off",
        heading: "A shorter or longer tenure changes both figures",
        paragraphs: [
          "With the principal and rate unchanged, fewer instalments usually produce a higher EMI and less scheduled interest. More instalments usually lower the EMI but keep the balance outstanding for longer, increasing scheduled interest.",
          [
            { text: "The " },
            { text: "personal-loan tenure comparison", link: { kind: "article", slug: "personal-loan-tenure-comparison" } },
            { text: " applies that trade-off to two-, three- and five-year scenarios without identifying one tenure as suitable for everyone." },
          ],
        ],
      },
      {
        id: "limitations",
        heading: "What the calculator does not determine",
        paragraphs: [
          "The model assumes a constant rate and regular monthly repayments. It does not model variable-rate changes, payment-date differences, missed payments, prepayment, flat-rate interest or lender-specific accrual methods.",
          "It also excludes processing fees, insurance, taxes and charges, financed add-ons, and APR or effective borrowing cost. It does not use income, existing obligations, FOIR, credit score, age, employment or lender policy to determine affordability, eligibility, sanction or approval.",
          [
            { text: "Read " },
            { text: "why a calculator estimate may differ from a lender quote", link: { kind: "article", slug: "personal-loan-calculator-vs-lender-quote" } },
            { text: ", or enter a controlled scenario in the " },
            { text: "Personal Loan EMI Calculator", link: { kind: "calculator", slug: "personal-loan" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does the calculator's total repayment include every borrowing cost?", answer: "No. It adds modeled interest to principal but does not automatically include processing fees, insurance, taxes, charges, add-ons or APR effects." },
      { question: "Does a Personal Loan EMI estimate mean the loan will be approved?", answer: "No. The calculator does not assess eligibility, credit profile, sanction terms or lender approval policy." },
      { question: "Is 12% a current Personal Loan rate?", answer: "No. It is an illustrative constant input used only for the worked example, not a current, typical, best or guaranteed offered rate." },
    ],
  },
  {
    title: "Personal Loan Tenure: Shorter vs Longer Repayment",
    slug: "personal-loan-tenure-comparison",
    description: "Compare how two-, three- and five-year personal-loan tenures change EMI, total interest and scheduled repayment at the same inputs.",
    category: "loans",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "personal-loan",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 100,
    relatedCalculators: [],
    relatedArticles: ["personal-loan-emi-explained", "personal-loan-calculator-vs-lender-quote"],
    sections: [
      {
        id: "answer",
        heading: "Tenure changes the monthly payment and scheduled interest",
        paragraphs: [
          "For the same principal and rate, a shorter personal-loan tenure usually requires a higher EMI but leaves less time for interest to accumulate. A longer tenure usually lowers the EMI and increases total scheduled interest.",
          "That is a mathematical comparison, not an affordability, eligibility or suitability assessment. The calculator does not know a borrower's income, existing obligations, FOIR, credit profile, age, employment or lender policy.",
        ],
      },
      {
        id: "comparison",
        heading: "Two, three and five years compared",
        paragraphs: [
          "Each row keeps the principal at ₹5,00,000 and uses the same illustrative constant annual rate of 12%. It assumes monthly reducing-balance interest, regular monthly repayments, no prepayment and no fees or charges.",
        ],
        table: {
          caption: "Engine-generated short-tenure personal-loan comparison",
          headers: ["Tenure", "Monthly EMI", "Total interest", "Total scheduled repayment"],
          rows: [
            ["2 years", "₹23,536.74", "₹64,881.67", "₹5,64,881.67"],
            ["3 years", "₹16,607.15", "₹97,857.58", "₹5,97,857.58"],
            ["5 years", "₹11,122.22", "₹1,67,333.43", "₹6,67,333.43"],
          ],
        },
      },
      {
        id: "interpretation",
        heading: "The lower EMI comes with a longer schedule",
        paragraphs: [
          "In this controlled example, extending repayment from two to five years reduces the displayed EMI from ₹23,536.74 to ₹11,122.22. Total scheduled interest rises from ₹64,881.67 to ₹1,67,333.43 because principal remains outstanding across more months.",
          "Changing the principal or rate changes the comparison. The 12% input is illustrative and is not a current market rate, typical lender rate, best available rate or guaranteed offer.",
        ],
      },
      {
        id: "no-universal-tenure",
        heading: "The table does not identify one universally best tenure",
        paragraphs: [
          "A higher or lower modeled EMI does not establish what is affordable or safe for a particular borrower, and the table cannot predict eligibility or approval. Compare the arithmetic, then use the lender's actual offer and your own obligations for any real borrowing decision.",
          [
            { text: "Return to " },
            { text: "Personal Loan EMI Explained", link: { kind: "article", slug: "personal-loan-emi-explained" } },
            { text: ", review possible " },
            { text: "lender-quote differences", link: { kind: "article", slug: "personal-loan-calculator-vs-lender-quote" } },
            { text: ", or compare another short tenure in the " },
            { text: "Personal Loan EMI Calculator", link: { kind: "calculator", slug: "personal-loan" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Does a longer Personal Loan tenure always cost less?", answer: "No. It commonly lowers the EMI for the same principal and rate, but scheduled interest can rise because repayment runs for more months." },
      { question: "Does this comparison show which tenure I can afford?", answer: "No. It compares calculator outputs and does not assess income, obligations, eligibility or lender approval." },
      { question: "Is the 12% example a lender rate recommendation?", answer: "No. It is an illustrative constant input, not a current rate claim or recommendation." },
    ],
  },
  {
    title: "Why a Personal Loan Calculator Estimate May Differ From a Lender Quote",
    slug: "personal-loan-calculator-vs-lender-quote",
    description: "Why a personal-loan EMI estimate may not match a lender quote, sanction terms, net disbursement or all-in borrowing cost.",
    category: "loans",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "7 min read",
    maintenance: { kind: "evergreen" },
    primaryCalculator: "personal-loan",
    calculatorGuideRole: "supporting",
    calculatorDiscoveryPriority: 50,
    relatedCalculators: [],
    relatedArticles: ["personal-loan-emi-explained", "personal-loan-tenure-comparison"],
    references: [
      { title: "Key Facts Statement (KFS) for Loans & Advances", publisher: "Reserve Bank of India", url: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12663&Mode=0", sourceType: "official", accessedAt: "2026-08-20" },
    ],
    sections: [
      {
        id: "answer",
        heading: "A calculator scenario and a lender quote serve different purposes",
        paragraphs: [
          "The Personal Loan EMI Calculator applies the principal, constant annual rate and tenure entered to a standard monthly reducing-balance schedule. A lender quote or sanction document can use applicant-specific terms and include costs outside that schedule.",
          "Calculator estimate does not equal lender quote. A calculator result is also not a sanction, approval or eligibility decision, and it does not predict the rate or amount a lender may offer.",
        ],
      },
      {
        id: "baseline",
        heading: "Start by comparing the same principal, rate and tenure",
        paragraphs: [
          "For ₹5,00,000 at an illustrative constant 12% for 60 months, the calculator estimates an EMI of ₹11,122.22, total interest of ₹1,67,333.43 and total scheduled repayment of ₹6,67,333.43. These are engine-generated principal-and-interest figures, not a simulated lender quotation.",
          "Before investigating a difference, confirm that the lender document uses the same sanctioned principal, offered rate and number of instalments as the calculator inputs.",
        ],
      },
      {
        id: "inputs-can-differ",
        heading: "The lender may be using different inputs",
        list: [
          "Sanctioned amount may differ from the amount requested or entered.",
          "The offered interest rate may be applicant-specific.",
          "The contractual tenure or first instalment period may differ.",
          "Payment dates and product-specific interest-accrual conventions may affect the schedule.",
          "Lender rounding may create small differences between displayed instalments and totals.",
        ],
      },
      {
        id: "costs-outside-model",
        heading: "Some borrowing costs sit outside the calculator",
        paragraphs: [
          "Processing fees, insurance or other add-ons, applicable taxes and charges, and deductions from disbursement are not included in the calculator's principal-and-interest total. If a charge is financed, the contractual amount used for repayment may also differ from the cash received.",
          "APR or effective borrowing cost is not calculated by this tool. Review the lender's Key Facts Statement, sanction letter, repayment schedule and agreement for the applicable all-in disclosures and terms. Do not assume every lender applies or presents each item identically.",
        ],
      },
      {
        id: "not-modeled",
        heading: "The estimate does not reproduce every contractual event",
        paragraphs: [
          "The engine does not model variable-rate changes, missed payments, prepayment, flat-rate interest, lender-specific accrual methods or revised schedules. It therefore cannot calculate foreclosure savings, a revised EMI or a revised tenure.",
          "A difference does not by itself mean either figure is an error. First align the inputs, then identify fees, deductions, dates and contractual treatments that the simplified model excludes.",
        ],
      },
      {
        id: "compare-documents",
        heading: "Compare the estimate with the lender's documents",
        paragraphs: [
          [
            { text: "Use the " },
            { text: "Personal Loan EMI Calculator", link: { kind: "calculator", slug: "personal-loan" } },
            { text: " for a consistent principal-and-interest baseline. Read " },
            { text: "Personal Loan EMI Explained", link: { kind: "article", slug: "personal-loan-emi-explained" } },
            { text: " for the model assumptions, or compare the effect of " },
            { text: "shorter and longer tenures", link: { kind: "article", slug: "personal-loan-tenure-comparison" } },
            { text: "." },
          ],
        ],
      },
    ],
    faq: [
      { question: "Why can the amount received be lower than the sanctioned amount?", answer: "A lender may deduct applicable fees, taxes, insurance or other documented charges before disbursement. The calculator does not model those deductions." },
      { question: "Does the calculator show APR or effective borrowing cost?", answer: "No. It calculates principal and interest under its repayment assumptions and does not incorporate every fee or charge used in an all-in cost measure." },
      { question: "Can the calculator predict approval or the rate I will receive?", answer: "No. It does not assess eligibility, credit profile, lender policy, sanction amount or offered rate." },
    ],
  },
] satisfies readonly Article[];
