# Women’s Healthcare App – Navigation & Information Architecture

## Bottom Navigation Structure

| Icon | Label | Contains / Purpose |
|----|----|----|
| 🏠 | **Home** | Main dashboard with key insights, upcoming screening/vaccine reminders, quick-access health tips, and shortcuts to recent activity |
| 🔍 | **Discover** | Find hub combining doctor, gynaecologist, hospital, disease information, and future finder features |
| ➕ | **Track** | Central health management hub for vaccination tracking, screenings, and condition logging |
| 🛒 | **Products** | Marketplace for women’s health products and insurance offerings |
| 👤 | **Profile** | User profile, medical history, saved items, appointments, and settings |

---

## Secondary Navigation

### Hamburger Menu / Profile Section
- My Appointments (future)  XX
- Saved Articles / Health Library   XX
- Medical History  XX
- Settings & Privacy
- Help & Support
- Invite a Friend   (App link)

---

## Floating Action Button (FAB)

**Recommended Usage**
- Single most important action only  
- Examples:
  - “Log Entry” (symptoms / period)
  - “Add Vaccine”

**Guidelines**
- Place on **Home** or **Track**
- Avoid multiple FABs to reduce clutter

---

## Top Navigation Tabs (Within Sections)

Used to separate content inside major tabs:

- **Discover**
  - Doctors
  - Hospitals
  - Clinics
  - Diseases
- **Products**
  - Health Products
  - Insurance
- **Track**
  - Vaccines
  - Screenings
  - Cycle / Conditions  (XXXX)
 
---

## Final Navigation Recommendation

### Bottom Navigation
**Home | Discover | Track | Products | Profile**

### Reasoning
- **Track** bundles core health-tracking features (Vaccines, Screenings, Conditions), making proactive health management the app’s heart.
- **Discover** cleanly handles all location-based finding needs.
- **Products** isolates commercial activities for a clear mental model.
- The structure is user-centric and journey-based, not just a list of features.

---

# 🏠 HOME – Primary Dashboard

### Key Components
- Quick stats & reminders
- Personalized health nudges

### Direct Links
- **Upcoming Health Screenings** → Women Health Screenings
- **Vaccination Due** → Vaccination Tracking Setup
- **Health Tips** → Disease Information Master Screen

### Currently Not Present
- Recent / Quick Access section
- Recently viewed diseases
- Last searched doctors
- Recommended products

---

# 🔍 DISCOVER – The Find Hub

### Core Features
- Global search bar with filters:
  - Doctors
  - Hospitals
  - Diseases

### Categories
- Find Gynaecologists → Gynaecologist Finder
- Find Doctors (Other Specialists)
- Hospital / Clinic Finder (Map + List)
- Disease Information → Disease Master Screen

---

## Discover → Disease Flow

Home / Discover
↓
Disease Master Screen
↓
Disease Detail (e.g., PCOS)
↓
┌───────────────┬────────────────┬────────────────────┐
│ │ │ │
FAQs Find Specialist Recommended Screenings When to See Doctor
│ │ │
│ Book Appointment Time Frequency
│
When to See Gynaecologist

yaml
Copy code

---

## Discover → Doctor Finder Flow

Discover → Find Doctors / Gynaecologists
↓
Filtered Results
↓
Doctor Profile
↓
┌────────────┴────────────┐
│ │
Book Appointment (future) Save to Profile

yaml
Copy code

---

# ➕ TRACK – Health Management Hub

### Structure
Three main tabs inside **Track**

---

## Tab 1: Vaccinations ->  Vaccination Schedule - Newborn to 12 Years

### Vaccination Dashboard
- Status overview by age group *(planned)*

With tabs for each of :
### Age Group Schedules
- Newborn–12 Years
- Adolescent (12–18 Years)
- Adult Women

### Actions
- Update Records
- Setup Tracking
- Mark as Done
- Set Reminder

### Flow
Track (currently Main Screen Vaccinatio) → Vaccination Dashboard (XXX Not present)
↓
Select Age Group
↓
Schedule Details
↓
Mark as Done / Set Reminder

---

# 🛒 PRODUCTS – Marketplace

### Two-Tab Structure

#### Tab 1: Health Products
- Browse women’s health products
- Filter by condition:
  - PCOS
  - Pregnancy
  - Menopause
- Product Detail → Insurance Coverage

#### Tab 2: Insurance
- Insurance plans for women
- Plan comparison
- Purchase / Enroll

---

# Navigation Rules

### Back Navigation
- Always return to previous screen via back arrow / gesture
- Bottom navigation persists across screens
- Breadcrumbs used within modules
- Deep flows return to their hub (e.g., Update Records → Track)

### Post-Action Navigation
- Product purchase → Return to Products tab
- Appointment booking → Return to Discover or Home

---

# Special Navigation Cases

### Emergency Access
**“When to See Doctor”** always accessible from:
- Disease Detail screens
- FAQ sections
- Profile → Emergency contacts

### Quick Booking
- From Home reminders (screenings / vaccinations)
- Direct link to Find Doctors

### Condition-Specific Products
- Disease Detail → Recommended Products
- Opens Health Products (pre-filtered)