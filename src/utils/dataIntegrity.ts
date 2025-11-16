// Data Persistence Verification Utility
// This utility helps verify that patient data is properly persisted in IndexedDB

import { db } from '../db/database';

export interface DataIntegrityReport {
  totalPatients: number;
  activePatients: number;
  deletedPatients: number;
  patientsWithoutDates: number;
  recentPatients: any[];
  oldestPatient: any;
  newestPatient: any;
}

/**
 * Verify database integrity and return detailed report
 */
export const verifyDataIntegrity = async (): Promise<DataIntegrityReport> => {
  try {
    const allPatients = await db.patients.toArray();
    
    const activePatients = allPatients.filter(p => !p.deleted);
    const deletedPatients = allPatients.filter(p => p.deleted);
    const patientsWithoutDates = allPatients.filter(p => !p.created_at);
    
    const sortedByDate = [...allPatients].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    
    const recentPatients = [...allPatients]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);
    
    const report: DataIntegrityReport = {
      totalPatients: allPatients.length,
      activePatients: activePatients.length,
      deletedPatients: deletedPatients.length,
      patientsWithoutDates: patientsWithoutDates.length,
      recentPatients: recentPatients.map(p => ({
        id: p.id,
        hospital_number: p.hospital_number,
        name: `${p.first_name} ${p.last_name}`,
        created_at: p.created_at,
        deleted: p.deleted
      })),
      oldestPatient: sortedByDate[0] ? {
        id: sortedByDate[0].id,
        hospital_number: sortedByDate[0].hospital_number,
        name: `${sortedByDate[0].first_name} ${sortedByDate[0].last_name}`,
        created_at: sortedByDate[0].created_at
      } : null,
      newestPatient: sortedByDate[sortedByDate.length - 1] ? {
        id: sortedByDate[sortedByDate.length - 1].id,
        hospital_number: sortedByDate[sortedByDate.length - 1].hospital_number,
        name: `${sortedByDate[sortedByDate.length - 1].first_name} ${sortedByDate[sortedByDate.length - 1].last_name}`,
        created_at: sortedByDate[sortedByDate.length - 1].created_at
      } : null
    };
    
    console.log('📊 Data Integrity Report:', report);
    return report;
  } catch (error) {
    console.error('Error verifying data integrity:', error);
    throw error;
  }
};

/**
 * Monitor patient count over time
 * Logs patient count every 30 seconds to detect data loss
 */
export const startDataMonitoring = () => {
  let previousCount = 0;
  
  const checkData = async () => {
    try {
      const patients = await db.patients.toArray();
      const activeCount = patients.filter(p => !p.deleted).length;
      
      if (activeCount < previousCount) {
        console.error('🚨 DATA LOSS DETECTED! Patient count decreased from', previousCount, 'to', activeCount);
        console.error('Missing patients:', previousCount - activeCount);
        
        // Log deleted patients
        const deletedRecently = patients.filter(p => p.deleted);
        if (deletedRecently.length > 0) {
          console.error('Deleted patients found:', deletedRecently);
        }
      } else if (activeCount > previousCount) {
        console.log('✅ New patients added. Count increased from', previousCount, 'to', activeCount);
      }
      
      previousCount = activeCount;
    } catch (error) {
      console.error('Error monitoring data:', error);
    }
  };
  
  // Check immediately
  checkData();
  
  // Check every 30 seconds
  const intervalId = setInterval(checkData, 30000);
  
  console.log('🔍 Data monitoring started. Will check patient count every 30 seconds.');
  
  return () => {
    clearInterval(intervalId);
    console.log('🛑 Data monitoring stopped.');
  };
};

/**
 * Enable debug mode for database operations
 */
export const enableDatabaseDebugMode = () => {
  console.log('🐛 Database debug mode enabled');
  
  // Log all database operations
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  // Already enabled via hooks in database.ts
  console.log('✅ Database hooks are logging all create, update, and delete operations');
};

/**
 * Export patient data for backup
 */
export const exportPatientBackup = async (): Promise<string> => {
  try {
    const patients = await db.patients.toArray();
    const backup = {
      exported_at: new Date().toISOString(),
      patient_count: patients.length,
      active_count: patients.filter(p => !p.deleted).length,
      deleted_count: patients.filter(p => p.deleted).length,
      patients: patients
    };
    
    const json = JSON.stringify(backup, null, 2);
    console.log('💾 Backup created:', backup.patient_count, 'patients');
    
    return json;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
};

/**
 * Download backup as JSON file
 */
export const downloadBackup = async () => {
  try {
    const json = await exportPatientBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `patient-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Backup downloaded successfully');
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw error;
  }
};
