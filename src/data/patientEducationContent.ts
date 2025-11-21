// WHO Guideline-based Patient Education Content
// Sources: WHO Safe Surgery Guidelines, WHO Wound Care Guidelines, WHO Diabetes Management

export interface EducationTopic {
  id: string;
  title: string;
  category: 'wound-care' | 'preop' | 'postop';
  icon: string;
  sections: {
    heading: string;
    content: string[];
  }[];
  references: string[];
}

export const patientEducationTopics: EducationTopic[] = [
  {
    id: 'diabetic-foot-care',
    title: 'Diabetic Foot Care',
    category: 'wound-care',
    icon: '🦶',
    sections: [
      {
        heading: 'Introduction',
        content: [
          'Diabetic foot care is essential to prevent serious complications.',
          'Diabetes can reduce blood flow and cause nerve damage (neuropathy) in your feet.',
          'Proper foot care can prevent infections, ulcers, and amputations.'
        ]
      },
      {
        heading: 'Daily Foot Inspection',
        content: [
          'Check your feet every day for cuts, blisters, redness, swelling, or nail problems.',
          'Use a mirror to check the bottom of your feet if you cannot see them easily.',
          'Call your doctor immediately if you notice any wounds or changes.',
          'Check between your toes for athlete\'s foot, cracks, or peeling skin.'
        ]
      },
      {
        heading: 'Foot Hygiene',
        content: [
          'Wash your feet daily with lukewarm water and mild soap.',
          'Test water temperature with your elbow, not your feet (neuropathy may affect sensation).',
          'Dry feet thoroughly, especially between the toes.',
          'Apply moisturizing lotion to dry skin, but NOT between toes.',
          'Avoid soaking feet for long periods.'
        ]
      },
      {
        heading: 'Nail Care',
        content: [
          'Trim toenails straight across and file the edges.',
          'Do not cut nails too short or cut corners (risk of ingrown nails).',
          'If you have difficulty, seek professional podiatry care.',
          'Never use sharp objects to clean under nails.'
        ]
      },
      {
        heading: 'Proper Footwear',
        content: [
          'Always wear shoes and socks - never walk barefoot, even indoors.',
          'Wear well-fitting shoes that do not rub or pinch.',
          'Check inside shoes for foreign objects before wearing.',
          'Choose seamless socks that do not bunch up.',
          'Break in new shoes gradually (1-2 hours per day).',
          'Avoid high heels, pointed toes, and open-toed shoes.'
        ]
      },
      {
        heading: 'Blood Sugar Control',
        content: [
          'Maintain good blood glucose control (target HbA1c < 7%).',
          'High blood sugar slows healing and increases infection risk.',
          'Monitor blood sugar levels as directed by your doctor.',
          'Take medications as prescribed.'
        ]
      },
      {
        heading: 'Warning Signs - Seek Immediate Care',
        content: [
          'Any cut, blister, or wound that does not heal within 2-3 days',
          'Redness, warmth, or swelling in any part of the foot',
          'Pus or drainage from a wound',
          'Fever with foot pain',
          'Change in skin color (very pale, red, blue, or black)',
          'Numbness, tingling, or burning sensation',
          'Foul odor from foot or wound'
        ]
      },
      {
        heading: 'Additional Preventive Measures',
        content: [
          'Do not use heating pads or hot water bottles on feet.',
          'Avoid crossing legs when sitting (reduces circulation).',
          'Elevate feet when sitting to improve blood flow.',
          'Do not smoke - smoking reduces blood flow to feet.',
          'Exercise regularly to improve circulation.',
          'Have regular foot examinations by healthcare provider (at least annually).'
        ]
      }
    ],
    references: [
      'WHO Guidelines on the Prevention and Management of Diabetic Foot',
      'International Diabetes Federation Clinical Practice Recommendations',
      'WHO Integrated Health Services - Diabetes Care Module'
    ]
  },
  {
    id: 'leg-ulcer-positioning',
    title: 'Positioning and Limb Elevation for Leg Ulcers',
    category: 'wound-care',
    icon: '🛏️',
    sections: [
      {
        heading: 'Importance of Leg Elevation',
        content: [
          'Leg elevation helps reduce swelling (edema) and improves healing.',
          'Proper positioning improves blood circulation and reduces pain.',
          'Elevation should be part of your daily routine for optimal healing.'
        ]
      },
      {
        heading: 'Correct Elevation Technique',
        content: [
          'Elevate legs ABOVE heart level for maximum benefit.',
          'Use pillows to prop legs at a 30-45 degree angle.',
          'Support the entire leg from heel to thigh - do not bend at knee only.',
          'Place pillows lengthwise under the calf and thigh.',
          'Avoid pressure behind the knee (can restrict blood flow).'
        ]
      },
      {
        heading: 'Elevation Schedule',
        content: [
          'Elevate legs for 30 minutes, 3-4 times daily.',
          'Elevate legs while sleeping by raising the foot of the bed 6-8 inches.',
          'You may use blocks or books under bed legs, or a wedge pillow.',
          'Avoid prolonged periods without elevation during the day.'
        ]
      },
      {
        heading: 'Sitting Position',
        content: [
          'When sitting, keep legs elevated on a footstool or ottoman.',
          'Avoid sitting with legs hanging down for more than 30 minutes.',
          'Do not cross legs - this restricts blood flow.',
          'Use a recliner if available to maintain elevation.',
          'Avoid sitting in low chairs that make standing difficult.'
        ]
      },
      {
        heading: 'Movement and Exercise',
        content: [
          'Do ankle pumps: Move foot up and down 10 times every hour while sitting.',
          'Do ankle circles: Rotate foot in circles, 10 times each direction.',
          'Walk short distances regularly (as advised by doctor).',
          'Avoid standing still for long periods.',
          'Gentle movement helps circulation without causing strain.'
        ]
      },
      {
        heading: 'Compression Therapy',
        content: [
          'Wear compression stockings or bandages as prescribed.',
          'Apply compression in the morning before getting out of bed.',
          'Remove compression at night unless instructed otherwise.',
          'Check skin regularly under compression for pressure areas.',
          'Replace compression garments when they lose elasticity.'
        ]
      },
      {
        heading: 'Skin Care',
        content: [
          'Keep skin clean and moisturized (but not on the wound).',
          'Avoid scratching itchy skin around the ulcer.',
          'Protect skin from injury - wear long pants and proper footwear.',
          'Report any new wounds, redness, or changes immediately.'
        ]
      },
      {
        heading: 'What to Avoid',
        content: [
          'Do not apply heat directly to the leg (heating pads, hot water).',
          'Avoid tight clothing or shoes that restrict circulation.',
          'Do not massage the leg near the ulcer.',
          'Avoid prolonged hot baths or showers.',
          'Do not remove dressings unless instructed by healthcare provider.'
        ]
      }
    ],
    references: [
      'WHO Guidelines for the Management of Chronic Leg Ulcers',
      'WHO Wound Care Manual',
      'International Consensus on Venous Leg Ulcer Management'
    ]
  },
  {
    id: 'postop-spinal-anesthesia',
    title: 'Post-Operative Instructions: Spinal Anesthesia',
    category: 'postop',
    icon: '💉',
    sections: [
      {
        heading: 'What is Spinal Anesthesia?',
        content: [
          'Spinal anesthesia numbs the lower part of your body during surgery.',
          'Medication is injected into the spinal fluid in your lower back.',
          'You will be awake but feel no pain during the procedure.',
          'The numbing effect gradually wears off after surgery.'
        ]
      },
      {
        heading: 'Immediately After Surgery',
        content: [
          'You will remain in the recovery room until sensation and movement return.',
          'Expect numbness in legs for 2-6 hours after surgery.',
          'Do not attempt to stand or walk until cleared by nursing staff.',
          'Call for assistance when you need to use the bathroom.',
          'Nurses will check your blood pressure and sensation regularly.'
        ]
      },
      {
        heading: 'Position and Movement',
        content: [
          'Lie flat on your back for 6-12 hours if instructed (helps prevent headache).',
          'Use only one thin pillow under your head initially.',
          'When cleared, start with gentle leg movements while in bed.',
          'Dangle legs over side of bed before standing.',
          'Stand up slowly to avoid dizziness.',
          'Have someone assist you the first few times you walk.'
        ]
      },
      {
        heading: 'Preventing Spinal Headache',
        content: [
          'Drink plenty of fluids (8-10 glasses of water daily) unless restricted.',
          'Lie flat as directed for the specified time period.',
          'Avoid straining, heavy lifting, or sudden movements.',
          'If headache occurs, it typically worsens when sitting/standing.',
          'Report severe headache to your doctor immediately.'
        ]
      },
      {
        heading: 'Pain Management',
        content: [
          'Some back soreness at injection site is normal for 1-2 days.',
          'Take prescribed pain medication as directed.',
          'Apply ice pack to injection site if sore (20 minutes, wrapped in towel).',
          'Do not apply heat to the injection site.',
          'Report severe or increasing back pain immediately.'
        ]
      },
      {
        heading: 'Urination',
        content: [
          'Bladder sensation may be delayed - you may not feel the urge to urinate initially.',
          'You should urinate within 8 hours after surgery.',
          'Inform nurses if you cannot urinate or feel bladder fullness.',
          'A temporary catheter may be needed if you cannot urinate.',
          'Drink adequate fluids to promote urination.'
        ]
      },
      {
        heading: 'Normal Recovery Symptoms',
        content: [
          'Mild back soreness at injection site',
          'Temporary numbness or tingling in legs (should resolve within 24 hours)',
          'Mild dizziness when first standing',
          'Fatigue for 1-2 days'
        ]
      },
      {
        heading: 'Warning Signs - Seek Immediate Care',
        content: [
          'Severe headache that worsens when sitting or standing',
          'Persistent numbness or weakness in legs beyond 24 hours',
          'Severe back pain, especially with fever',
          'Loss of bowel or bladder control',
          'Inability to urinate after 8 hours',
          'Severe dizziness or fainting',
          'Difficulty breathing or chest pain'
        ]
      },
      {
        heading: 'Activity Guidelines',
        content: [
          'Rest for 24 hours after surgery.',
          'Avoid driving for 24 hours.',
          'Avoid heavy lifting (>10 lbs) for 24-48 hours.',
          'Resume normal activities gradually as tolerated.',
          'Follow specific activity restrictions given by your surgeon.'
        ]
      }
    ],
    references: [
      'WHO Safe Surgery Saves Lives Guidelines',
      'WHO Standards for Neuraxial Anesthesia',
      'International Guidelines for Post-Anesthesia Care'
    ]
  },
  {
    id: 'postop-general-anesthesia',
    title: 'Post-Operative Instructions: General Anesthesia',
    category: 'postop',
    icon: '😴',
    sections: [
      {
        heading: 'Recovery from General Anesthesia',
        content: [
          'General anesthesia affects your entire body and requires complete recovery time.',
          'You were completely asleep during surgery and will wake up gradually.',
          'Recovery time varies but typically takes 24-48 hours for full alertness.',
          'Side effects are common and usually temporary.'
        ]
      },
      {
        heading: 'First 24 Hours',
        content: [
          'Have a responsible adult stay with you for 24 hours.',
          'Rest and sleep as much as needed - fatigue is normal.',
          'Avoid making important decisions or signing legal documents.',
          'Do not drive, operate machinery, or drink alcohol for 24 hours.',
          'Take medications only as prescribed.',
          'Keep your follow-up appointment scheduled before discharge.'
        ]
      },
      {
        heading: 'Nausea and Vomiting',
        content: [
          'Nausea is common in the first 24 hours after general anesthesia.',
          'Take anti-nausea medication as prescribed.',
          'Start with clear liquids (water, broth, juice) when drinking.',
          'Progress to light foods (crackers, toast) as tolerated.',
          'Avoid greasy, spicy, or heavy foods for 24 hours.',
          'Eat small, frequent meals rather than large portions.',
          'If vomiting persists beyond 24 hours, contact your doctor.'
        ]
      },
      {
        heading: 'Diet Progression',
        content: [
          'Stage 1 (first few hours): Sips of water or ice chips',
          'Stage 2 (when tolerated): Clear liquids (juice, broth, gelatin)',
          'Stage 3 (next day): Soft diet (toast, crackers, bananas, rice)',
          'Stage 4 (when ready): Regular diet',
          'Drink plenty of fluids to stay hydrated.',
          'Avoid caffeine and carbonated beverages initially.'
        ]
      },
      {
        heading: 'Sore Throat and Hoarseness',
        content: [
          'Throat discomfort is common from the breathing tube used during surgery.',
          'Sip warm liquids (tea, warm water) to soothe throat.',
          'Use throat lozenges or gargle with warm salt water.',
          'Symptoms typically resolve within 2-3 days.',
          'Report severe throat pain or difficulty swallowing.'
        ]
      },
      {
        heading: 'Confusion and Memory',
        content: [
          'Temporary confusion, fuzzy thinking, or memory gaps are normal.',
          'Older adults may experience more prolonged confusion.',
          'This typically improves within 24-48 hours.',
          'Avoid stressful or complex tasks during recovery.',
          'If confusion persists beyond 48 hours, contact your doctor.'
        ]
      },
      {
        heading: 'Dizziness and Weakness',
        content: [
          'Get up slowly from lying or sitting positions.',
          'Sit on the edge of the bed before standing.',
          'Have assistance when walking the first few times.',
          'Avoid sudden movements or position changes.',
          'Stay well-hydrated and eat regular meals.'
        ]
      },
      {
        heading: 'Pain Management',
        content: [
          'Take pain medication as prescribed - do not wait until pain is severe.',
          'Set an alarm to take medications on schedule.',
          'Report inadequate pain control to your doctor.',
          'Use non-medication methods: ice, elevation, rest.',
          'Avoid aspirin or ibuprofen unless approved by your surgeon.'
        ]
      },
      {
        heading: 'Activity and Rest',
        content: [
          'Rest frequently - your body needs energy to heal.',
          'Take short walks to prevent blood clots and improve circulation.',
          'Avoid strenuous activity, heavy lifting, or exercise for as directed.',
          'Gradually increase activity as you feel stronger.',
          'Listen to your body - rest when tired.'
        ]
      },
      {
        heading: 'Breathing Exercises',
        content: [
          'Take 10 deep breaths every hour while awake.',
          'Use incentive spirometer if provided (breathe in slowly and deeply).',
          'Cough gently to clear mucus (support incision with pillow if needed).',
          'This helps prevent pneumonia and lung complications.',
          'Continue exercises for at least 3 days after surgery.'
        ]
      },
      {
        heading: 'Warning Signs - Contact Doctor',
        content: [
          'Fever above 38.5°C (101.3°F)',
          'Severe or worsening pain not relieved by medication',
          'Persistent nausea/vomiting beyond 24 hours',
          'Inability to urinate or drink fluids',
          'Shortness of breath or chest pain',
          'Confusion or disorientation lasting beyond 48 hours',
          'Signs of surgical site infection (increasing redness, swelling, drainage)',
          'Leg pain, swelling, or warmth (possible blood clot)'
        ]
      }
    ],
    references: [
      'WHO Safe Surgery Checklist',
      'WHO Guidelines for Safe Anesthesia Practice',
      'International Standards for Post-Anesthesia Care Units'
    ]
  },
  {
    id: 'postop-skin-graft',
    title: 'Post-Operative Instructions: Skin Grafting',
    category: 'postop',
    icon: '🩹',
    sections: [
      {
        heading: 'Understanding Your Skin Graft',
        content: [
          'A skin graft involves transferring healthy skin to cover a wound.',
          'The donor site is where skin was taken from your body.',
          'The recipient site is where the graft was placed.',
          'Both areas require special care for successful healing.'
        ]
      },
      {
        heading: 'Graft Site (Recipient) Care',
        content: [
          'Keep the graft site completely immobilized as instructed (usually 3-7 days).',
          'Do not remove or disturb the dressing unless instructed.',
          'Elevate the grafted area above heart level as much as possible.',
          'Avoid any pressure, friction, or trauma to the graft.',
          'The graft must "take" (attach and establish blood supply) for success.'
        ]
      },
      {
        heading: 'Donor Site Care',
        content: [
          'The donor site will be covered with a special dressing.',
          'Some oozing or bleeding through the dressing is normal initially.',
          'Keep the donor site clean and dry.',
          'Do not remove donor site dressing unless instructed.',
          'Donor site typically heals in 2-3 weeks.',
          'Donor site may be more painful than graft site initially.'
        ]
      },
      {
        heading: 'Immobilization and Position',
        content: [
          'Strict immobilization is critical for graft survival.',
          'Use splints, casts, or positioning devices as prescribed.',
          'Do not move the grafted area for the specified period.',
          'Ask for help with personal care to avoid movement.',
          'Sleep in recommended position - use pillows for support.'
        ]
      },
      {
        heading: 'Elevation',
        content: [
          'Elevate grafted limb above heart level continuously for first 3-5 days.',
          'Use pillows to support entire limb, not just the graft area.',
          'Proper elevation reduces swelling and improves graft survival.',
          'Continue elevation when resting even after initial period.',
          'Avoid dependent position (letting limb hang down) for extended periods.'
        ]
      },
      {
        heading: 'Dressing Changes',
        content: [
          'First dressing change is usually done by surgeon after 3-7 days.',
          'Do not change dressings yourself unless specifically instructed.',
          'If you must change dressings: wash hands thoroughly, use sterile technique.',
          'Gently clean around edges with saline if instructed.',
          'Report any foul odor, excessive drainage, or dressing saturation.'
        ]
      },
      {
        heading: 'Pain Management',
        content: [
          'Some pain is normal, especially at donor site.',
          'Take pain medication as prescribed, not just when pain is severe.',
          'Pain should gradually decrease over first week.',
          'Donor site pain often peaks at 24-48 hours.',
          'Use elevation and rest to minimize discomfort.',
          'Report severe or increasing pain immediately.'
        ]
      },
      {
        heading: 'Signs of Graft Success',
        content: [
          'Graft appears pink or light red (good blood supply)',
          'Graft feels warm to touch',
          'Minimal or decreasing drainage',
          'Edges of graft appear to be adhering',
          'Reduced swelling over time'
        ]
      },
      {
        heading: 'Signs of Graft Failure - Seek Immediate Care',
        content: [
          'Graft appears dark, purple, black, or very pale',
          'Graft feels cold to touch',
          'Foul-smelling drainage or pus',
          'Increasing redness around graft',
          'Fever above 38°C (100.4°F)',
          'Graft appears to be separating or lifting',
          'Bleeding from graft site',
          'Severe or worsening pain'
        ]
      },
      {
        heading: 'Activity Restrictions',
        content: [
          'No weight-bearing on grafted leg for specified period (usually 7-14 days).',
          'Use crutches, wheelchair, or walker as prescribed.',
          'No swimming, bathing, or soaking graft for at least 2 weeks.',
          'Avoid sun exposure to graft and donor sites for 6-12 months.',
          'No strenuous activity or heavy lifting as directed.',
          'Gradually resume activities only when cleared by surgeon.'
        ]
      },
      {
        heading: 'Long-term Care',
        content: [
          'Grafted skin may look different from surrounding skin permanently.',
          'Protect graft from sun with SPF 50+ sunscreen or clothing.',
          'Moisturize graft area with unscented lotion after healed.',
          'Grafted skin may not sweat normally - avoid overheating.',
          'Massage graft gently (after healed) to prevent contracture if instructed.',
          'Donor site scar will fade but may remain visible.',
          'Use silicone sheets or scar cream if recommended.'
        ]
      },
      {
        heading: 'Nutrition for Healing',
        content: [
          'Eat high-protein foods: meat, fish, eggs, beans, dairy.',
          'Increase vitamin C: citrus fruits, berries, tomatoes.',
          'Stay well-hydrated: drink 8-10 glasses of water daily.',
          'Take vitamin supplements if prescribed.',
          'Adequate nutrition is essential for graft success.',
          'Avoid smoking - it severely impairs healing.'
        ]
      }
    ],
    references: [
      'WHO Guidelines on Wound Management and Skin Grafting',
      'International Society for Burn Injuries - Skin Graft Protocol',
      'WHO Surgical Care Manual - Plastic Surgery Chapter'
    ]
  },
  {
    id: 'postop-non-abdominal',
    title: 'Post-Operative Instructions: Non-Abdominal Surgery',
    category: 'postop',
    icon: '🏥',
    sections: [
      {
        heading: 'General Post-Operative Care',
        content: [
          'These instructions apply to surgeries not involving the abdomen.',
          'Follow specific instructions from your surgeon - they take priority.',
          'Recovery time varies depending on the type of surgery.',
          'Proper care helps prevent complications and speeds recovery.'
        ]
      },
      {
        heading: 'Wound Care',
        content: [
          'Keep surgical dressing clean and dry for first 48 hours.',
          'Do not remove initial dressing unless instructed.',
          'After 48 hours, you may shower if incision is sealed.',
          'Pat wound dry gently - do not rub.',
          'Change dressing as instructed using clean hands.',
          'Slight redness around incision edges is normal.',
          'Clean incision with saline or as directed.',
          'Do not apply ointments unless prescribed.'
        ]
      },
      {
        heading: 'Signs of Infection - Seek Care',
        content: [
          'Increasing redness spreading from incision',
          'Swelling that worsens after 48 hours',
          'Pus or cloudy drainage from wound',
          'Foul odor from incision',
          'Fever above 38.5°C (101.3°F)',
          'Red streaks extending from wound',
          'Wound feels hot to touch',
          'Increasing pain after initial 48 hours'
        ]
      },
      {
        heading: 'Pain Management',
        content: [
          'Pain is typically worst in first 24-48 hours.',
          'Take prescribed pain medication before pain becomes severe.',
          'Take medication with food to prevent stomach upset.',
          'Use ice packs (20 minutes on, 40 minutes off) for first 48 hours.',
          'After 48 hours, heat may be more comfortable than ice.',
          'Elevate surgical site to reduce swelling and pain.',
          'Rest and limit activity to allow healing.'
        ]
      },
      {
        heading: 'Swelling Management',
        content: [
          'Some swelling is normal for 3-5 days after surgery.',
          'Elevate surgical site above heart level when possible.',
          'Use ice packs for first 48-72 hours.',
          'Wear compression garments if provided.',
          'Avoid dependent position (limb hanging down) for long periods.',
          'Gentle movement helps reduce swelling - avoid complete immobility.'
        ]
      },
      {
        heading: 'Activity Guidelines',
        content: [
          'Rest for first 24-48 hours.',
          'Walk short distances every 2-3 hours to prevent blood clots.',
          'Avoid strenuous activity for timeframe specified by surgeon.',
          'No heavy lifting (typically >5-10 lbs) for at least 2 weeks.',
          'Gradually increase activity as tolerated.',
          'Stop activity if pain increases significantly.',
          'Return to work only when cleared by surgeon.'
        ]
      },
      {
        heading: 'Diet and Hydration',
        content: [
          'Drink plenty of fluids (8-10 glasses daily) unless restricted.',
          'Eat balanced diet rich in protein for healing.',
          'Include fruits and vegetables for vitamins.',
          'Avoid alcohol while taking pain medications.',
          'Take stool softeners if prescribed (pain medications cause constipation).',
          'Eat small, frequent meals if you have nausea.'
        ]
      },
      {
        heading: 'Bathing and Hygiene',
        content: [
          'Avoid soaking in bathtub for first 2 weeks or as directed.',
          'You may shower after 48 hours if incision is sealed and dry.',
          'Keep wound covered with waterproof dressing during shower.',
          'Pat dry gently after shower - do not rub.',
          'Avoid hot tubs, swimming pools, or natural bodies of water until healed.',
          'Do not scrub incision.'
        ]
      },
      {
        heading: 'Medications',
        content: [
          'Take all prescribed medications as directed.',
          'Complete entire course of antibiotics if prescribed.',
          'Do not take aspirin or NSAIDs unless approved by surgeon.',
          'Resume regular medications unless told to stop.',
          'Ask before taking new medications or supplements.',
          'Report any medication side effects to your doctor.'
        ]
      },
      {
        heading: 'Sleep and Rest',
        content: [
          'Sleep with surgical site elevated on pillows if possible.',
          'Use extra pillows to find comfortable position.',
          'Sleep on opposite side from surgery if applicable.',
          'Take short naps during day to aid recovery.',
          'Adequate rest is essential for healing.',
          'Fatigue is normal for 1-2 weeks.'
        ]
      },
      {
        heading: 'Follow-up Care',
        content: [
          'Attend all scheduled follow-up appointments.',
          'Sutures/staples typically removed in 7-14 days.',
          'Bring list of questions to appointments.',
          'Report any concerns between appointments.',
          'Do not remove sutures yourself.',
          'Schedule follow-up before leaving hospital if not already done.'
        ]
      },
      {
        heading: 'Warning Signs - Seek Immediate Care',
        content: [
          'Signs of infection (see above)',
          'Excessive bleeding from incision',
          'Wound opens or edges separate',
          'Chest pain or difficulty breathing',
          'Sudden severe pain',
          'Numbness or tingling that worsens',
          'Leg swelling, pain, or warmth (possible blood clot)',
          'Inability to urinate',
          'Persistent fever or chills'
        ]
      }
    ],
    references: [
      'WHO Safe Surgery Checklist',
      'WHO Guidelines for Safe Surgery',
      'International Consensus on Post-Operative Care'
    ]
  },
  {
    id: 'preop-general-anesthesia',
    title: 'Pre-Operative Instructions: General Anesthesia',
    category: 'preop',
    icon: '📋',
    sections: [
      {
        heading: 'What is General Anesthesia?',
        content: [
          'General anesthesia makes you completely unconscious during surgery.',
          'You will not feel pain, move, or remember the procedure.',
          'An anesthesiologist monitors you throughout surgery.',
          'Proper preparation ensures safety and reduces complications.'
        ]
      },
      {
        heading: 'Fasting Instructions (NPO - Nothing by Mouth)',
        content: [
          'No solid food for 8 hours before surgery.',
          'No milk, juice with pulp, or drinks for 6 hours before surgery.',
          'Clear liquids (water, black coffee, clear juice) allowed up to 2 hours before surgery.',
          'No chewing gum or candy.',
          'Even small amounts can cause serious complications.',
          'If you accidentally eat or drink, inform your surgical team immediately.',
          'Surgery may need to be postponed for your safety.'
        ]
      },
      {
        heading: 'Medications',
        content: [
          'Bring a list of ALL medications, vitamins, and supplements you take.',
          'Continue heart, blood pressure, and seizure medications with small sip of water.',
          'STOP blood thinners as directed (aspirin, warfarin, clopidogrel).',
          'STOP herbal supplements 7 days before surgery.',
          'STOP diabetes medications morning of surgery unless instructed otherwise.',
          'Bring inhalers if you have asthma.',
          'Ask your doctor specifically which medications to take on surgery day.'
        ]
      },
      {
        heading: 'Smoking and Alcohol',
        content: [
          'STOP smoking at least 24 hours before surgery (ideally 4-6 weeks).',
          'Smoking increases risk of complications and delays healing.',
          'Do not drink alcohol for 24 hours before surgery.',
          'Inform anesthesiologist if you regularly use tobacco or alcohol.',
          'Withdrawal symptoms can affect anesthesia safety.'
        ]
      },
      {
        heading: 'Medical Conditions to Report',
        content: [
          'Recent cold, cough, or respiratory infection',
          'Fever or current illness',
          'Loose or damaged teeth, dental work',
          'Allergies (especially to medications or latex)',
          'Previous problems with anesthesia',
          'Sleep apnea or snoring',
          'Heartburn or acid reflux',
          'Pregnancy or possibility of pregnancy'
        ]
      },
      {
        heading: 'Night Before Surgery',
        content: [
          'Shower or bathe using antibacterial soap if provided.',
          'Wash surgical site area thoroughly.',
          'Do not apply lotions, creams, or powders to body.',
          'Remove all nail polish and artificial nails.',
          'Get adequate sleep - go to bed at reasonable hour.',
          'Prepare loose, comfortable clothing for after surgery.',
          'Pack small bag if overnight stay expected.'
        ]
      },
      {
        heading: 'Day of Surgery',
        content: [
          'Do not eat or drink (see fasting instructions above).',
          'Brush teeth gently but do not swallow water.',
          'Take approved medications with tiny sip of water only.',
          'Do not wear makeup, hair products, or perfume.',
          'Remove all jewelry, piercings, and body accessories.',
          'Remove contact lenses, glasses, hearing aids (bring cases).',
          'Wear comfortable, loose clothing.',
          'Leave valuables at home.',
          'Arrive at hospital at designated time (usually 2 hours before surgery).'
        ]
      },
      {
        heading: 'Arrange Transportation and Support',
        content: [
          'You CANNOT drive yourself home after general anesthesia.',
          'Arrange for responsible adult to drive you home and stay with you.',
          'Support person should stay at hospital during surgery if possible.',
          'Plan for someone to stay with you for 24 hours after surgery.',
          'Arrange for help with childcare, pets, and household tasks.',
          'Have phone numbers for emergency contact readily available.'
        ]
      },
      {
        heading: 'Pre-Operative Assessment',
        content: [
          'Complete all required pre-operative tests (blood work, ECG, X-rays).',
          'Attend pre-operative clinic appointment if scheduled.',
          'Bring results of any outside tests with you.',
          'Inform surgical team of any changes in health since last visit.',
          'Ask questions - make sure you understand the procedure and risks.'
        ]
      },
      {
        heading: 'What to Bring',
        content: [
          'Photo identification and insurance cards',
          'List of current medications with dosages',
          'CPAP machine if you use one for sleep apnea',
          'Comfortable loose clothing to wear home',
          'Slip-on shoes (no laces)',
          'Small bag for overnight stay (if applicable)',
          'Leave valuables, jewelry, and large amounts of money at home'
        ]
      },
      {
        heading: 'Questions to Ask Your Doctor',
        content: [
          'Which of my regular medications should I take on surgery day?',
          'When exactly should I stop eating and drinking?',
          'What are the risks specific to my medical conditions?',
          'How long will I be in the hospital?',
          'What pain management plan will be used?',
          'When can I return to work and normal activities?',
          'What symptoms should I watch for after surgery?',
          'Who do I call if I have concerns after discharge?'
        ]
      },
      {
        heading: 'When to Contact Your Doctor Before Surgery',
        content: [
          'You develop fever, cold, or infection',
          'You have questions about which medications to take',
          'You are not sure about fasting instructions',
          'You have unexpected changes in your health',
          'You cannot arrange transportation',
          'You need to cancel or reschedule'
        ]
      }
    ],
    references: [
      'WHO Safe Surgery Checklist',
      'American Society of Anesthesiologists - Pre-Operative Fasting Guidelines',
      'WHO Guidelines for Safe Anesthesia Practice'
    ]
  },
  {
    id: 'preop-spinal-anesthesia',
    title: 'Pre-Operative Instructions: Spinal Anesthesia',
    category: 'preop',
    icon: '💉',
    sections: [
      {
        heading: 'What is Spinal Anesthesia?',
        content: [
          'Spinal anesthesia numbs the lower half of your body.',
          'Medication is injected into spinal fluid in your lower back.',
          'You will be awake but feel no pain during surgery.',
          'Used for surgeries on legs, hips, lower abdomen, and pelvic area.',
          'The procedure takes only a few minutes to perform.'
        ]
      },
      {
        heading: 'Fasting Instructions',
        content: [
          'No solid food for 6-8 hours before surgery.',
          'Clear liquids (water, black coffee, clear juice) allowed up to 2 hours before.',
          'Do not drink milk, juice with pulp, or eat anything solid.',
          'No chewing gum or candy.',
          'Fasting reduces risk of nausea and complications.',
          'If you accidentally eat or drink, tell your surgical team immediately.'
        ]
      },
      {
        heading: 'Medications',
        content: [
          'Bring complete list of all medications and supplements.',
          'Continue blood pressure and heart medications with small sip of water.',
          'STOP blood thinners as directed by your doctor (usually 5-7 days before).',
          'STOP aspirin and anti-inflammatory medications as directed.',
          'STOP herbal supplements one week before surgery.',
          'Diabetes medications: usually held on morning of surgery.',
          'Confirm with your doctor exactly which medications to take.'
        ]
      },
      {
        heading: 'Medical Conditions to Report',
        content: [
          'Back problems, previous back surgery, or spinal issues',
          'Bleeding disorders or easy bruising',
          'Neurological conditions or nerve problems',
          'Allergies to medications or local anesthetics',
          'Current infection or fever',
          'Pregnancy or possibility of pregnancy',
          'Previous problems with spinal or epidural anesthesia',
          'Taking blood thinners or anticoagulants'
        ]
      },
      {
        heading: 'Night Before Surgery',
        content: [
          'Shower or bathe using antibacterial soap if provided.',
          'Pay special attention to cleaning your back.',
          'Do not apply lotions, oils, or creams to back.',
          'Remove nail polish from fingers and toes.',
          'Get adequate rest and sleep.',
          'Review your fasting start time.',
          'Set alarm to ensure timely arrival at hospital.'
        ]
      },
      {
        heading: 'Day of Surgery - What to Do',
        content: [
          'Do not eat or drink per fasting instructions.',
          'Take approved medications with tiny sip of water only.',
          'Shower if desired, but do not apply products to back.',
          'Wear comfortable, loose-fitting clothing.',
          'Remove all jewelry, piercings, body jewelry.',
          'Remove contact lenses (bring glasses if needed).',
          'Do not wear makeup, nail polish, or perfume.',
          'Arrive at hospital at designated time.'
        ]
      },
      {
        heading: 'What to Expect During Spinal Placement',
        content: [
          'You will sit or lie on your side with back curved.',
          'Your back will be cleaned with antiseptic solution (feels cold).',
          'You will feel pressure during injection, but minimal pain.',
          'Numbness in legs begins within 5-15 minutes.',
          'You may feel tingling or warmth as medication works.',
          'You will be awake but lower body will be numb.',
          'Tell anesthesiologist immediately if you feel pain during surgery.'
        ]
      },
      {
        heading: 'Preventing Spinal Headache',
        content: [
          'Drink plenty of fluids the day before surgery (if not restricted).',
          'Stay well-hydrated after surgery.',
          'Plan to lie flat for several hours after surgery if instructed.',
          'Spinal headache occurs in small percentage of patients.',
          'Risk is higher in younger patients and women.',
          'Most headaches resolve with rest and fluids.',
          'Severe headaches can be treated effectively if they occur.'
        ]
      },
      {
        heading: 'Transportation and Support',
        content: [
          'You CANNOT drive yourself home after spinal anesthesia.',
          'Arrange for responsible adult to drive you home.',
          'Plan for someone to stay with you for 24 hours.',
          'You will not be able to walk immediately after surgery.',
          'Arrange help with stairs if you have them at home.',
          'Organize assistance with childcare and household tasks.'
        ]
      },
      {
        heading: 'What to Bring',
        content: [
          'Photo ID and insurance information',
          'List of medications with dosages',
          'Any recent test results or medical records',
          'Comfortable, loose clothing to wear home',
          'Slip-on shoes (you may have limited bending ability)',
          'Small pillow for car ride home',
          'Leave valuables and jewelry at home'
        ]
      },
      {
        heading: 'Questions to Ask',
        content: [
          'How long will the numbness last?',
          'When can I eat and drink after surgery?',
          'Will I need to lie flat after surgery? For how long?',
          'What are my options if I feel pain during surgery?',
          'What are the risks specific to spinal anesthesia?',
          'How will my blood thinner schedule be managed?',
          'When can I resume normal activities?',
          'What pain management will I have after surgery?'
        ]
      },
      {
        heading: 'When to Call Your Doctor Before Surgery',
        content: [
          'You develop a fever or infection',
          'You have new back pain or neurological symptoms',
          'You are unsure about medication instructions',
          'You have questions about fasting',
          'You cannot arrange transportation',
          'Your health status changes',
          'You need to reschedule'
        ]
      }
    ],
    references: [
      'WHO Standards for Neuraxial Anesthesia',
      'WHO Safe Surgery Guidelines',
      'International Guidelines for Regional Anesthesia'
    ]
  },
  {
    id: 'preop-local-anesthesia',
    title: 'Pre-Operative Instructions: Local Anesthesia',
    category: 'preop',
    icon: '🏥',
    sections: [
      {
        heading: 'What is Local Anesthesia?',
        content: [
          'Local anesthesia numbs only a specific small area of your body.',
          'You remain fully awake and alert during the procedure.',
          'Medication is injected around the surgical site.',
          'Used for minor surgeries, biopsies, wound repairs, and small procedures.',
          'You will feel pressure but no pain in the numb area.'
        ]
      },
      {
        heading: 'Fasting - Usually NOT Required',
        content: [
          'For most local anesthesia procedures, you CAN eat and drink normally.',
          'Eat a light meal 2-3 hours before your appointment.',
          'Avoid heavy, greasy meals.',
          'Stay well-hydrated.',
          'If sedation will also be used, you will receive specific fasting instructions.',
          'Confirm fasting requirements with your surgical team.'
        ]
      },
      {
        heading: 'Medications',
        content: [
          'Take your regular medications as prescribed unless told otherwise.',
          'Bring a list of all medications, vitamins, and supplements.',
          'Blood pressure and heart medications should be continued.',
          'Diabetes medications can usually be taken normally.',
          'Blood thinners: ask your doctor - may need to be stopped for some procedures.',
          'Inform your doctor about aspirin or anti-inflammatory use.',
          'Report all allergies, especially to local anesthetics (lidocaine, novocaine).'
        ]
      },
      {
        heading: 'Allergies and Reactions',
        content: [
          'Inform your doctor if you have allergies to local anesthetics.',
          'Tell your doctor about any dental anesthetic reactions.',
          'Report allergies to "caine" medications (lidocaine, benzocaine, novocaine).',
          'Mention allergies to epinephrine or preservatives.',
          'Previous swelling, rash, or breathing problems with numbing medication.',
          'Alternative anesthetics are available if you have allergies.'
        ]
      },
      {
        heading: 'Medical Conditions to Report',
        content: [
          'Heart disease or irregular heart rhythm',
          'Liver disease',
          'Bleeding disorders',
          'Active infection near surgical site',
          'Pregnancy or possibility of pregnancy',
          'Anxiety or needle phobia (sedation may be offered)',
          'Previous adverse reactions to local anesthesia'
        ]
      },
      {
        heading: 'Day of Procedure',
        content: [
          'Shower or bathe normally.',
          'Clean the surgical area thoroughly with soap and water.',
          'Do not apply lotions, creams, or makeup to surgical site.',
          'Wear comfortable, loose-fitting clothing.',
          'Wear clothing that allows easy access to surgical area.',
          'Arrive at scheduled time - local procedures usually run on time.',
          'Bring photo ID and insurance information.'
        ]
      },
      {
        heading: 'What to Expect',
        content: [
          'The area will be cleaned with antiseptic (may feel cold).',
          'You will feel a small pinch or sting when anesthetic is injected.',
          'Burning sensation for 10-20 seconds is normal as medication works.',
          'Numbness develops within 2-5 minutes.',
          'You may feel pressure, pushing, or tugging, but no pain.',
          'Tell your doctor immediately if you feel pain.',
          'Procedure usually takes 15-60 minutes depending on complexity.'
        ]
      },
      {
        heading: 'After the Procedure',
        content: [
          'Numbness typically lasts 2-4 hours.',
          'Avoid eating hot foods or drinks while mouth/face is numb (risk of burns).',
          'Protect numb area from injury - you cannot feel pain while numb.',
          'Do not scratch, rub, or bump the surgical site.',
          'Slight swelling or bruising at injection site is normal.',
          'Mild tenderness may develop as numbness wears off.'
        ]
      },
      {
        heading: 'Transportation',
        content: [
          'You can usually drive yourself home after local anesthesia alone.',
          'If sedation or anxiety medication was given, you CANNOT drive.',
          'Arrange for a driver if you received any sedation.',
          'If you feel dizzy or lightheaded, do not drive.',
          'Public transportation or taxi is acceptable if you feel well.'
        ]
      },
      {
        heading: 'Activity After Procedure',
        content: [
          'Most people can return to normal activities immediately.',
          'Follow specific activity restrictions given by your surgeon.',
          'Avoid strenuous activity for 24 hours if procedure was extensive.',
          'Keep surgical area clean and dry as instructed.',
          'Resume work and normal routine as tolerated.',
          'Avoid alcohol for 24 hours.'
        ]
      },
      {
        heading: 'Wound Care',
        content: [
          'Leave bandage in place as instructed (usually 24 hours).',
          'Keep area clean and dry.',
          'Follow specific wound care instructions provided.',
          'Watch for signs of infection (redness, swelling, pus, fever).',
          'Take pain medication as prescribed.',
          'Apply ice if swelling occurs (20 minutes on, 40 minutes off).'
        ]
      },
      {
        heading: 'Warning Signs - Contact Doctor',
        content: [
          'Signs of allergic reaction: rash, itching, difficulty breathing, swelling',
          'Prolonged numbness beyond 6 hours',
          'Increasing pain not relieved by medication',
          'Signs of infection: increasing redness, warmth, swelling, pus',
          'Fever above 38°C (100.4°F)',
          'Bleeding that does not stop with gentle pressure',
          'Dizziness, rapid heartbeat, or feeling faint',
          'Any concerning symptoms'
        ]
      },
      {
        heading: 'Questions to Ask',
        content: [
          'Do I need to fast or can I eat normally?',
          'Should I continue my regular medications?',
          'Will I need someone to drive me home?',
          'How long will the procedure take?',
          'When can I return to work?',
          'What are the specific risks for my procedure?',
          'How should I care for the wound?',
          'When should I return for follow-up?'
        ]
      }
    ],
    references: [
      'WHO Guidelines for Safe Local Anesthesia',
      'WHO Surgical Safety Checklist',
      'International Standards for Minor Surgical Procedures'
    ]
  }
];

// Helper function to get topics by category
export function getTopicsByCategory(category: 'wound-care' | 'preop' | 'postop'): EducationTopic[] {
  return patientEducationTopics.filter(topic => topic.category === category);
}

// Helper function to get topic by ID
export function getTopicById(id: string): EducationTopic | undefined {
  return patientEducationTopics.find(topic => topic.id === id);
}
