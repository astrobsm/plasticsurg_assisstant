# Quick Start Guide: Comprehensive Treatment Planning

## 🚀 Accessing the Feature

1. Navigate to the **Treatment Planning** page from the sidebar
2. Click the **"Create Treatment Plan"** button (green button with plus icon)
3. The comprehensive 6-step form wizard will appear

---

## 📝 Step-by-Step Form Guide

### **Step 1: Basic Info & Medical Team**

#### Basic Information
- **Patient**: Select from dropdown (shows name and hospital number)
- **Admission Date**: Pick the date (defaults to today)
- **Diagnosis**: Enter the primary diagnosis or reason for admission

#### Medical Team Assignment
- **Senior Registrar**: Enter the consultant/senior registrar's name (e.g., "Dr. Okoye")
- **Registrar**: Enter the registrar's name (e.g., "Dr. Adebayo")
- **House Officer**: Enter the house officer's name (e.g., "Dr. Ibrahim")
- **Additional Notes**: Optional field for extra information

**All fields marked with * are required**

Click **"Next"** to proceed to Step 2.

---

### **Step 2: Medications**

Add all medications the patient needs during admission.

#### For Each Medication:
1. **Medication Name**: e.g., "Tramadol", "Ceftriaxone", "Paracetamol"
2. **Dosage**: e.g., "100mg", "1g", "500mg"
3. **Route**: Select from dropdown
   - Oral, IV, IM, SC, Topical, Rectal, Sublingual, Inhalation
4. **Frequency**: e.g., "TDS" (3x/day), "BD" (2x/day), "OD" (1x/day), "Q6H" (every 6 hours)
5. **Duration**: e.g., "7 days", "2 weeks", "Until discharge"
6. **Start Date**: When to begin this medication

Click **"Add Medication"** button after filling all fields.

#### Tips:
- You can add unlimited medications
- Each medication appears in the list below after adding
- Click the **trash icon** to remove any medication
- Common frequencies: OD (once daily), BD (twice daily), TDS (3x daily), QDS (4x daily), Q6H (every 6 hours)

Click **"Next"** when done adding all medications.

---

### **Step 3: Investigations**

Add all lab tests, imaging, and other investigations needed.

#### For Each Investigation:
1. **Investigation Name**: e.g., "FBC", "U&E", "Chest X-ray", "Wound Swab"
2. **Type**: Laboratory, Imaging, or Other
3. **Frequency**: How often to repeat
   - Once, Daily, Alternate Days, Twice Weekly, Weekly, Biweekly, As Needed
4. **Repeat Count**: How many times (e.g., 7 for daily FBC for 7 days)
5. **Target Value**: Expected or desired result (optional)
6. **Normal Range**: Reference range (optional, e.g., "4.0-5.5 mmol/L")

Click **"Add Investigation"** button after filling fields.

#### Examples:
- **FBC**: Lab, Daily, 7x, Target: "WBC <12", Range: "4-11 x10^9/L"
- **Chest X-ray**: Imaging, Once, 1x
- **Wound Culture**: Lab, Weekly, 2x

Click **"Next"** when done.

---

### **Step 4: Procedures**

Add all surgical or therapeutic procedures planned.

#### For Each Procedure:
1. **Procedure Name**: e.g., "Wound Debridement", "Skin Grafting", "Dressing Change"
2. **Type**: Minor, Major, Diagnostic, or Therapeutic
3. **Proposed Date**: When the procedure should happen
4. **Proposed Time**: Specific time (optional)
5. **Frequency**: If this is a repeated procedure
   - Leave as "One-time procedure" for single procedures
   - Select Daily, Alternate Days, Weekly, or As Needed for repeated procedures
6. **Repeat Count**: How many times (only appears if frequency is set)
7. **Surgeon**: Who will perform it (optional)
8. **Location**: e.g., "OT 1", "Ward", "Procedure Room"

Click **"Add Procedure"** button after filling fields.

#### Examples:
- **One-time**: "Skin Grafting", Major, Tomorrow 10:00, Dr. Okoye, OT 1
- **Repeated**: "Dressing Change", Therapeutic, Tomorrow, Daily, 14x, Ward

Click **"Next"** when done.

---

### **Step 5: Reviews**

Set up scheduled patient reviews by team members.

#### For Each Review Schedule:
1. **Review Type**: Daily, Alternate Days, Weekly, Biweekly, or Custom Days
2. **Days of Week**: Check the boxes for specific days
   - Useful for aligning with consultant ward rounds
   - Example: Check Mon, Wed, Fri for consultant rounds
3. **Assigned To**: House Officer, Registrar, or Senior Registrar
4. **Assigned Person Name**: Specific doctor's name
5. **Start Date**: When reviews begin

Click **"Add Review Schedule"** button.

#### Examples:
- **Daily rounds**: Daily, Mon-Fri checked, Dr. Ibrahim (House Officer)
- **Consultant rounds**: Custom Days, Mon/Wed/Fri checked, Dr. Okoye (Senior Registrar)
- **Weekly review**: Weekly, Monday checked, Dr. Adebayo (Registrar)

Click **"Next"** when done.

---

### **Step 6: Discharge Planning**

Plan for patient discharge and set criteria.

#### Required:
1. **Proposed Discharge Date**: Your best estimate (can be extended later)

#### Discharge Criteria:
Add criteria that must be met before discharge:
- Type one criterion and press Enter or click the **+** button
- Each criterion becomes a pending target
- Examples:
  - "Wound healing >80% granulation"
  - "No signs of infection"
  - "Patient ambulatory"
  - "Pain controlled on oral medications"
  - "Patient educated on home care"

Click **trash icon** to remove any criterion.

**Note**: You can extend the discharge date later if targets aren't met, and the system will track the reason.

Click **"Create Treatment Plan"** to save everything.

---

## ✅ After Submission

1. The modal closes automatically
2. Your new treatment plan appears in the active plans list
3. All data is saved to the database
4. You can view and manage the plan from the treatment planning page

---

## 💡 Pro Tips

### Efficient Data Entry
1. **Prepare medication list beforehand** - Have doses and routes ready
2. **Use standard abbreviations** - TDS, BD, OD, Q6H, etc.
3. **Start with common medications** - Pain relief, antibiotics, then specialized drugs
4. **Group investigations** - Add all daily labs first, then weekly imaging
5. **Be realistic with discharge date** - Better to extend than pressure premature discharge

### Common Medication Routes
- **Oral**: Pills, tablets, syrups
- **IV**: Intravenous (directly into vein)
- **IM**: Intramuscular (injected into muscle)
- **SC**: Subcutaneous (under skin)
- **Topical**: Applied to skin/wound

### Common Frequencies
- **OD**: Once daily (omne in die)
- **BD**: Twice daily (bis in die)
- **TDS**: Three times daily (ter die sumendum)
- **QDS**: Four times daily (quater die sumendum)
- **Q6H**: Every 6 hours
- **Q8H**: Every 8 hours
- **PRN**: As needed (pro re nata)
- **STAT**: Immediately (statim)

### Navigation Tips
- Use **"Previous"** button to go back and edit earlier steps
- Your data is preserved when navigating between steps
- You can skip adding items in any step (medications, investigations, etc. are optional)
- Only basic info, medical team, and discharge date are required

---

## 🔧 Troubleshooting

### "Can't submit form"
- Check that all required fields (marked with *) are filled
- Ensure at least one team member is assigned
- Verify discharge date is selected

### "Medication won't add"
- Medication name, dosage, and frequency are required
- Route must be selected (defaults to Oral)

### "Can't see my new plan"
- Check that you're on the Treatment Planning page
- Plan should appear in "Active Plans" section
- If not visible, refresh the page

### "Lost data when navigating"
- This shouldn't happen - data persists across steps
- If it does, please report as a bug
- As a workaround, complete the entire form in one session

---

## 📊 Example: Complete Burn Patient Plan

**Patient**: John Doe (UNTH-2024-001)  
**Diagnosis**: 30% TBSA mixed-thickness burns - bilateral lower limbs  
**Admission Date**: 15 Jan 2024

### Team
- Senior Registrar: Dr. Okoye
- Registrar: Dr. Adebayo
- House Officer: Dr. Ibrahim

### Medications (6)
1. Ringers Lactate - 200ml/hr, IV, Continuous, 48 hours
2. Tramadol - 100mg, IV, Q8H, 7 days
3. Ceftriaxone - 1g, IV, BD, 7 days
4. Metronidazole - 500mg, IV, TDS, 7 days
5. Omeprazole - 40mg, IV, OD, 7 days
6. Multivitamin - 1 tab, Oral, OD, 14 days

### Investigations (5)
1. FBC - Lab, Daily, 7x, Target: WBC <12
2. U&E - Lab, Alternate Days, 4x
3. Wound Swab - Lab, Weekly, 2x
4. Chest X-ray - Imaging, Once, 1x
5. Urinalysis - Lab, Daily, 3x

### Procedures (3)
1. Wound Debridement - Therapeutic, 16 Jan 10:00, Daily, 7x, Dr. Okoye, OT 1
2. Dressing Change - Therapeutic, 16 Jan 16:00, Daily, 14x, Ward
3. Skin Grafting - Major, 23 Jan 09:00, Dr. Okoye, OT 1

### Reviews (2)
1. Daily Round - Daily, Mon-Fri, Dr. Ibrahim, House Officer
2. Consultant Round - Custom, Mon/Wed/Fri, Dr. Okoye, Senior Registrar

### Discharge
- **Proposed Date**: 5 Feb 2024 (3 weeks)
- **Criteria**:
  - Wound healing >80% granulation
  - No signs of infection (afebrile 48h, WBC normal)
  - Patient ambulatory with walker
  - Pain controlled on oral analgesics
  - Donor site healed
  - Patient/family educated on home care

---

## 🎯 Best Practices

1. **Complete all steps thoughtfully** - This is the master care plan
2. **Be specific with medications** - Include exact doses and routes
3. **Set realistic targets** - Discharge dates, investigation targets
4. **Coordinate reviews** - Align with actual ward round schedules
5. **Document criteria clearly** - Make discharge criteria measurable
6. **Include patient education** - Add it as discharge criterion
7. **Plan for complications** - Consider adding investigations/procedures for potential issues

---

## 📞 Need Help?

- **Clinical questions**: Consult your senior registrar
- **Technical issues**: Contact IT support
- **Feature requests**: Speak with the department administrator

---

**Version**: 1.0  
**Last Updated**: [Current Date]  
**For**: UNTH Plastic Surgery Department Staff
