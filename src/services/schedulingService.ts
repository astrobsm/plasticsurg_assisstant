import { db } from '../db/database';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';

// Scheduling Interfaces
export interface WardRound {
  id: string;
  date: Date;
  ward_name: string;
  start_time: string;
  end_time: string;
  consultant: string;
  registrar?: string;
  intern?: string;
  patients: WardRoundPatient[];
  notes: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface WardRoundPatient {
  patient_id: string;
  patient_name: string;
  bed_number: string;
  diagnosis: string;
  priority: 'routine' | 'urgent' | 'critical';
  post_op_day?: number;
  notes: string;
  tasks: string[];
  seen: boolean;
  seen_time?: Date;
}

export interface ClinicSession {
  id: string;
  date: Date;
  clinic_type: 'general_plastic' | 'reconstructive' | 'aesthetic' | 'hand_surgery' | 'burn_clinic' | 'follow_up';
  location: string;
  start_time: string;
  end_time: string;
  consultant: string;
  max_patients: number;
  appointments: ClinicAppointment[];
  notes: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface ClinicAppointment {
  id: string;
  patient_id: string;
  patient_name: string;
  appointment_time: string;
  appointment_type: 'new_patient' | 'follow_up' | 'pre_op' | 'post_op' | 'consultation';
  chief_complaint: string;
  duration_minutes: number;
  priority: 'routine' | 'urgent' | 'emergency';
  notes: string;
  status: 'scheduled' | 'arrived' | 'in_progress' | 'completed' | 'no_show' | 'cancelled';
  arrival_time?: Date;
  completion_time?: Date;
}

export interface SurgeryBooking {
  id: string;
  date: Date;
  theatre_number: string;
  start_time: string;
  estimated_end_time: string;
  actual_end_time?: string;
  primary_surgeon: string;
  assistant_surgeon?: string;
  anaesthetist: string;
  scrub_nurse: string;
  circulating_nurse: string;
  patient_id: string;
  patient_name: string;
  procedure_name: string;
  procedure_code: string;
  urgency: 'elective' | 'urgent' | 'emergency';
  anaesthesia_type: 'general' | 'regional' | 'local' | 'sedation';
  estimated_duration_minutes: number;
  special_requirements: string[];
  equipment_needed: string[];
  implants_needed: string[];
  blood_type?: string;
  allergies: string[];
  medical_conditions: string[];
  pre_op_checklist_completed: boolean;
  consent_obtained: boolean;
  notes: string;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'postponed';
  created_at: Date;
  updated_at: Date;
}

export interface OperationList {
  id: string;
  date: Date;
  theatre_complex: string;
  generated_at: Date;
  generated_by: string;
  surgeries: SurgeryBooking[];
  total_cases: number;
  estimated_total_time: number;
  notes: string;
}

class SchedulingService {
  // Ward Rounds Management
  async createWardRound(wardRound: Omit<WardRound, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `ward_round_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newWardRound: WardRound = {
      ...wardRound,
      id,
      created_at: now,
      updated_at: now
    };

    await db.ward_rounds.add(newWardRound);
    return id;
  }

  async getWardRounds(date?: Date): Promise<WardRound[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.ward_rounds
        .where('date')
        .between(startOfDay, endOfDay)
        .toArray();
    }
    
    return await db.ward_rounds.orderBy('date').toArray();
  }

  async updateWardRoundStatus(id: string, status: WardRound['status']): Promise<void> {
    await db.ward_rounds.update(id, { status, updated_at: new Date() });
  }

  async markPatientSeen(wardRoundId: string, patientId: string): Promise<void> {
    const wardRound = await db.ward_rounds.get(wardRoundId);
    if (wardRound) {
      const updatedPatients = wardRound.patients.map(patient => 
        patient.patient_id === patientId 
          ? { ...patient, seen: true, seen_time: new Date() }
          : patient
      );
      await db.ward_rounds.update(wardRoundId, { 
        patients: updatedPatients, 
        updated_at: new Date() 
      });
    }
  }

  // Clinic Sessions Management
  async createClinicSession(session: Omit<ClinicSession, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `clinic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newSession: ClinicSession = {
      ...session,
      id,
      created_at: now,
      updated_at: now
    };

    await db.clinic_sessions.add(newSession);
    return id;
  }

  async getClinicSessions(date?: Date): Promise<ClinicSession[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      return await db.clinic_sessions
        .where('date')
        .between(startOfDay, endOfDay)
        .toArray();
    }
    
    return await db.clinic_sessions.orderBy('date').toArray();
  }

  async addAppointmentToClinic(sessionId: string, appointment: Omit<ClinicAppointment, 'id'>): Promise<string> {
    const session = await db.clinic_sessions.get(sessionId);
    if (!session) throw new Error('Clinic session not found');
    
    if (session.appointments.length >= session.max_patients) {
      throw new Error('Clinic is fully booked');
    }
    
    const appointmentId = `appt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newAppointment: ClinicAppointment = {
      ...appointment,
      id: appointmentId
    };
    
    const updatedAppointments = [...session.appointments, newAppointment];
    await db.clinic_sessions.update(sessionId, {
      appointments: updatedAppointments,
      updated_at: new Date()
    });
    
    return appointmentId;
  }

  async updateAppointmentStatus(sessionId: string, appointmentId: string, status: ClinicAppointment['status']): Promise<void> {
    const session = await db.clinic_sessions.get(sessionId);
    if (session) {
      const updatedAppointments = session.appointments.map(apt =>
        apt.id === appointmentId 
          ? { ...apt, status, ...(status === 'arrived' ? { arrival_time: new Date() } : {}) }
          : apt
      );
      await db.clinic_sessions.update(sessionId, {
        appointments: updatedAppointments,
        updated_at: new Date()
      });
    }
  }

  // Surgery Booking Management
  async createSurgeryBooking(booking: Omit<SurgeryBooking, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const id = `surgery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const newBooking: SurgeryBooking = {
      ...booking,
      id,
      created_at: now,
      updated_at: now
    };

    await db.surgery_bookings.add(newBooking);
    return id;
  }

  async getSurgeryBookings(date?: Date): Promise<SurgeryBooking[]> {
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const surgeries = await db.surgery_bookings
        .where('date')
        .between(startOfDay, endOfDay)
        .toArray();
      
      // Sort manually since Dexie doesn't support orderBy after where clause
      return surgeries.sort((a, b) => a.start_time.localeCompare(b.start_time));
    }
    
    return await db.surgery_bookings.orderBy('date').toArray();
  }

  async updateSurgeryStatus(id: string, status: SurgeryBooking['status']): Promise<void> {
    await db.surgery_bookings.update(id, { status, updated_at: new Date() });
  }

  // Operation List Generation
  async generateOperationList(date: Date, theatreComplex: string): Promise<OperationList> {
    const surgeries = await this.getSurgeryBookings(date);
    const filteredSurgeries = surgeries.filter(s => 
      s.status === 'scheduled' || s.status === 'confirmed'
    );
    
    const totalCases = filteredSurgeries.length;
    const estimatedTotalTime = filteredSurgeries.reduce((total, surgery) => 
      total + surgery.estimated_duration_minutes, 0
    );
    
    const operationList: OperationList = {
      id: `op_list_${Date.now()}`,
      date,
      theatre_complex: theatreComplex,
      generated_at: new Date(),
      generated_by: 'System', // Should be current user
      surgeries: filteredSurgeries,
      total_cases: totalCases,
      estimated_total_time: estimatedTotalTime,
      notes: ''
    };
    
    return operationList;
  }

  async generateOperationListPDF(operationList: OperationList): Promise<void> {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(20);
    pdf.text('OPERATION LIST', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${format(operationList.date, 'EEEE, MMMM d, yyyy')}`, 20, 35);
    pdf.text(`Theatre Complex: ${operationList.theatre_complex}`, 20, 45);
    pdf.text(`Generated: ${format(operationList.generated_at, 'HH:mm dd/MM/yyyy')}`, 20, 55);
    pdf.text(`Total Cases: ${operationList.total_cases}`, 20, 65);
    pdf.text(`Estimated Total Time: ${Math.floor(operationList.estimated_total_time / 60)}h ${operationList.estimated_total_time % 60}m`, 20, 75);
    
    // Table headers
    let yPosition = 90;
    pdf.setFontSize(10);
    pdf.text('Time', 20, yPosition);
    pdf.text('Patient', 45, yPosition);
    pdf.text('Procedure', 85, yPosition);
    pdf.text('Surgeon', 130, yPosition);
    pdf.text('Anaesthetist', 165, yPosition);
    
    // Draw header line
    pdf.line(20, yPosition + 2, 190, yPosition + 2);
    yPosition += 10;
    
    // Surgery entries
    operationList.surgeries.forEach((surgery, index) => {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(surgery.start_time, 20, yPosition);
      pdf.text(surgery.patient_name.substring(0, 15), 45, yPosition);
      pdf.text(surgery.procedure_name.substring(0, 20), 85, yPosition);
      pdf.text(surgery.primary_surgeon.substring(0, 15), 130, yPosition);
      pdf.text(surgery.anaesthetist.substring(0, 12), 165, yPosition);
      
      yPosition += 8;
      
      // Add procedure details on next line
      pdf.setFontSize(8);
      pdf.text(`${surgery.urgency.toUpperCase()} | ${surgery.anaesthesia_type} | ${surgery.estimated_duration_minutes}min`, 45, yPosition);
      pdf.setFontSize(10);
      yPosition += 10;
    });
    
    // Footer
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      pdf.text('Plastic Surgery Department', 105, 295, { align: 'center' });
    }
    
    // Save the PDF
    pdf.save(`Operation_List_${format(operationList.date, 'yyyy-MM-dd')}.pdf`);
  }

  // Utility Methods
  async getWeeklySchedule(date: Date): Promise<{
    wardRounds: WardRound[];
    clinics: ClinicSession[];
    surgeries: SurgeryBooking[];
  }> {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 }); // Sunday
    
    const wardRounds = await db.ward_rounds
      .where('date')
      .between(weekStart, weekEnd)
      .toArray();
      
    const clinics = await db.clinic_sessions
      .where('date')
      .between(weekStart, weekEnd)
      .toArray();
      
    const surgeries = await db.surgery_bookings
      .where('date')
      .between(weekStart, weekEnd)
      .toArray();
    
    return { wardRounds, clinics, surgeries };
  }

  async getSchedulingStats(startDate: Date, endDate: Date): Promise<{
    totalWardRounds: number;
    totalClinicSessions: number;
    totalSurgeries: number;
    completedWardRounds: number;
    completedClinics: number;
    completedSurgeries: number;
  }> {
    const wardRounds = await db.ward_rounds
      .where('date')
      .between(startDate, endDate)
      .toArray();
      
    const clinics = await db.clinic_sessions
      .where('date')
      .between(startDate, endDate)
      .toArray();
      
    const surgeries = await db.surgery_bookings
      .where('date')
      .between(startDate, endDate)
      .toArray();
    
    return {
      totalWardRounds: wardRounds.length,
      totalClinicSessions: clinics.length,
      totalSurgeries: surgeries.length,
      completedWardRounds: wardRounds.filter(wr => wr.status === 'completed').length,
      completedClinics: clinics.filter(c => c.status === 'completed').length,
      completedSurgeries: surgeries.filter(s => s.status === 'completed').length
    };
  }
}

export const schedulingService = new SchedulingService();