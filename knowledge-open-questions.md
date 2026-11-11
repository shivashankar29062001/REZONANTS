# Knowledge Base Open Questions (Confirm Before Launch)

Every item below appears somewhere in the codebase (`src/`, `supabase/migrations/`, or legacy fallback pages), is contradictory, incomplete, or appears to be placeholder/unverified copy. The chatbot (`server/knowledge.md`) avoids stating unverified claims as fact until you confirm them.

1. **Contradictory Homepage Project, Client & Award Counters**
   - `Hero` (`src/App.jsx`) displays **`12+ years`**, **`320+ projects`**, **`98% retention`**, and **`Rezonants — since 2012`**.
   - `Stats` (`src/App.jsx`) displays **`1,056+ Happy clients`**, **`328+ Projects done`**, and **`23+ Win awards`**.
   - `About` (`src/App.jsx` & `translation.json`) says **`Award Winning`** without naming any specific award, and `insights.item3` mentions *"Recognized among leading IT innovation studios in Hyderabad"*.
   - **Action needed:** Confirm the exact verified founded year, project count (`320+` vs `328+`), client count, retention percentage, and whether any specific award names should be published (or remove unverified award counts).

2. **Database Seed Testimonials & Case Study Projects Are Placeholders**
   - `supabase/migrations/20261111112000_init_rezonants_schema.sql` seeds sample rows: `FinanceFlow Inc`, `ShopSphere`, `GlobalRetail Co`, and testimonials from `Alex Thompson (TechCorp)`, `Maria Santos (StartupXYZ)`, `James Wilson (EnterpriseCo)`.
   - **Action needed:** Confirm real client/case-study records (none of those seed names are included in `knowledge.md`).

3. **Unverified Case Studies & Metrics Inside Legacy / Secondary Service Pages**
   - `src/pages/services/CenterOfExcellencePage.jsx` (`-legacy` route): claims `2-3x` delivery velocity, `150-person CoE`, `50+ microservices`, `99.9% uptime`, `20+ product teams`.
   - `src/pages/services/MigrationServicesPage.jsx` (`-legacy` route): claims `99.99% data fidelity`, `150 microservices`, `3 regions`, `50TB Teradata to Snowflake`.
   - `src/pages/services/PilotPrototypingPage.jsx` (`-legacy` route): claims `2-6 week sprints`, `10k docs/day with 94% accuracy in 4 weeks`, `MVP in 8 weeks, secured Series A`, `500 sensors`, `23% energy savings`, and `"Fixed-scope, fixed-price engagements"`.
   - `src/pages/ProcessAutomationPage.jsx` (live route `/services/business-process-automation`): states `"straight-through processing rates exceeding 95%"`.
   - `src/data/technologiesData.js`: claims `"Guaranteed 99.999% infrastructure uptime"` (Data Center) and `"Guaranteed 99.99% system availability"` (Managed Services), plus mentions `GDPR, HIPAA, SOC 2` compliance.
   - **Action needed:** Confirm which SLAs, certifications/compliance standards, sprint timelines, and case study metrics are accurate before allowing the chatbot to cite them.

4. **Product Naming Discrepancy (`ProductsPage.jsx` vs `App.jsx` / `chatMenus.js`)**
   - The active `/products` page (`src/pages/ProductsPage.jsx`) renders capability modules like *AI Automation & Intelligent Agents*, *Core HR Management*, *Payroll Management*, *IT Service Management*, etc.
   - Unused constants in `src/App.jsx` and `src/lib/chatMenus.js` (`PRODUCTS_MENU`) list branded names (`Rezonants AI Suite`, `CloudNexus`, `WorkSync`, `DataStream`, `Rezonants ERP Core`, `HRMS Pro`, `SupplyChain IQ`, `Finance Hub`).
   - **Action needed:** Confirm whether those branded product names are official Rezonants products or should be aligned with `/products`.

5. **Digital Marketing & SEO Offering Discrepancy**
   - Homepage `Services` lists 9 software/cloud/AI engineering services (no Digital Marketing service card).
   - `BookConsultationPage.jsx` dropdown (`translation.json` -> `consultation.services`) includes **`IT Consulting`** and **`Digital Marketing & SEO`**, and `index.html` SEO meta tags mention *"digital marketing, SEO"*.
   - **Action needed:** Confirm whether Digital Marketing & SEO is an active service the chatbot should promote or should be removed from consultation options / metadata.

6. **Business Hours vs 24/7 Support & Consultation Budgets**
   - Contact panel states **`Mon – Sat, 9:30 – 18:30 IST`**, older server prompts had `Monday–Saturday, 10:00–19:00 IST`, and About/Managed Services refer to **`24/7 Support` / `24/7/365`**.
   - `/book-consultation` lists INR budget options (`Under ₹1L`, `₹1L – ₹5L`, `₹5L – ₹10L`, `₹10L+`) and time slots `9:00 AM – 6:00 PM` (without timezone specified).
   - **Action needed:** Confirm office vs 24/7 support hours, consultation slot timezone, and whether visitors from South Africa or UAE have separate consultation hours/currencies.

7. **Hyderabad Address Typo & Maps Pin Difference**
   - Hyderabad text contains typo `"HUDA Tecno Encalve"`, while the Google Maps link points to `"Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd"`.
   - **Action needed:** Confirm official Hyderabad street spelling and postal pin.

8. **Privacy Policy & Footer Legal Links**
   - `PrivacyPolicyPage.tsx` states `"Last updated: August 2026"` and line 82 renders `<1>info@rezonants.com</1>` literal tags because `t()` is rendered as plain text rather than `<Trans>`.
   - Footer displays `"Terms of Use"` and `"Accessibility"` as non-clickable text without dedicated routes.
   - **Action needed:** Confirm whether Terms of Use / Accessibility pages will be added and fix `PrivacyPolicyPage.tsx` link markup if desired.

