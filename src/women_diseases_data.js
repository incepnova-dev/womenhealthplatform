const diseases = [
    // Disease Data: 20 comprehensive entries for women's health conditions
    {
        name: 'Polycystic Ovary Syndrome (PCOS)',
        category: 'Hormonal Disorder',
        symptoms: [
            'Irregular or missed periods',
            'Excess facial and body hair (hirsutism)',
            'Acne and oily skin',
            'Weight gain or difficulty losing weight',
            'Thinning hair on scalp',
            'Dark patches of skin (insulin resistance)',
            'Difficulty getting pregnant'
        ],
        causes: [
            'Insulin resistance and high insulin levels',
            'Hormonal imbalance (excess androgens)',
            'Low-grade inflammation',
            'Genetic factors and family history'
        ],
        treatment: [
            'Birth control pills to regulate periods',
            'Metformin for insulin resistance',
            'Lifestyle changes (diet and exercise)',
            'Clomiphene for fertility treatment',
            'Hair removal treatments for hirsutism',
            'Weight management programs'
        ],
        prevention: 'Maintain healthy weight, regular exercise, balanced diet low in refined carbohydrates, stress management.',
        // ADDED IMAGE URL PROPERTY
        imageUrl: 'https://images.unsplash.com/photo-1596766465011-893322d99d3d?w=900&q=80',
        citation: '<a href="https://www.who.int/news-room/fact-sheets/detail/polycystic-ovary-syndrome" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">WHO. Polycystic ovary syndrome. 2025.</a> | <a href="https://www.mayoclinic.org/diseases-conditions/PCOS/symptoms-causes/syc-20353439" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Mayo Clinic. PCOS Symptoms & Causes. 2022.</a>'
    },
    {
        name: 'Endometriosis',
        category: 'Tissue Disorder',
        symptoms: [
            'Painful periods (dysmenorrhea)',
            'Chronic pelvic pain, often worse during periods',
            'Painful intercourse (dyspareunia)',
            'Painful bowel movements or urination',
            'Excessive bleeding',
            'Infertility or difficulty conceiving',
            'Fatigue, nausea, bloating'
        ],
        causes: [
            'Retrograde menstruation (menstrual blood flows back into pelvis)',
            'Induction theory (non-uterine cells convert to endometrial cells)',
            'Embryonic cell transformation',
            'Surgical scar implantation',
            'Immune system disorder'
        ],
        treatment: [
            'Pain medication (NSAIDs)',
            'Hormone therapy (birth control, GnRH agonists)',
            'Laparoscopic surgery to remove endometrial tissue',
            'Hysterectomy (last resort for severe cases)',
            'Acupuncture and dietary changes for symptom management'
        ],
        prevention: 'No proven prevention. Early diagnosis and management are key to preventing chronic pain and progression.',
        imageUrl: 'https://images.unsplash.com/photo-1579737151121-65476a213e45?w=900&q=80',
        citation: '<a href="https://www.mayoclinic.org/diseases-conditions/endometriosis/symptoms-causes/syc-20354656" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Mayo Clinic. Endometriosis Overview. 2023.</a>'
    },
    {
        name: 'Uterine Fibroids (Leiomyomas)',
        category: 'Benign Tumor',
        symptoms: [
            'Heavy menstrual bleeding',
            'Prolonged periods (over a week)',
            'Pelvic pressure or pain',
            'Frequent urination',
            'Constipation and backache',
            'Difficulty emptying bladder',
            'Anemia due to blood loss'
        ],
        causes: [
            'Genetic changes in the muscle cells',
            'Hormonal factors (Estrogen and Progesterone promotion)',
            'Extracellular matrix accumulation',
            'Family history'
        ],
        treatment: [
            'Medication to control bleeding (GnRH agonists, IUD)',
            'Non-invasive procedures (focused ultrasound surgery)',
            'Minimally invasive procedures (Uterine artery embolization)',
            'Surgery (Myomectomy to remove fibroids, Hysterectomy)',
            'Iron supplements for anemia'
        ],
        prevention: 'Maintaining a healthy weight, exercising regularly, and eating a diet rich in fruits and vegetables may lower the risk.',
        imageUrl: 'https://images.unsplash.com/photo-1520281200388-348507204f14?w=900&q=80',
        citation: '<a href="https://www.womenshealth.gov/a-z-topics/uterine-fibroids" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Office on Women’s Health. Uterine Fibroids. 2024.</a>'
    },
    {
        name: 'Breast Cancer',
        category: 'Oncological Condition',
        symptoms: [
            'Lump or thickening in the breast or underarm',
            'Change in the size or shape of the breast',
            'Dimpling or irritation of the breast skin',
            'Redness or flaky skin in the nipple area or breast',
            'Nipple discharge other than breast milk',
            'Inverted nipple',
            'Pain in the breast or nipple'
        ],
        causes: [
            'Genetic mutations (BRCA1 and BRCA2)',
            'Age (risk increases with age)',
            'Family history of breast cancer',
            'Obesity and lack of physical activity',
            'Alcohol consumption',
            'Exposure to radiation',
            'Hormone replacement therapy'
        ],
        treatment: [
            'Surgery (lumpectomy or mastectomy)',
            'Chemotherapy',
            'Radiation therapy',
            'Hormone therapy (e.g., Tamoxifen)',
            'Targeted drug therapy',
            'Immunotherapy'
        ],
        prevention: 'Regular self-exams and clinical exams, mammograms starting at 40-50, maintaining healthy weight, limiting alcohol, breastfeeding, and physical activity.',
        imageUrl: 'https://images.unsplash.com/photo-1627883391216-56214309e3e7?w=900&q=80',
        citation: '<a href="https://www.cdc.gov/cancer/breast/basic_info/prevention.htm" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">CDC. Breast Cancer Prevention. 2023.</a>'
    },
    {
        name: 'Cervical Cancer',
        category: 'Oncological Condition',
        symptoms: [
            'Abnormal vaginal bleeding (after intercourse, between periods)',
            'Pelvic pain or pain during intercourse',
            'Watery, bloody, or foul-smelling vaginal discharge',
            'Pain during urination (late stage)',
            'Swelling in the legs (late stage)',
            'Weight loss and fatigue (late stage)'
        ],
        causes: [
            'Human Papillomavirus (HPV) infection (most common cause)',
            'Multiple sexual partners',
            'Early sexual activity',
            'Smoking',
            'Weakened immune system',
            'Long-term use of oral contraceptives'
        ],
        treatment: [
            'Surgery (hysterectomy, conization)',
            'Radiation therapy',
            'Chemotherapy',
            'Targeted drug therapy (for advanced cases)'
        ],
        prevention: 'HPV vaccination (ages 9-26), regular Pap tests (starting at age 21) and HPV co-testing, practicing safe sex, not smoking.',
        imageUrl: 'https://images.unsplash.com/photo-1627883441551-766b44a30e71?w=900&q=80',
        citation: '<a href="https://www.who.int/news-room/fact-sheets/detail/cervical-cancer" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">WHO. Cervical Cancer Key Facts. 2024.</a>'
    },
    {
        name: 'Menopause and Perimenopause',
        category: 'Life Stage/Hormonal Shift',
        symptoms: [
            'Hot flashes and night sweats',
            'Irregular periods (perimenopause)',
            'Vaginal dryness and painful intercourse',
            'Mood changes (irritability, depression)',
            'Sleep disturbances (insomnia)',
            'Thinning hair and dry skin',
            'Decreased libido'
        ],
        causes: [
            'Natural decline in reproductive hormones (Estrogen and Progesterone)',
            'Aging (typically occurs in the late 40s or early 50s)',
            'Hysterectomy or Oophorectomy (surgical removal of ovaries)',
            'Chemotherapy or radiation therapy'
        ],
        treatment: [
            'Hormone Replacement Therapy (HRT)',
            'Lifestyle changes (diet, exercise, stress reduction)',
            'Non-hormonal medications for hot flashes (SSRIs)',
            'Vaginal estrogen creams for dryness',
            'Mindfulness and cognitive behavioral therapy (CBT)'
        ],
        prevention: 'Not preventable, as it is a natural life stage. Management focuses on minimizing symptoms and preventing long-term issues like osteoporosis and heart disease.',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900&q=80',
        citation: '<a href="https://www.nia.nih.gov/health/menopause/menopause-and-perimenopause" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">National Institute on Aging. Menopause Information. 2023.</a>'
    },
    {
        name: 'Vaginal Yeast Infection (Candidiasis)',
        category: 'Infection',
        symptoms: [
            'Itching and irritation in the vagina and vulva',
            'Burning sensation, especially during intercourse or urination',
            'Redness and swelling of the vulva',
            'Thick, white, odor-free vaginal discharge (cottage cheese appearance)',
            'Vaginal soreness and pain'
        ],
        causes: [
            'Overgrowth of the fungus Candida albicans',
            'Antibiotic use (reduces protective bacteria)',
            'Pregnancy and uncontrolled diabetes',
            'Weakened immune system',
            'Hormone changes (near menstrual cycle)'
        ],
        treatment: [
            'Antifungal creams, ointments, or suppositories (over-the-counter)',
            'Oral antifungal medication (e.g., Fluconazole) for severe cases',
            'Boric acid capsules (for resistant infections)'
        ],
        prevention: 'Wearing cotton underwear, avoiding tight-fitting clothes, not douching, changing out of wet swimwear promptly, and managing blood sugar if diabetic.',
        imageUrl: 'https://images.unsplash.com/photo-1543336332-9457222474f1?w=900&q=80',
        citation: '<a href="https://www.cdc.gov/fungal/diseases/candidiasis/genital/index.html" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">CDC. Genital Candidiasis. 2023.</a>'
    },
    {
        name: 'Urinary Tract Infection (UTI)',
        category: 'Infection',
        symptoms: [
            'Strong, persistent urge to urinate',
            'Burning sensation when urinating (dysuria)',
            'Passing frequent, small amounts of urine',
            'Cloudy, dark, or foul-smelling urine',
            'Pelvic pain in women',
            'Blood in the urine (hematuria)'
        ],
        causes: [
            'Bacteria (most commonly E. coli) entering the urinary tract',
            'Sexual activity and frequent intercourse',
            'Wiping back to front after using the toilet',
            'Use of certain birth control (diaphragms)',
            'Menopause (estrogen decline)'
        ],
        treatment: [
            'Antibiotics (e.g., Trimethoprim/sulfamethoxazole, Ciprofloxacin)',
            'Phenazopyridine for pain relief',
            'Increased fluid intake'
        ],
        prevention: 'Wiping front to back, drinking plenty of fluids, urinating after intercourse, avoiding irritating feminine products, and considering topical estrogen after menopause.',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900&q=80',
        citation: '<a href="https://www.mayoclinic.org/diseases-conditions/urinary-tract-infection/symptoms-causes/syc-20353447" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Mayo Clinic. UTI Overview. 2022.</a>'
    },
    {
        name: 'Ovarian Cysts',
        category: 'Fluid-Filled Sac',
        symptoms: [
            'Most are asymptomatic and resolve on their own',
            'Pelvic pain (dull or sharp)',
            'Fullness or heaviness in the abdomen',
            'Bloating',
            'Pain during intercourse',
            'Sudden severe pain (if cyst ruptures or causes ovarian torsion)',
            'Frequent urge to urinate'
        ],
        causes: [
            'Normal menstrual cycle function (Follicular and Corpus Luteum cysts)',
            'Endometriosis',
            'PCOS (multiple small cysts)',
            'Severe pelvic infection'
        ],
        treatment: [
            'Watchful waiting and monitoring (for small, simple cysts)',
            'Birth control pills to prevent new cysts',
            'Laparoscopic surgery to remove large or problematic cysts',
            'Emergency surgery for torsion or rupture'
        ],
        prevention: 'Birth control pills may reduce the risk of new functional cysts in women who frequently develop them.',
        imageUrl: 'https://images.unsplash.com/photo-1579737151121-65476a213e45?w=900&q=80',
        citation: '<a href="https://my.clevelandclinic.org/health/diseases/17435-ovarian-cysts" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Cleveland Clinic. Ovarian Cysts. 2024.</a>'
    },
    {
        name: 'Pelvic Inflammatory Disease (PID)',
        category: 'Infection',
        symptoms: [
            'Pain in your lower abdomen and pelvis',
            'Heavy or foul-smelling vaginal discharge',
            'Fever and chills',
            'Painful intercourse',
            'Painful or difficult urination',
            'Irregular bleeding'
        ],
        causes: [
            'Untreated sexually transmitted infections (STIs) like Chlamydia and Gonorrhea',
            'Douching (disrupts natural bacterial balance)',
            'Previous history of PID',
            'IUD insertion (rarely and usually only at the time of insertion)'
        ],
        treatment: [
            'Antibiotics (oral or intravenous) to treat the infection',
            'Treatment for partners to prevent reinfection',
            'Pain management'
        ],
        prevention: 'Practicing safe sex, getting tested for STIs, avoiding douching, and seeking prompt treatment for any signs of infection.',
        imageUrl: 'https://images.unsplash.com/photo-1520281200388-348507204f14?w=900&q=80',
        citation: '<a href="https://www.cdc.gov/std/pid/stdfact-pid.htm" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">CDC. Pelvic Inflammatory Disease (PID) Fact Sheet. 2022.</a>'
    },
    {
        name: 'Infertility',
        category: 'Reproductive Health Condition',
        symptoms: [
            'Inability to conceive after 1 year of unprotected intercourse (or 6 months if over 35)',
            'Irregular or absent menstrual cycles',
            'Painful or heavy periods',
            'Symptoms related to hormonal imbalance (e.g., hirsutism, acne)',
            'Recurrent pregnancy loss'
        ],
        causes: [
            'Ovulation disorders (PCOS, premature ovarian failure)',
            'Fallopian tube damage (due to PID, endometriosis)',
            'Uterine/Cervical factors (fibroids, polyps)',
            'Advanced maternal age',
            'Thyroid disorders',
            'Male factor infertility (accounts for 30-40% of cases)'
        ],
        treatment: [
            'Fertility drugs (e.g., Clomiphene, Gonadotropins)',
            'In Vitro Fertilization (IVF)',
            'Intrauterine Insemination (IUI)',
            'Surgery to correct uterine or tubal problems',
            'Lifestyle modifications'
        ],
        prevention: 'Maintaining a healthy weight, avoiding smoking/excessive alcohol, getting prompt STI treatment, and knowing your reproductive window.',
        imageUrl: 'https://images.unsplash.com/photo-1627883391216-56214309e3e7?w=900&q=80',
        citation: '<a href="https://www.acog.org/womens-health/faqs/infertility" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">ACOG. Infertility FAQ. 2023.</a>'
    },
    {
        name: 'Premenstrual Syndrome (PMS) & PMDD',
        category: 'Hormonal/Mood Disorder',
        symptoms: [
            'Mood swings, irritability, anxiety (PMDD is severe)',
            'Depression, feeling out of control (PMDD)',
            'Bloating and breast tenderness',
            'Fatigue and sleep problems',
            'Headaches and joint or muscle pain',
            'Food cravings and appetite changes',
            'Symptoms occur 1-2 weeks before period and stop after it starts'
        ],
        causes: [
            'Cyclic changes in hormones (Estrogen and Progesterone)',
            'Fluctuations in brain chemicals (Serotonin)',
            'Genetic predisposition',
            'Nutritional deficiencies (Calcium, Magnesium)'
        ],
        treatment: [
            'Lifestyle adjustments (diet, exercise, stress reduction)',
            'Nutritional supplements (Calcium, Vitamin B6)',
            'NSAIDs for pain and cramps',
            'Hormonal birth control pills',
            'Antidepressants (SSRIs) for PMDD symptoms'
        ],
        prevention: 'Regular aerobic exercise, stress management techniques, dietary changes (reducing salt, caffeine, sugar), and adequate sleep.',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900&q=80',
        citation: '<a href="https://www.hopkinsmedicine.org/health/conditions-and-diseases/premenstrual-dysphoric-disorder-pmdd" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Johns Hopkins Medicine. PMDD. 2024.</a>'
    },
    {
        name: 'Gestational Diabetes',
        category: 'Pregnancy Condition',
        symptoms: [
            'Usually asymptomatic, detected via routine screening',
            'Increased thirst',
            'Frequent urination',
            'Fatigue',
            'Blurred vision (rarely)'
        ],
        causes: [
            'Hormones from the placenta block the mother\'s insulin from working (insulin resistance)',
            'Pancreas cannot produce enough insulin to overcome the block',
            'Risk factors: Overweight/Obesity, family history of diabetes, age over 25'
        ],
        treatment: [
            'Special diet and physical activity',
            'Daily blood glucose monitoring',
            'Insulin injections or oral medication (Metformin)',
            'Closer monitoring of the fetus'
        ],
        prevention: 'Achieving a healthy weight before pregnancy, exercising before and during pregnancy, and eating a balanced diet.',
        imageUrl: 'https://images.unsplash.com/photo-1543336332-9457222474f1?w=900&q=80',
        citation: '<a href="https://www.cdc.gov/diabetes/basics/gestational.html" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">CDC. Gestational Diabetes Basics. 2023.</a>'
    },
    {
        name: 'Postpartum Depression (PPD)',
        category: 'Mental Health Condition',
        symptoms: [
            'Severe mood swings and excessive crying',
            'Difficulty bonding with the baby',
            'Withdrawing from family and friends',
            'Loss of appetite or eating much more than usual',
            'Severe anxiety and panic attacks',
            'Thoughts of harming yourself or the baby',
            'Occurs after childbirth, can start during pregnancy'
        ],
        causes: [
            'Dramatic drop in hormones (Estrogen and Progesterone) after birth',
            'Sleep deprivation and physical pain of childbirth',
            'Emotional stress, history of depression',
            'Lack of support system'
        ],
        treatment: [
            'Psychotherapy or counseling',
            'Antidepressant medication (SSRIs)',
            'Support groups',
            'Hormone therapy (in some cases)',
            'Prioritizing sleep and rest'
        ],
        prevention: 'Seeking early screening, having a strong support network, attending postpartum checkups, and maintaining open communication with healthcare providers.',
        imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900&q=80',
        citation: '<a href="https://www.nimh.nih.gov/health/topics/postpartum-depression" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">NIMH. Postpartum Depression. 2023.</a>'
    },
    {
        name: 'Thyroid Disorders (Hypo/Hyper)',
        category: 'Hormonal Disorder',
        symptoms: [
            'Hypo: Fatigue, weight gain, depression, cold intolerance, dry skin, heavy periods',
            'Hyper: Weight loss, anxiety, rapid heartbeat, heat intolerance, light periods',
            'Lump in the neck (Goiter)',
            'Hair loss and muscle weakness',
            'Mood changes'
        ],
        causes: [
            'Autoimmune conditions (Hashimoto\'s - Hypo, Graves\' - Hyper)',
            'Iodine deficiency or excess',
            'Pregnancy and childbirth',
            'Thyroiditis (inflammation)',
            'Genetic factors'
        ],
        treatment: [
            'Hypothyroidism: Synthetic thyroid hormone (Levothyroxine)',
            'Hyperthyroidism: Anti-thyroid drugs, radioactive iodine, surgery',
            'Regular blood testing to monitor hormone levels'
        ],
        prevention: 'Ensure adequate iodine intake (but avoid excessive amounts), regular monitoring if you have a family history or other autoimmune disorders.',
        imageUrl: 'https://images.unsplash.com/photo-1627883391216-56214309e3e7?w=900&q=80',
        citation: '<a href="https://www.womenshealth.gov/a-z-topics/thyroid-disease" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Office on Women’s Health. Thyroid Disease. 2024.</a>'
    },
    {
        name: 'Osteoporosis',
        category: 'Bone Health Condition',
        symptoms: [
            'Often no symptoms until a bone fracture occurs',
            'Back pain, caused by a fractured or collapsed vertebra',
            'Loss of height over time',
            'A stooped posture (Kyphosis)',
            'Bones that break easily'
        ],
        causes: [
            'Decrease in estrogen levels after menopause (primary cause in women)',
            'Aging (bone density naturally decreases)',
            'Long-term corticosteroid use',
            'Thyroid issues and other hormonal problems',
            'Low calcium and Vitamin D intake'
        ],
        treatment: [
            'Bisphosphonates and other bone-building medications',
            'Hormone replacement therapy (HRT)',
            'Calcium and Vitamin D supplements',
            'Weight-bearing exercises'
        ],
        prevention: 'Adequate calcium and Vitamin D intake throughout life, regular weight-bearing exercise (walking, jogging), avoiding smoking, limiting alcohol.',
        imageUrl: 'https://images.unsplash.com/photo-1596766465011-893322d99d3d?w=900&q=80',
        citation: '<a href="https://www.bones.nih.gov/health-info/bone/osteoporosis/overview" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">NIH. Osteoporosis Overview. 2023.</a>'
    },
    {
        name: 'Preeclampsia',
        category: 'Pregnancy Condition',
        symptoms: [
            'High blood pressure (hypertension) after 20 weeks of pregnancy',
            'Protein in the urine (proteinuria)',
            'Severe headaches and vision changes',
            'Upper abdominal pain (usually under the ribs on the right side)',
            'Nausea or vomiting',
            'Swelling in the face and hands'
        ],
        causes: [
            'Abnormal development and function of the placenta',
            'Genetic factors and inadequate blood flow to the uterus',
            'Autoimmune and vascular issues',
            'First pregnancy, history of high blood pressure, age >40'
        ],
        treatment: [
            'Delivery of the baby and placenta (the cure)',
            'Close monitoring (blood pressure, urine, blood tests)',
            'Medications to lower blood pressure and prevent seizures (Magnesium Sulfate)',
            'Bed rest (in some cases)'
        ],
        prevention: 'Low-dose aspirin starting in the second trimester (for high-risk women), adequate prenatal care, managing pre-existing hypertension or diabetes.',
        imageUrl: 'https://images.unsplash.com/photo-1543336332-9457222474f1?w=900&q=80',
        citation: '<a href="https://www.preeclampsia.org/about-preeclampsia/what-is-preeclampsia" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Preeclampsia Foundation. What is Preeclampsia? 2024.</a>'
    },
    {
        name: 'Vaginismus',
        category: 'Sexual Health Condition',
        symptoms: [
            'Involuntary muscle spasms of the pelvic floor muscles',
            'Painful intercourse (dyspareunia)',
            'Inability to tolerate a gynecological exam or tampon insertion',
            'Burning or stinging pain',
            'Fear or anxiety related to sexual penetration'
        ],
        causes: [
            'Fear of pain or penetration (psychological cause)',
            'Past sexual trauma or abuse',
            'Painful first intercourse',
            'Medical conditions (UTI, yeast infection, endometriosis, menopause)',
            'Emotional distress and anxiety'
        ],
        treatment: [
            'Pelvic floor physical therapy (PFPT)',
            'Vaginal dilator therapy (graduated sizes)',
            'Counseling or sex therapy',
            'Pain management and muscle relaxants (Botox, local anesthesia)',
            'Treating any underlying medical cause'
        ],
        prevention: 'Open communication, comprehensive sex education, addressing psychological factors early, and gentle progression during sexual activity or exams.',
        imageUrl: 'https://images.unsplash.com/photo-1579737151121-65476a213e45?w=900&q=80',
        citation: '<a href="https://www.acog.org/womens-health/faqs/vaginismus" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">ACOG. Vaginismus FAQ. 2023.</a>'
    },
    {
        name: 'Bacterial Vaginosis (BV)',
        category: 'Infection',
        symptoms: [
            'Thin, gray, white, or green vaginal discharge',
            'Strong, unpleasant "fishy" odor (especially after sex)',
            'Vaginal itching or burning',
            'Burning during urination (less common)'
        ],
        causes: [
            'Overgrowth of certain bacteria, disrupting the natural balance',
            'Douching or vaginal washing with harsh soaps',
            'Having new or multiple sex partners',
            'Naturally lacking in Lactobacillus bacteria',
            'Often confused with a yeast infection'
        ],
        treatment: [
            'Antibiotics (Metronidazole or Clindamycin) - oral or vaginal gel/cream',
            'Probiotics (Lactobacillus strains) to restore balance'
        ],
        prevention: 'Avoiding douching, limiting sex partners, using mild soap (if any) only on the outside of the vagina, and completing the full course of antibiotics if prescribed.',
        imageUrl: 'https://images.unsplash.com/photo-1627883441551-766b44a30e71?w=900&q=80',
        citation: '<a href="https://www.cdc.gov/std/bv/stdfact-bacterial-vaginosis.htm" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">CDC. Bacterial Vaginosis (BV) Fact Sheet. 2022.</a>'
    },
    {
        name: 'Autoimmune Diseases',
        category: 'Immune System Disorder',
        symptoms: [
            'Lupus: Butterfly rash on face, joint pain, fatigue',
            'Rheumatoid Arthritis: Painful swollen joints, morning stiffness',
            'Thyroid Disease: Weight changes, fatigue, mood changes',
            'Multiple Sclerosis: Numbness, vision problems, weakness',
            'Type 1 Diabetes: Excessive thirst, frequent urination',
            'Inflammatory Bowel Disease: Abdominal pain, diarrhea',
            'Sjogren\'s Syndrome: Dry eyes and mouth',
            'General: Chronic fatigue, inflammation, organ-specific symptoms'
        ],
        causes: [
            'Immune system attacks body\'s own tissues',
            'Genetic predisposition',
            'Hormonal factors (estrogen influence)',
            'Environmental triggers',
            'X chromosome factors',
            'Infections or illnesses',
            'Unknown factors (ongoing research)'
        ],
        treatment: [
            'Disease-modifying medications',
            'Immunosuppressants to reduce immune response',
            'Anti-inflammatory drugs (NSAIDs, corticosteroids)',
            'Hormone replacement for thyroid disease',
            'Biologic therapies for targeted treatment',
            'Physical therapy and rehabilitation',
            'Lifestyle modifications and symptom management'
        ],
        prevention: '75% of autoimmune disease cases occur in women. Women with lupus should undergo periodic thyroid monitoring. Prevention: no proven prevention, but early diagnosis and treatment prevent complications. Regular monitoring crucial for women with family history.',
        imageUrl: 'https://images.unsplash.com/photo-1520281200388-348507204f14?w=900&q=80',
        citation: '<a href="https://www.hss.edu/health-library/conditions-and-treatments/lupus-autoimmune-thyroid-diseases-top-10-series" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Hospital for Special Surgery. Lupus and Autoimmune Thyroid Diseases. 2025.</a> | <a href="https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2017.00138/full" target="_blank" rel="noopener noreferrer" style="color: var(--color-primary); text-decoration: underline;">Ferrari SM, et al. Systemic Lupus Erythematosus and Thyroid Autoimmunity. Front Endocrinol. 2017.</a>'
    }
];
