import { db } from '../db/database';
import { aiService } from './aiService';

// Lab Investigation Interfaces
export interface LabInvestigation {
  id: string;
  patient_id: string;
  patient_name: string;
  request_date: Date;
  requested_by: string;
  urgency: 'routine' | 'urgent' | 'stat';
  clinical_indication: string;
  tests: LabTest[];
  status: 'pending' | 'collected' | 'processing' | 'completed' | 'cancelled';
  collection_date?: Date;
  collection_notes?: string;
  special_instructions?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LabTest {
  id: string;
  test_code: string;
  test_name: string;
  category: LabCategory;
  sample_type: 'blood' | 'urine' | 'stool' | 'swab' | 'tissue' | 'fluid' | 'other';
  container_type?: string;
  fasting_required: boolean;
  special_preparation?: string;
  normal_range?: string;
  status: 'pending' | 'collected' | 'processing' | 'completed' | 'failed';
  priority: number;
}

export interface LabResult {
  id: string;
  investigation_id: string;
  test_id: string;
  patient_id: string;
  result_value: string;
  unit: string;
  reference_range: string;
  abnormal_flag: 'normal' | 'high' | 'low' | 'critical_high' | 'critical_low' | 'abnormal';
  result_date: Date;
  lab_technician: string;
  verified_by?: string;
  verified_date?: Date;
  comments?: string;
  file_attachments?: LabAttachment[];
  ai_interpretation?: LabAIInterpretation;
  created_at: Date;
  updated_at: Date;
}

export interface LabAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface LabAIInterpretation {
  id: string;
  interpretation_text: string;
  clinical_significance: string;
  suggested_actions: string[];
  risk_level: 'low' | 'moderate' | 'high' | 'critical';
  differential_diagnosis?: string[];
  follow_up_recommendations?: string[];
  generated_at: Date;
  confidence_score: number;
}

export interface LabTrend {
  test_name: string;
  results: {
    date: Date;
    value: number;
    flag: string;
  }[];
  trend_direction: 'improving' | 'stable' | 'worsening' | 'fluctuating';
  trend_analysis: string;
}

export interface GFRCalculation {
  id: string;
  patient_id: string;
  calculation_date: Date;
  creatinine_value: number;
  creatinine_unit: string;
  age: number;
  gender: 'male' | 'female';
  race: 'african_american' | 'other';
  weight?: number;
  height?: number;
  gfr_value: number;
  gfr_formula: 'CKD-EPI' | 'MDRD' | 'Cockcroft-Gault';
  ckd_stage: 1 | 2 | 3 | 4 | 5;
  ckd_stage_description: string;
  risk_assessment: 'normal' | 'mild_decrease' | 'moderate_decrease' | 'severe_decrease' | 'kidney_failure';
  clinical_interpretation: string;
  recommendations: string[];
  created_at: Date;
}

export interface GFRTrend {
  patient_id: string;
  gfr_calculations: GFRCalculation[];
  trend_direction: 'improving' | 'stable' | 'declining' | 'fluctuating';
  trend_analysis: string;
  rate_of_decline?: number; // mL/min/1.73m²/year
  time_to_dialysis_estimate?: number; // months
  risk_progression: 'low' | 'moderate' | 'high' | 'very_high';
  follow_up_recommendations: string[];
}

export interface PatientDemographics {
  age: number;
  gender: 'male' | 'female';
  race: 'african_american' | 'other';
  weight?: number; // kg
  height?: number; // cm
}

export type LabCategory = 
  | 'hematology'
  | 'biochemistry'
  | 'immunology'
  | 'microbiology'
  | 'histopathology'
  | 'cytology'
  | 'endocrinology'
  | 'coagulation'
  | 'cardiac_markers'
  | 'liver_function'
  | 'kidney_function'
  | 'lipid_profile'
  | 'thyroid_function'
  | 'diabetes_markers'
  | 'tumor_markers'
  | 'drug_levels'
  | 'other';

// Predefined Lab Tests
export const COMMON_LAB_TESTS: Record<LabCategory, LabTest[]> = {
  hematology: [
    {
      id: 'fbc',
      test_code: 'FBC',
      test_name: 'Full Blood Count',
      category: 'hematology',
      sample_type: 'blood',
      container_type: 'EDTA',
      fasting_required: false,
      normal_range: 'Age/gender specific',
      status: 'pending',
      priority: 1
    },
    {
      id: 'esr',
      test_code: 'ESR',
      test_name: 'Erythrocyte Sedimentation Rate',
      category: 'hematology',
      sample_type: 'blood',
      container_type: 'EDTA',
      fasting_required: false,
      normal_range: 'Male: <15mm/hr, Female: <20mm/hr',
      status: 'pending',
      priority: 2
    }
  ],
  biochemistry: [
    {
      id: 'u_e',
      test_code: 'U&E',
      test_name: 'Urea & Electrolytes',
      category: 'biochemistry',
      sample_type: 'blood',
      container_type: 'Serum',
      fasting_required: false,
      normal_range: 'Laboratory specific',
      status: 'pending',
      priority: 1
    },
    {
      id: 'lft',
      test_code: 'LFT',
      test_name: 'Liver Function Tests',
      category: 'liver_function',
      sample_type: 'blood',
      container_type: 'Serum',
      fasting_required: true,
      special_preparation: '12 hours fasting required',
      normal_range: 'Laboratory specific',
      status: 'pending',
      priority: 2
    }
  ],
  microbiology: [
    {
      id: 'blood_culture',
      test_code: 'BC',
      test_name: 'Blood Culture',
      category: 'microbiology',
      sample_type: 'blood',
      container_type: 'Blood culture bottle',
      fasting_required: false,
      special_preparation: 'Sterile collection technique',
      status: 'pending',
      priority: 1
    }
  ],
  // Add more categories as needed
  immunology: [],
  histopathology: [],
  cytology: [],
  endocrinology: [],
  coagulation: [],
  cardiac_markers: [],
  liver_function: [],
  kidney_function: [],
  lipid_profile: [],
  thyroid_function: [],
  diabetes_markers: [],
  tumor_markers: [],
  drug_levels: [],
  other: []
};

class LabService {
  // Lab Investigation Management
  async createLabInvestigation(investigation: Omit<LabInvestigation, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `lab_inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newInvestigation: LabInvestigation = {
      ...investigation,
      id,
      created_at: now,
      updated_at: now
    };

    await db.lab_investigations.add(newInvestigation);
    return id;
  }

  async getLabInvestigations(patientId?: string): Promise<LabInvestigation[]> {
    if (patientId) {
      return await db.lab_investigations
        .where('patient_id')
        .equals(patientId)
        .reverse()
        .sortBy('request_date');
    }
    
    return await db.lab_investigations
      .orderBy('request_date')
      .reverse()
      .toArray();
  }

  async updateInvestigationStatus(id: string, status: LabInvestigation['status']): Promise<void> {
    await db.lab_investigations.update(id, { status, updated_at: new Date() });
  }

  // Lab Results Management
  async addLabResult(result: Omit<LabResult, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `lab_result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newResult: LabResult = {
      ...result,
      id,
      created_at: now,
      updated_at: now
    };

    await db.lab_results.add(newResult);
    
    // Generate AI interpretation if not provided
    if (!result.ai_interpretation) {
      await this.generateAIInterpretation(id);
    }
    
    return id;
  }

  async getLabResults(patientId?: string, testName?: string): Promise<LabResult[]> {
    let query = db.lab_results.orderBy('result_date').reverse();
    
    if (patientId) {
      query = db.lab_results.where('patient_id').equals(patientId).reverse();
    }
    
    const results = await query.toArray();
    
    if (testName) {
      return results.filter(result => 
        result.test_id.toLowerCase().includes(testName.toLowerCase())
      );
    }
    
    return results;
  }

  async generateAIInterpretation(resultId: string): Promise<void> {
    try {
      const result = await db.lab_results.get(resultId);
      if (!result) return;

      const investigation = await db.lab_investigations.get(result.investigation_id);
      if (!investigation) return;

      const prompt = `
        Analyze this lab result and provide clinical interpretation:
        
        Patient: ${investigation.patient_name}
        Test: ${result.test_id}
        Result: ${result.result_value} ${result.unit}
        Reference Range: ${result.reference_range}
        Flag: ${result.abnormal_flag}
        Clinical Indication: ${investigation.clinical_indication}
        
        Please provide:
        1. Clinical interpretation
        2. Clinical significance
        3. Suggested actions
        4. Risk level assessment
        5. Differential diagnosis considerations
        6. Follow-up recommendations
        
        Format as JSON with fields: interpretation_text, clinical_significance, suggested_actions, risk_level, differential_diagnosis, follow_up_recommendations
      `;

      const aiResponse = await aiService.generateContent(prompt);
      
      let interpretation: LabAIInterpretation;
      try {
        const parsed = JSON.parse(aiResponse);
        interpretation = {
          id: `ai_interp_${Date.now()}`,
          interpretation_text: parsed.interpretation_text || 'AI interpretation generated',
          clinical_significance: parsed.clinical_significance || 'Clinical significance assessed',
          suggested_actions: parsed.suggested_actions || [],
          risk_level: parsed.risk_level || 'moderate',
          differential_diagnosis: parsed.differential_diagnosis || [],
          follow_up_recommendations: parsed.follow_up_recommendations || [],
          generated_at: new Date(),
          confidence_score: 0.85
        };
      } catch {
        // Fallback if JSON parsing fails
        interpretation = {
          id: `ai_interp_${Date.now()}`,
          interpretation_text: aiResponse,
          clinical_significance: 'AI analysis completed',
          suggested_actions: ['Review with clinician', 'Consider clinical correlation'],
          risk_level: 'moderate',
          differential_diagnosis: [],
          follow_up_recommendations: ['Clinical correlation recommended'],
          generated_at: new Date(),
          confidence_score: 0.75
        };
      }

      await db.lab_results.update(resultId, {
        ai_interpretation: interpretation,
        updated_at: new Date()
      });

    } catch (error) {
      console.error('Error generating AI interpretation:', error);
    }
  }

  // File Upload Management
  async uploadLabFile(file: File, resultId: string, uploadedBy: string): Promise<string> {
    const attachmentId = `lab_file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real app, you would upload to a file storage service
    // For now, we'll simulate with a local URL
    const fileUrl = URL.createObjectURL(file);
    
    const attachment: LabAttachment = {
      id: attachmentId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_url: fileUrl,
      uploaded_by: uploadedBy,
      uploaded_at: new Date()
    };

    const result = await db.lab_results.get(resultId);
    if (result) {
      const updatedAttachments = [...(result.file_attachments || []), attachment];
      await db.lab_results.update(resultId, {
        file_attachments: updatedAttachments,
        updated_at: new Date()
      });
    }

    return attachmentId;
  }

  // Lab Trends and Serial Tracking
  async getLabTrends(patientId: string, testName: string, months: number = 6): Promise<LabTrend> {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - months);
    
    const results = await db.lab_results
      .where('patient_id')
      .equals(patientId)
      .filter(result => 
        result.test_id.toLowerCase().includes(testName.toLowerCase()) &&
        result.result_date >= fromDate
      )
      .sortBy('result_date');

    const trendData = results
      .map(result => ({
        date: result.result_date,
        value: parseFloat(result.result_value) || 0,
        flag: result.abnormal_flag
      }))
      .filter(data => !isNaN(data.value));

    let trendDirection: 'improving' | 'stable' | 'worsening' | 'fluctuating' = 'stable';
    let trendAnalysis = 'Insufficient data for trend analysis';

    if (trendData.length >= 3) {
      const recent = trendData.slice(-3);
      const values = recent.map(d => d.value);
      const isIncreasing = values[2] > values[1] && values[1] > values[0];
      const isDecreasing = values[2] < values[1] && values[1] < values[0];
      
      if (isIncreasing) {
        trendDirection = 'worsening'; // Assuming higher values are worse - adjust per test
      } else if (isDecreasing) {
        trendDirection = 'improving';
      } else {
        const variance = this.calculateVariance(values);
        trendDirection = variance > 0.1 ? 'fluctuating' : 'stable';
      }
      
      trendAnalysis = `Trend over ${months} months shows ${trendDirection} pattern with ${trendData.length} data points`;
    }

    return {
      test_name: testName,
      results: trendData,
      trend_direction: trendDirection,
      trend_analysis: trendAnalysis
    };
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance / Math.pow(mean, 2); // Coefficient of variation
  }

  // Lab Statistics and Reports
  async getLabStatistics(patientId?: string, dateRange?: { start: Date; end: Date }): Promise<{
    totalInvestigations: number;
    completedResults: number;
    pendingResults: number;
    abnormalResults: number;
    criticalResults: number;
    averageCompletionTime: number;
  }> {
    let investigations = await db.lab_investigations.toArray();
    let results = await db.lab_results.toArray();

    if (patientId) {
      investigations = investigations.filter(inv => inv.patient_id === patientId);
      results = results.filter(res => res.patient_id === patientId);
    }

    if (dateRange) {
      investigations = investigations.filter(inv => 
        inv.request_date >= dateRange.start && inv.request_date <= dateRange.end
      );
      results = results.filter(res => 
        res.result_date >= dateRange.start && res.result_date <= dateRange.end
      );
    }

    const completedResults = results.length;
    const abnormalResults = results.filter(res => 
      res.abnormal_flag !== 'normal'
    ).length;
    const criticalResults = results.filter(res => 
      res.abnormal_flag === 'critical_high' || res.abnormal_flag === 'critical_low'
    ).length;

    // Calculate average completion time
    const completedInvestigations = investigations.filter(inv => inv.status === 'completed');
    const avgCompletionTime = completedInvestigations.length > 0
      ? completedInvestigations.reduce((sum, inv) => {
          if (inv.collection_date) {
            return sum + (inv.collection_date.getTime() - inv.request_date.getTime());
          }
          return sum;
        }, 0) / completedInvestigations.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    return {
      totalInvestigations: investigations.length,
      completedResults,
      pendingResults: investigations.filter(inv => inv.status !== 'completed').length,
      abnormalResults,
      criticalResults,
      averageCompletionTime: avgCompletionTime
    };
  }

  // Search and Filter
  async searchLabResults(query: string, patientId?: string): Promise<LabResult[]> {
    let results = await this.getLabResults(patientId);
    
    const searchTerm = query.toLowerCase();
    return results.filter(result => 
      result.test_id.toLowerCase().includes(searchTerm) ||
      result.result_value.toLowerCase().includes(searchTerm) ||
      result.comments?.toLowerCase().includes(searchTerm) ||
      result.ai_interpretation?.interpretation_text.toLowerCase().includes(searchTerm)
    );
  }

  // Get common lab tests by category
  getCommonTests(category: LabCategory): LabTest[] {
    return COMMON_LAB_TESTS[category] || [];
  }

  // Get all available lab categories
  getLabCategories(): { value: LabCategory; label: string }[] {
    return [
      { value: 'hematology', label: 'Hematology' },
      { value: 'biochemistry', label: 'Biochemistry' },
      { value: 'immunology', label: 'Immunology' },
      { value: 'microbiology', label: 'Microbiology' },
      { value: 'histopathology', label: 'Histopathology' },
      { value: 'cytology', label: 'Cytology' },
      { value: 'endocrinology', label: 'Endocrinology' },
      { value: 'coagulation', label: 'Coagulation' },
      { value: 'cardiac_markers', label: 'Cardiac Markers' },
      { value: 'liver_function', label: 'Liver Function' },
      { value: 'kidney_function', label: 'Kidney Function' },
      { value: 'lipid_profile', label: 'Lipid Profile' },
      { value: 'thyroid_function', label: 'Thyroid Function' },
      { value: 'diabetes_markers', label: 'Diabetes Markers' },
      { value: 'tumor_markers', label: 'Tumor Markers' },
      { value: 'drug_levels', label: 'Drug Levels' },
      { value: 'other', label: 'Other' }
    ];
  }

  // GFR Calculation and Management
  async calculateGFR(
    patientId: string, 
    creatinine: number, 
    creatinineUnit: string, 
    demographics: PatientDemographics,
    formula: 'CKD-EPI' | 'MDRD' | 'Cockcroft-Gault' = 'CKD-EPI'
  ): Promise<GFRCalculation> {
    // Convert creatinine to mg/dL if needed
    let creatinineMgDl = creatinine;
    if (creatinineUnit === 'µmol/L' || creatinineUnit === 'umol/L') {
      creatinineMgDl = creatinine / 88.4; // Convert µmol/L to mg/dL
    }

    let gfrValue: number;
    
    switch (formula) {
      case 'CKD-EPI':
        gfrValue = this.calculateCKDEPI(creatinineMgDl, demographics.age, demographics.gender, demographics.race);
        break;
      case 'MDRD':
        gfrValue = this.calculateMDRD(creatinineMgDl, demographics.age, demographics.gender, demographics.race);
        break;
      case 'Cockcroft-Gault':
        if (!demographics.weight) {
          throw new Error('Weight is required for Cockcroft-Gault formula');
        }
        gfrValue = this.calculateCockcroftGault(creatinineMgDl, demographics.age, demographics.gender, demographics.weight);
        break;
      default:
        throw new Error('Invalid GFR formula');
    }

    const ckdStage = this.determineCKDStage(gfrValue);
    const gfrCalculation: GFRCalculation = {
      id: `gfr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      patient_id: patientId,
      calculation_date: new Date(),
      creatinine_value: creatinine,
      creatinine_unit: creatinineUnit,
      age: demographics.age,
      gender: demographics.gender,
      race: demographics.race,
      weight: demographics.weight,
      height: demographics.height,
      gfr_value: Math.round(gfrValue * 10) / 10, // Round to 1 decimal place
      gfr_formula: formula,
      ckd_stage: ckdStage.stage,
      ckd_stage_description: ckdStage.description,
      risk_assessment: ckdStage.risk,
      clinical_interpretation: this.generateGFRInterpretation(gfrValue, ckdStage),
      recommendations: this.generateGFRRecommendations(gfrValue, ckdStage),
      created_at: new Date()
    };

    // Store the GFR calculation
    await db.gfr_calculations.add(gfrCalculation);
    
    return gfrCalculation;
  }

  private calculateCKDEPI(creatinine: number, age: number, gender: 'male' | 'female', race: 'african_american' | 'other'): number {
    const isFemale = gender === 'female';
    const isAfricanAmerican = race === 'african_american';
    
    const kappa = isFemale ? 0.7 : 0.9;
    const alpha = isFemale ? -0.329 : -0.411;
    const genderFactor = isFemale ? 1.018 : 1;
    const raceFactor = isAfricanAmerican ? 1.159 : 1;
    
    const minCreatKappa = Math.min(creatinine / kappa, 1);
    const maxCreatKappa = Math.max(creatinine / kappa, 1);
    
    return 141 * Math.pow(minCreatKappa, alpha) * Math.pow(maxCreatKappa, -1.209) * 
           Math.pow(0.993, age) * genderFactor * raceFactor;
  }

  private calculateMDRD(creatinine: number, age: number, gender: 'male' | 'female', race: 'african_american' | 'other'): number {
    const isFemale = gender === 'female';
    const isAfricanAmerican = race === 'african_american';
    
    let gfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203);
    
    if (isFemale) {
      gfr *= 0.742;
    }
    
    if (isAfricanAmerican) {
      gfr *= 1.212;
    }
    
    return gfr;
  }

  private calculateCockcroftGault(creatinine: number, age: number, gender: 'male' | 'female', weight: number): number {
    const isFemale = gender === 'female';
    const genderFactor = isFemale ? 0.85 : 1;
    
    return ((140 - age) * weight * genderFactor) / (72 * creatinine);
  }

  private determineCKDStage(gfr: number): { 
    stage: 1 | 2 | 3 | 4 | 5; 
    description: string; 
    risk: 'normal' | 'mild_decrease' | 'moderate_decrease' | 'severe_decrease' | 'kidney_failure' 
  } {
    if (gfr >= 90) {
      return { stage: 1, description: 'Normal or high', risk: 'normal' };
    } else if (gfr >= 60) {
      return { stage: 2, description: 'Mildly decreased', risk: 'mild_decrease' };
    } else if (gfr >= 30) {
      return { stage: 3, description: 'Moderately decreased', risk: 'moderate_decrease' };
    } else if (gfr >= 15) {
      return { stage: 4, description: 'Severely decreased', risk: 'severe_decrease' };
    } else {
      return { stage: 5, description: 'Kidney failure', risk: 'kidney_failure' };
    }
  }

  private generateGFRInterpretation(gfr: number, stage: any): string {
    const interpretations = {
      1: `GFR of ${gfr} mL/min/1.73m² indicates normal kidney function. Continue routine monitoring.`,
      2: `GFR of ${gfr} mL/min/1.73m² shows mildly decreased kidney function. Monitor for progression and cardiovascular risk factors.`,
      3: `GFR of ${gfr} mL/min/1.73m² indicates moderately decreased kidney function (CKD Stage 3). Evaluate and treat complications, slow progression.`,
      4: `GFR of ${gfr} mL/min/1.73m² shows severely decreased kidney function (CKD Stage 4). Prepare for renal replacement therapy.`,
      5: `GFR of ${gfr} mL/min/1.73m² indicates kidney failure (CKD Stage 5). Renal replacement therapy needed.`
    };
    
    return interpretations[stage.stage as keyof typeof interpretations];
  }

  private generateGFRRecommendations(gfr: number, stage: { stage: number; description: string; risk: string }): string[] {
    const recommendations = {
      1: [
        'Annual eGFR monitoring',
        'Blood pressure control (<130/80 mmHg)',
        'Lifestyle modifications (diet, exercise)',
        'Diabetes management if applicable'
      ],
      2: [
        'Annual eGFR monitoring',
        'Blood pressure control (<130/80 mmHg)',
        'ACE inhibitor or ARB if indicated',
        'Cardiovascular risk assessment',
        'Lifestyle modifications'
      ],
      3: [
        'Monitor eGFR every 6 months',
        'Nephrology referral',
        'Bone and mineral metabolism evaluation',
        'Anemia screening',
        'Blood pressure control (<130/80 mmHg)',
        'Protein restriction consideration',
        'Medication dose adjustments'
      ],
      4: [
        'Monitor eGFR every 3-6 months',
        'Nephrology management',
        'Renal replacement therapy education',
        'Vascular access planning',
        'Anemia management',
        'Bone disease management',
        'Dietary counseling',
        'Medication dose adjustments'
      ],
      5: [
        'Urgent nephrology consultation',
        'Renal replacement therapy initiation',
        'Dialysis or transplant evaluation',
        'Anemia management',
        'Bone disease management',
        'Cardiovascular protection',
        'Dietary restrictions'
      ]
    };
    
    return recommendations[stage.stage as keyof typeof recommendations] || [];
  }

  async getGFRHistory(patientId: string): Promise<GFRCalculation[]> {
    return await db.gfr_calculations
      .where('patient_id')
      .equals(patientId)
      .reverse()
      .sortBy('calculation_date');
  }

  async generateGFRTrend(patientId: string, months: number = 12): Promise<GFRTrend> {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - months);
    
    const gfrHistory = await db.gfr_calculations
      .where('patient_id')
      .equals(patientId)
      .filter((calc: GFRCalculation) => calc.calculation_date >= fromDate)
      .sortBy('calculation_date');

    if (gfrHistory.length < 2) {
      return {
        patient_id: patientId,
        gfr_calculations: gfrHistory,
        trend_direction: 'stable',
        trend_analysis: 'Insufficient data for trend analysis. At least 2 GFR measurements are needed.',
        risk_progression: 'low',
        follow_up_recommendations: ['Obtain follow-up creatinine in 6-12 months']
      };
    }

    // Calculate trend
    const gfrValues = gfrHistory.map((calc: GFRCalculation) => calc.gfr_value);
    const timePoints = gfrHistory.map((calc: GFRCalculation) => calc.calculation_date.getTime());
    
    // Linear regression to calculate rate of decline
    const n = gfrValues.length;
    const sumX = timePoints.reduce((a: number, b: number) => a + b, 0);
    const sumY = gfrValues.reduce((a: number, b: number) => a + b, 0);
    const sumXY = timePoints.reduce((sum: number, x: number, i: number) => sum + x * gfrValues[i], 0);
    const sumXX = timePoints.reduce((sum: number, x: number) => sum + x * x, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Convert slope to mL/min/1.73m²/year
    const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000;
    const rateOfDecline = slope * millisecondsPerYear;
    
    let trendDirection: 'improving' | 'stable' | 'declining' | 'fluctuating';
    let riskProgression: 'low' | 'moderate' | 'high' | 'very_high';
    
    if (rateOfDecline > 1) {
      trendDirection = 'improving';
      riskProgression = 'low';
    } else if (rateOfDecline > -1) {
      trendDirection = 'stable';
      riskProgression = 'low';
    } else if (rateOfDecline > -5) {
      trendDirection = 'declining';
      riskProgression = 'moderate';
    } else if (rateOfDecline > -10) {
      trendDirection = 'declining';
      riskProgression = 'high';
    } else {
      trendDirection = 'declining';
      riskProgression = 'very_high';
    }
    
    // Check for fluctuation
    const variance = this.calculateVariance(gfrValues);
    if (variance > 0.25) { // High coefficient of variation indicates fluctuation
      trendDirection = 'fluctuating';
    }
    
    // Estimate time to dialysis (GFR < 15)
    let timeToDialysis: number | undefined;
    if (rateOfDecline < -1 && gfrHistory[gfrHistory.length - 1].gfr_value > 15) {
      const currentGFR = gfrHistory[gfrHistory.length - 1].gfr_value;
      timeToDialysis = Math.round((currentGFR - 15) / Math.abs(rateOfDecline) * 12); // months
    }
    
    const trendAnalysis = this.generateTrendAnalysis(
      gfrHistory, 
      trendDirection, 
      rateOfDecline, 
      timeToDialysis
    );
    
    const followUpRecommendations = this.generateTrendRecommendations(
      trendDirection, 
      riskProgression, 
      gfrHistory[gfrHistory.length - 1].ckd_stage
    );

    return {
      patient_id: patientId,
      gfr_calculations: gfrHistory,
      trend_direction: trendDirection,
      trend_analysis: trendAnalysis,
      rate_of_decline: Math.round(rateOfDecline * 10) / 10,
      time_to_dialysis_estimate: timeToDialysis,
      risk_progression: riskProgression,
      follow_up_recommendations: followUpRecommendations
    };
  }

  private generateTrendAnalysis(
    history: GFRCalculation[], 
    direction: string, 
    rate: number, 
    timeToDialysis?: number
  ): string {
    const latestGFR = history[history.length - 1].gfr_value;
    const oldestGFR = history[0].gfr_value;
    const timeSpan = Math.round((history[history.length - 1].calculation_date.getTime() - 
                               history[0].calculation_date.getTime()) / (30.44 * 24 * 60 * 60 * 1000)); // months
    
    let analysis = `GFR trend over ${timeSpan} months shows ${direction} pattern. `;
    analysis += `Current GFR: ${latestGFR} mL/min/1.73m² (from ${oldestGFR} mL/min/1.73m²). `;
    
    if (direction === 'declining') {
      analysis += `Rate of decline: ${Math.abs(rate).toFixed(1)} mL/min/1.73m²/year. `;
      if (timeToDialysis && timeToDialysis > 0) {
        analysis += `Estimated time to dialysis requirement: ${timeToDialysis} months. `;
      }
    } else if (direction === 'improving') {
      analysis += `Rate of improvement: ${rate.toFixed(1)} mL/min/1.73m²/year. `;
    }
    
    return analysis + `Based on ${history.length} measurements.`;
  }

  private generateTrendRecommendations(
    direction: string, 
    risk: string, 
    ckdStage: number
  ): string[] {
    const baseRecommendations = [
      'Continue current management',
      'Monitor blood pressure closely',
      'Optimize diabetes control if applicable'
    ];
    
    if (direction === 'declining') {
      if (risk === 'high' || risk === 'very_high') {
        return [
          'Urgent nephrology referral',
          'Evaluate for reversible causes of kidney function decline',
          'Consider more frequent monitoring (every 3-6 months)',
          'Review and adjust medications affecting kidney function',
          'Initiate renal replacement therapy planning if Stage 4-5',
          'Cardiovascular risk assessment and management'
        ];
      } else {
        return [
          'Nephrology consultation recommended',
          'Increase monitoring frequency to every 6 months',
          'Review medications and doses',
          'Lifestyle modifications counseling',
          'Blood pressure optimization'
        ];
      }
    } else if (direction === 'improving') {
      return [
        'Continue current successful management',
        'Maintain current monitoring schedule',
        'Reinforce lifestyle modifications',
        'Monitor for sustainability of improvement'
      ];
    } else if (direction === 'fluctuating') {
      return [
        'Investigate causes of GFR fluctuation',
        'Review medication adherence',
        'Assess for acute kidney injury episodes',
        'Consider more frequent monitoring',
        'Evaluate fluid balance and dehydration'
      ];
    }
    
    return baseRecommendations;
  }

  async autoGenerateGFRFromResults(patientId: string, demographics: PatientDemographics): Promise<GFRCalculation[]> {
    // Get all creatinine results for the patient
    const results = await this.getLabResults(patientId);
    const creatinineResults = results.filter(result => 
      result.test_id.toLowerCase().includes('creatinine') ||
      result.test_id.toLowerCase().includes('crea') ||
      result.test_id === 'Cr'
    );

    const gfrCalculations: GFRCalculation[] = [];

    for (const result of creatinineResults) {
      try {
        // Parse creatinine value
        const creatinineValue = parseFloat(result.result_value);
        if (isNaN(creatinineValue)) continue;

        // Check if GFR already calculated for this result
        const existingGFR = await db.gfr_calculations
          .where('patient_id')
          .equals(patientId)
          .filter((calc: GFRCalculation) => 
            Math.abs(calc.calculation_date.getTime() - result.result_date.getTime()) < 24 * 60 * 60 * 1000 && // Within 24 hours
            calc.creatinine_value === creatinineValue
          )
          .first();

        if (existingGFR) continue; // Skip if already calculated

        const gfrCalc = await this.calculateGFR(
          patientId,
          creatinineValue,
          result.unit,
          demographics
        );

        gfrCalculations.push(gfrCalc);
      } catch (error) {
        console.error('Error calculating GFR for result:', result.id, error);
      }
    }

    return gfrCalculations;
  }
}

export const labService = new LabService();