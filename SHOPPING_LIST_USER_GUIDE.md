# Shopping List User Guide

## How to Use the Enhanced Shopping List Generator

### Step 1: Select Procedure Category
At the top of the page, choose one of three categories:
- **Surgery** - For surgical procedures and operations
- **Wound Dressing** - For wound care supplies
- **Bedside Debridement** - For bedside debridement procedures

**Note:** Switching categories will clear your current selection.

---

### Step 2: Browse and Search Items

#### Using the Search Bar
1. Type item name in the search box (e.g., "suture", "cannula", "gloves")
2. Results update in real-time as you type
3. Search is case-insensitive

#### Using Category Filter
1. Click the category dropdown
2. Select from 31 categories:
   - All Categories (default - shows everything)
   - Cannulas
   - Plaster
   - Giving Sets
   - Syringes
   - IV Fluids
   - Gloves
   - Anesthetics
   - Antibiotics
   - Surgical Instruments
   - Sutures
   - Antiseptics
   - Ointments
   - Dressings
   - Bandages
   - Catheters
   - Drains
   - Splints
   - Sterile Consumables
   - Analgesics
   - Anti-emetics
   - Miscellaneous
   - (and more...)

#### Combining Search and Filter
- Use both together for precise results
- Example: Filter by "Sutures" category, then search "vicryl"

---

### Step 3: Add Items to Your List

1. Find the item you want in the left panel
2. Click the **green (+) button** on the right side of the item card
3. Item moves to the right panel "Selected Items" section
4. Item automatically gets quantity of **1**
5. Item disappears from the available items list

**Tip:** Items already in your list won't show in the browser

---

### Step 4: Manage Quantities

For each selected item, you can:

#### Increase Quantity
- Click the **(+) button** on the right

#### Decrease Quantity
- Click the **(-) button** on the left
- **Minimum quantity is 1** (button disabled at 1)

#### Direct Input
- Click in the number field
- Type the desired quantity
- Press Enter or click outside to confirm
- Minimum value enforced: 1

#### Remove Item
- Click the **trash icon (🗑️)** in the top-right of the item card
- Item returns to available items list

---

### Step 5: Review Your Selection

The right panel shows:
- **Total number of selected items** in the header
- **Each item** with:
  - Item name
  - Category
  - Quantity controls
  - Unit (piece, bottle, roll, etc.)
  - Remove button

#### Clear All Items
- Click **"Clear All"** button in the top-right of the right panel
- Confirmation: All items removed and returned to available list

---

### Step 6: Generate Shopping List PDF

1. Click **"Generate Shopping List"** button (green, at bottom of right panel)
   - **Note:** Button only appears when items are selected
   - If no items selected, alert shows: "Please select at least one item"

2. Patient Selector Modal opens showing:
   - Header with category and item count
   - Search bar for patients
   - List of all patients with details

3. Search for Patient (optional):
   - Type patient name or hospital number
   - Results filter in real-time
   - Clear search to see all patients

4. Select Patient:
   - Click on the patient card
   - PDF generates immediately

5. PDF Downloads:
   - Filename format: `ShoppingList_[PatientName]_[Category]_[Date].pdf`
   - Example: `ShoppingList_John_Doe_Surgery_2024-01-15.pdf`

---

## PDF Content

### Header Section
- **Title:** "Surgical Shopping List"
- **Unit:** Burns Plastic and Reconstructive Surgery Unit
- **Doctors:** Drs Okwesili / Nnadi / Eze
- **Institution:** Department of Surgery, University of Nigeria Teaching Hospital, Enugu, Nigeria

### Patient Information Box
- Patient Full Name
- Hospital Number
- Date Generated

### Category
- Shows selected category: Surgery / Wound Dressing / Bedside Debridement

### Items Table
Columns:
- **Item** - Full item name
- **Category** - Item category
- **Qty** - Quantity selected
- **Unit** - Unit of measurement

### Summary Section
- Total Items: Count of different items
- Total Quantity: Sum of all quantities

### Footer
- Generation date and patient name
- Verification message: "Please verify all items before purchase. Quantities may vary based on requirements."

---

## Tips and Best Practices

### Efficient Item Selection
1. **Use category filter first** to narrow down options
2. **Then use search** for specific items
3. **Add similar items together** (e.g., all sutures, then all dressings)

### Quantity Planning
- Review procedure requirements before starting
- Consider backup supplies
- Account for patient-specific needs
- Remember: minimum quantity is 1

### Common Item Combinations

#### For Wound Dressing:
- Sterile gloves
- Gauze packs
- Antiseptics (Povidone Iodine Solution)
- Dressings (Sofratulle, Gauze)
- Bandages (Crepe)
- Plaster

#### For Surgery:
- Surgical gloves (appropriate sizes)
- Sutures (various sizes/types)
- Surgical blades
- Sterile drapes and gowns
- Antiseptics
- Cannulas and IV fluids
- Antibiotics

#### For Bedside Debridement:
- Sterile gloves
- Surgical blades
- Antiseptics
- Local anesthetics
- Dressings
- Specimen containers

### Category Switching
- **Remember:** Changing procedure category clears your selection
- Complete one list before switching categories
- Generate PDF before switching if you want to save the list

### Patient Selection
- Search works on both full name and hospital number
- Recent patients appear first
- All patient details shown for verification

---

## Common Workflows

### Workflow 1: Quick Single-Item List
1. Select category
2. Search for specific item
3. Add item
4. Adjust quantity if needed
5. Generate PDF
6. Select patient
7. Done!

### Workflow 2: Comprehensive Surgical List
1. Select "Surgery" category
2. Filter by "Gloves" → Add surgical gloves
3. Filter by "Sutures" → Add required suture types
4. Filter by "Surgical Instruments" → Add blades
5. Filter by "Sterile Consumables" → Add drapes, gowns
6. Search "cannula" → Add required sizes
7. Search "antibiotic" → Add required antibiotics
8. Review all items and quantities
9. Generate PDF
10. Select patient

### Workflow 3: Standard Wound Dressing Kit
1. Select "Wound Dressing" category
2. Search "gloves" → Add
3. Search "gauze" → Add packs
4. Search "povidone" → Add solution
5. Search "sofratulle" → Add
6. Filter by "Bandages" → Add crepe bandages
7. Search "plaster" → Add
8. Review and adjust quantities
9. Generate PDF
10. Select patient

---

## Troubleshooting

### "No items found" message
- **Cause:** All matching items already selected
- **Solution:** Check your selected items list or clear search/filter

### Can't decrease quantity below 1
- **Cause:** Minimum quantity is 1 (by design)
- **Solution:** Use Remove button to remove item entirely

### Button says "Generate Shopping List" but nothing happens
- **Cause:** No items selected yet
- **Solution:** Add at least one item to your list

### Patient modal shows "No patients available"
- **Cause:** No patients in database
- **Solution:** Add patients through Patient Registration first

### Item disappeared after adding
- **Behavior:** This is correct - selected items don't show in browser
- **Location:** Check right panel "Selected Items"

---

## Keyboard Shortcuts

- **Tab** - Navigate between search and filter
- **Enter** - Confirm quantity input
- **Esc** - Close patient selector modal (click X button)
- **Type to search** - Search boxes auto-focus

---

## Mobile/Tablet Use

The interface is responsive:
- **Desktop:** 3-column layout (left: available, right: selected)
- **Tablet:** 2-column layout
- **Mobile:** Single column, scrollable sections

---

## Data Privacy

- All data stored locally in browser
- PDF generation happens client-side
- No data sent to external servers
- Patient information only included in downloaded PDF

---

## Support

For issues or questions:
1. Check this guide first
2. Verify patient database has entries
3. Clear browser cache if experiencing issues
4. Contact IT support if problems persist

---

## Quick Reference: Item Categories

| Category | Example Items | Count |
|----------|--------------|-------|
| Cannulas | Size 16-24 | 5 |
| Syringes | 2ml, 5ml, 10ml | 3 |
| IV Fluids | Normal Saline, Dextrose variants | 5 |
| Gloves | Neogloves, Surgical (7.5, 8.0) | 3 |
| Anesthetics | Xylocaine, Bupivacaine, Marcaine | 6 |
| Antibiotics | Cipro, Ceftriaxone, Levofloxacin | 7 |
| Sutures | Vicryl, Prolene/Nylon, Silk (various sizes) | 12 |
| Dressings | Sofratulle, Gauze, Foam, Silver | 10+ |
| Bandages | Crepe (4", 6"), Veil Band, POP | 4 |
| Surgical Instruments | Blades, Humby knife, Stapler | 8 |
| **Total Categories** | | **31** |
| **Total Items** | | **200+** |

---

**Version:** 1.0  
**Last Updated:** ${new Date().toLocaleDateString()}  
**Module:** Shopping List Generator  
**Author:** PLASTIC-SURGASSISSTANT Development Team
