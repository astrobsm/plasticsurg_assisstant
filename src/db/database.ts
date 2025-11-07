import Dexie, { Table } from 'dexie';
import { CMETopic, CMEQuestion, TestSession, CMEProgress, CMECertificate } from '../services/aiService';
import { WardRound, ClinicSession, SurgeryBooking } from '../services/schedulingService';
import { LabInvestigation, LabResult, GFRCalculation } from '../services/labService';
import { BaseRiskAssessment, DVTRiskAssessment, PressureSoreRiskAssessment, NutritionalRiskAssessment } from '../services/riskAssessmentService';
import { ClinicalTopic, GeneratedMCQ, MCQTestSchedule, MCQTestSession, StudyMaterial, NotificationSchedule } from '../services/mcqGenerationService';

// Define the data structures for offline storage
export interface Patient {
  id?: number;
  serverId?: string; // Server ID when synced
  hospital_number: string;
  first_name: string;
  last_name: string;
  dob: string;
  sex: 'male' | 'female' | 'other';
  phone?: string;
  address?: string;
  allergies?: string[];
  comorbidities?: string[];
  created_at: Date;
  updated_at: Date;
  synced: boolean;
  deleted?: boolean;
}

export interface TreatmentPlan {
  id?: number;
  serverId?: string;
  patient_id: number;
  title: string;
  diagnosis: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  start_date: Date;
  planned_end_date?: Date;
  description?: string;
  created_by: string; // user ID
  created_at: Date;
  updated_at: Date;
  synced: boolean;
  deleted?: boolean;
}

export interface PlanStep {
  id?: number;
  serverId?: string;
  plan_id: number;
  step_number: number;
  title: string;
  description?: string;
  assigned_to?: string;
  due_date?: Date;
  duration?: number; // minutes
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completed_at?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  synced: boolean;
  deleted?: boolean;
}

export interface SyncQueue {
  id?: number;
  action: 'create' | 'update' | 'delete';
  table: string;
  local_id: number;
  data: any;
  created_at: Date;
  retries: number;
  last_error?: string;
}

// Define the database
export class PlasticSurgeonDB extends Dexie {
  patients!: Table<Patient>;
  treatment_plans!: Table<TreatmentPlan>;
  plan_steps!: Table<PlanStep>;
  sync_queue!: Table<SyncQueue>;
  cmeTopics!: Table<CMETopic>;
  testSessions!: Table<TestSession>;
  cmeProgress!: Table<CMEProgress>;
  cmeCertificates!: Table<CMECertificate>;
  ward_rounds!: Table<WardRound>;
  clinic_sessions!: Table<ClinicSession>;
  surgery_bookings!: Table<SurgeryBooking>;
  lab_investigations!: Table<LabInvestigation>;
  lab_results!: Table<LabResult>;
  gfr_calculations!: Table<GFRCalculation>;
  dvt_assessments!: Table<DVTRiskAssessment>;
  pressure_sore_assessments!: Table<PressureSoreRiskAssessment>;
  nutritional_assessments!: Table<NutritionalRiskAssessment>;
  clinical_topics!: Table<ClinicalTopic>;
  generated_mcqs!: Table<GeneratedMCQ>;
  mcq_test_schedules!: Table<MCQTestSchedule>;
  mcq_test_sessions!: Table<MCQTestSession>;
  study_materials!: Table<StudyMaterial>;
  notification_schedules!: Table<NotificationSchedule>;

  constructor() {
    super('PlasticSurgeonDB');
    
    // Version 1: Initial schema
    this.version(1).stores({
      patients: '++id, serverId, hospital_number, first_name, last_name, created_at, synced, deleted',
      treatment_plans: '++id, serverId, patient_id, title, status, created_at, synced, deleted',
      plan_steps: '++id, serverId, plan_id, step_number, status, due_date, created_at, synced, deleted',
      sync_queue: '++id, action, table, local_id, created_at, retries',
      cmeTopics: '++id, title, category, weekOf, estimatedDuration',
      testSessions: '++id, userId, topicId, startedAt, completedAt',
      cmeProgress: '++id, [userId+topicId], userId, topicId, completed, lastAttempt',
      cmeCertificates: '++id, userId, topicId, issuedAt, validUntil',
      ward_rounds: '++id, date, ward_name, consultant, status, created_at',
      clinic_sessions: '++id, date, clinic_type, consultant, status, created_at',
      surgery_bookings: '++id, date, theatre_number, primary_surgeon, patient_id, status, created_at',
      lab_investigations: '++id, patient_id, request_date, requested_by, status, urgency, created_at',
      lab_results: '++id, investigation_id, patient_id, test_id, result_date, abnormal_flag, created_at'
    });

    // Version 2: Add GFR calculations table
    this.version(2).stores({
      patients: '++id, serverId, hospital_number, first_name, last_name, created_at, synced, deleted',
      treatment_plans: '++id, serverId, patient_id, title, status, created_at, synced, deleted',
      plan_steps: '++id, serverId, plan_id, step_number, status, due_date, created_at, synced, deleted',
      sync_queue: '++id, action, table, local_id, created_at, retries',
      cmeTopics: '++id, title, category, weekOf, estimatedDuration',
      testSessions: '++id, userId, topicId, startedAt, completedAt',
      cmeProgress: '++id, [userId+topicId], userId, topicId, completed, lastAttempt',
      cmeCertificates: '++id, userId, topicId, issuedAt, validUntil',
      ward_rounds: '++id, date, ward_name, consultant, status, created_at',
      clinic_sessions: '++id, date, clinic_type, consultant, status, created_at',
      surgery_bookings: '++id, date, theatre_number, primary_surgeon, patient_id, status, created_at',
      lab_investigations: '++id, patient_id, request_date, requested_by, status, urgency, created_at',
      lab_results: '++id, investigation_id, patient_id, test_id, result_date, abnormal_flag, created_at',
      gfr_calculations: '++id, patient_id, calculation_date, gfr_value, ckd_stage, created_at'
    });

    // Version 3: Add risk assessment tables
    this.version(3).stores({
      patients: '++id, serverId, hospital_number, first_name, last_name, created_at, synced, deleted',
      treatment_plans: '++id, serverId, patient_id, title, status, created_at, synced, deleted',
      plan_steps: '++id, serverId, plan_id, step_number, status, due_date, created_at, synced, deleted',
      sync_queue: '++id, action, table, local_id, created_at, retries',
      cmeTopics: '++id, title, category, weekOf, estimatedDuration',
      testSessions: '++id, userId, topicId, startedAt, completedAt',
      cmeProgress: '++id, [userId+topicId], userId, topicId, completed, lastAttempt',
      cmeCertificates: '++id, userId, topicId, issuedAt, validUntil',
      ward_rounds: '++id, date, ward_name, consultant, status, created_at',
      clinic_sessions: '++id, date, clinic_type, consultant, status, created_at',
      surgery_bookings: '++id, date, theatre_number, primary_surgeon, patient_id, status, created_at',
      lab_investigations: '++id, patient_id, request_date, requested_by, status, urgency, created_at',
      lab_results: '++id, investigation_id, patient_id, test_id, result_date, abnormal_flag, created_at',
      gfr_calculations: '++id, patient_id, calculation_date, gfr_value, ckd_stage, created_at',
      dvt_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at',
      pressure_sore_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at',
      nutritional_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at'
    });

    // Version 4: Add MCQ generation and assessment tables
    this.version(4).stores({
      patients: '++id, serverId, hospital_number, first_name, last_name, created_at, synced, deleted',
      treatment_plans: '++id, serverId, patient_id, title, status, created_at, synced, deleted',
      plan_steps: '++id, serverId, plan_id, step_number, status, due_date, created_at, synced, deleted',
      sync_queue: '++id, action, table, local_id, created_at, retries',
      cmeTopics: '++id, title, category, weekOf, estimatedDuration',
      testSessions: '++id, userId, topicId, startedAt, completedAt',
      cmeProgress: '++id, [userId+topicId], userId, topicId, completed, lastAttempt',
      cmeCertificates: '++id, userId, topicId, issuedAt, validUntil',
      ward_rounds: '++id, date, ward_name, consultant, status, created_at',
      clinic_sessions: '++id, date, clinic_type, consultant, status, created_at',
      surgery_bookings: '++id, date, theatre_number, primary_surgeon, patient_id, status, created_at',
      lab_investigations: '++id, patient_id, request_date, requested_by, status, urgency, created_at',
      lab_results: '++id, investigation_id, patient_id, test_id, result_date, abnormal_flag, created_at',
      gfr_calculations: '++id, patient_id, calculation_date, gfr_value, ckd_stage, created_at',
      dvt_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at',
      pressure_sore_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at',
      nutritional_assessments: '++id, patient_id, assessment_date, assessment_type, risk_level, score, status, assessed_by, created_at',
      clinical_topics: '++id, title, category, uploadedAt, status, uploadedBy',
      generated_mcqs: '++id, topicId, targetLevel, difficulty, category, generatedAt',
      mcq_test_schedules: '++id, topicId, scheduledFor, status, notificationSent',
      mcq_test_sessions: '++id, userId, scheduleId, topicId, startedAt, completedAt, userLevel',
      study_materials: '++id, sessionId, userId, generatedAt',
      notification_schedules: '++id, userId, scheduleId, scheduledFor, sent, sentAt, type'
    });

    // Add hooks to automatically track changes
    this.patients.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
      obj.synced = false;
    });

    this.patients.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
      if (!modifications.hasOwnProperty('synced')) {
        modifications.synced = false;
      }
    });

    this.treatment_plans.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
      obj.synced = false;
    });

    this.treatment_plans.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
      if (!modifications.hasOwnProperty('synced')) {
        modifications.synced = false;
      }
    });

    this.plan_steps.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
      obj.synced = false;
    });

    this.plan_steps.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
      if (!modifications.hasOwnProperty('synced')) {
        modifications.synced = false;
      }
    });

    // Add hooks for risk assessment tables
    this.dvt_assessments.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
    });

    this.dvt_assessments.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
    });

    this.pressure_sore_assessments.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
    });

    this.pressure_sore_assessments.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
    });

    this.nutritional_assessments.hook('creating', (primKey, obj, trans) => {
      obj.created_at = new Date();
      obj.updated_at = new Date();
    });

    this.nutritional_assessments.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updated_at = new Date();
    });
  }
}

// Create the database instance
export const db = new PlasticSurgeonDB();