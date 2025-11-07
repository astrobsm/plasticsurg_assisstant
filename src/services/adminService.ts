// Admin Service - Handles administrative functions and system management
import { db } from '../db/database';

export interface SystemSettings {
  id: string;
  applicationName: string;
  defaultLanguage: string;
  sessionTimeout: number;
  require2FA: boolean;
  passwordComplexity: boolean;
  auditLogging: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  maxFileSize: number;
  allowedFileTypes: string[];
  emailNotifications: boolean;
  maintenanceMode: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'auth' | 'database' | 'api' | 'user_action' | 'system' | 'security';
  message: string;
  details?: any;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export interface BackupRecord {
  id: string;
  fileName: string;
  fileSize: number;
  recordCount: number;
  createdAt: Date;
  createdBy: string;
  status: 'completed' | 'failed' | 'in_progress';
  description?: string;
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: 'patient' | 'procedure' | 'lab' | 'admin' | 'system';
  actions: ('create' | 'read' | 'update' | 'delete' | 'execute')[];
}

export class AdminService {
  private static instance: AdminService;

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // System Settings Management
  async getSystemSettings(): Promise<SystemSettings> {
    // In a real app, this would come from the database
    return {
      id: 'system_settings',
      applicationName: 'Plastic Surgeon Assistant',
      defaultLanguage: 'en',
      sessionTimeout: 30,
      require2FA: false,
      passwordComplexity: true,
      auditLogging: true,
      backupFrequency: 'daily',
      maxFileSize: 10485760, // 10MB
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      emailNotifications: true,
      maintenanceMode: false,
      updatedAt: new Date(),
      updatedBy: 'admin'
    };
  }

  async updateSystemSettings(settings: Partial<SystemSettings>): Promise<void> {
    // In a real app, this would update the database
    await this.logSystemAction('UPDATE', 'system_settings', 'System settings updated', settings);
  }

  // User Management
  async getUserPermissions(): Promise<UserPermission[]> {
    return [
      {
        id: 'patient_management',
        name: 'Patient Management',
        description: 'Create, view, edit, and delete patient records',
        category: 'patient',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        id: 'procedure_management',
        name: 'Procedure Management',
        description: 'Manage surgical procedures and checklists',
        category: 'procedure',
        actions: ['create', 'read', 'update', 'execute']
      },
      {
        id: 'lab_management',
        name: 'Laboratory Management',
        description: 'Manage lab orders, results, and interpretations',
        category: 'lab',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        id: 'user_administration',
        name: 'User Administration',
        description: 'Manage user accounts and permissions',
        category: 'admin',
        actions: ['create', 'read', 'update', 'delete']
      },
      {
        id: 'system_administration',
        name: 'System Administration',
        description: 'Full system administration access',
        category: 'system',
        actions: ['create', 'read', 'update', 'delete', 'execute']
      }
    ];
  }

  async validateUserCredentials(email: string, password: string): Promise<boolean> {
    // In a real app, this would validate against the database
    // For demo purposes, return true for admin@hospital.com
    return email === 'admin@hospital.com' && password.length > 0;
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    // In a real app, this would update the user's password in the database
    console.log(`Password reset for user ${userId}, new password length: ${newPassword.length}`);
    await this.logSystemAction('UPDATE', 'user_password', `Password reset for user ${userId}`);
  }

  // System Monitoring
  async getSystemHealth(): Promise<{
    database: 'healthy' | 'warning' | 'error';
    memory: 'healthy' | 'warning' | 'error';
    disk: 'healthy' | 'warning' | 'error';
    network: 'healthy' | 'warning' | 'error';
    services: 'healthy' | 'warning' | 'error';
  }> {
    return {
      database: 'healthy',
      memory: 'healthy',
      disk: 'healthy',
      network: navigator.onLine ? 'healthy' : 'error',
      services: 'healthy'
    };
  }

  async getSystemMetrics(): Promise<{
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLatency: number;
    activeConnections: number;
    requestsPerMinute: number;
    errorRate: number;
    uptime: number;
  }> {
    // Mock metrics - in a real app these would come from system monitoring
    return {
      cpuUsage: Math.random() * 50 + 25, // 25-75%
      memoryUsage: Math.random() * 40 + 30, // 30-70%
      diskUsage: Math.random() * 30 + 20, // 20-50%
      networkLatency: Math.random() * 50 + 10, // 10-60ms
      activeConnections: Math.floor(Math.random() * 50) + 10, // 10-60
      requestsPerMinute: Math.floor(Math.random() * 100) + 50, // 50-150
      errorRate: Math.random() * 2, // 0-2%
      uptime: Date.now() - (15 * 24 * 60 * 60 * 1000) // 15 days ago
    };
  }

  // Database Management
  async getDatabaseInfo(): Promise<{
    version: string;
    size: number;
    tables: { name: string; recordCount: number; size: number }[];
    lastOptimized: Date;
    backupStatus: 'current' | 'outdated' | 'missing';
  }> {
    try {
      const tables = await Promise.all([
        db.patients.count().then(count => ({ name: 'patients', recordCount: count, size: count * 1024 })),
        db.treatment_plans.count().then(count => ({ name: 'treatment_plans', recordCount: count, size: count * 512 })),
        db.lab_results.count().then(count => ({ name: 'lab_results', recordCount: count, size: count * 256 })),
        db.surgery_bookings.count().then(count => ({ name: 'surgery_bookings', recordCount: count, size: count * 384 }))
      ]);

      const totalSize = tables.reduce((sum, table) => sum + table.size, 0);

      return {
        version: '2.0',
        size: totalSize,
        tables: tables,
        lastOptimized: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        backupStatus: 'current'
      };
    } catch (error) {
      console.error('Error getting database info:', error);
      throw error;
    }
  }

  async createDatabaseBackup(description?: string): Promise<BackupRecord> {
    try {
      // Get all data from all tables
      const [patients, treatmentPlans, labResults, surgeryBookings] = await Promise.all([
        db.patients.toArray(),
        db.treatment_plans.toArray(),
        db.lab_results.toArray(),
        db.surgery_bookings.toArray()
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        version: '2.0',
        data: {
          patients,
          treatmentPlans,
          labResults,
          surgeryBookings
        }
      };

      // In a real app, this would be sent to a server or saved as a file
      const backupString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([backupString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const backupRecord: BackupRecord = {
        id: `backup_${Date.now()}`,
        fileName: link.download,
        fileSize: blob.size,
        recordCount: patients.length + treatmentPlans.length + labResults.length + surgeryBookings.length,
        createdAt: new Date(),
        createdBy: 'admin',
        status: 'completed',
        description
      };

      await this.logSystemAction('CREATE', 'database_backup', 'Database backup created', backupRecord);
      return backupRecord;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  async restoreDatabaseBackup(file: File): Promise<void> {
    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.data) {
        throw new Error('Invalid backup file format');
      }

      // Clear existing data
      await db.transaction('rw', db.patients, db.treatment_plans, db.lab_results, db.surgery_bookings, async () => {
        await db.patients.clear();
        await db.treatment_plans.clear();
        await db.lab_results.clear();
        await db.surgery_bookings.clear();

        // Restore data
        if (backupData.data.patients) await db.patients.bulkAdd(backupData.data.patients);
        if (backupData.data.treatmentPlans) await db.treatment_plans.bulkAdd(backupData.data.treatmentPlans);
        if (backupData.data.labResults) await db.lab_results.bulkAdd(backupData.data.labResults);
        if (backupData.data.surgeryBookings) await db.surgery_bookings.bulkAdd(backupData.data.surgeryBookings);
      });

      await this.logSystemAction('UPDATE', 'database_restore', 'Database restored from backup', { fileName: file.name });
    } catch (error) {
      console.error('Error restoring backup:', error);
      throw error;
    }
  }

  async optimizeDatabase(): Promise<void> {
    try {
      // In a real app, this would run database optimization commands
      await this.logSystemAction('EXECUTE', 'database_optimize', 'Database optimization completed');
    } catch (error) {
      console.error('Error optimizing database:', error);
      throw error;
    }
  }

  // Logging and Audit
  async logSystemAction(
    action: string, 
    resource: string, 
    message: string, 
    details?: any,
    userId: string = 'admin'
  ): Promise<void> {
    const logEntry: SystemLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level: 'info',
      category: 'system',
      message: `[${action}] ${resource}: ${message}`,
      details,
      userId,
      userName: 'System Administrator',
      ipAddress: '127.0.0.1',
      userAgent: navigator.userAgent,
      timestamp: new Date()
    };

    // In a real app, this would be stored in a logs table
    console.log('System Log:', logEntry);
  }

  async getSystemLogs(
    filters?: {
      level?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<SystemLog[]> {
    // Mock logs - in a real app these would come from a logs table
    const mockLogs: SystemLog[] = [
      {
        id: '1',
        level: 'info',
        category: 'system',
        message: 'System startup completed',
        timestamp: new Date(Date.now() - 60000),
        userId: 'system',
        userName: 'System'
      },
      {
        id: '2',
        level: 'warning',
        category: 'database',
        message: 'Database connection timeout',
        timestamp: new Date(Date.now() - 120000),
        userId: 'system',
        userName: 'System'
      }
    ];

    // Apply filters if provided
    let filteredLogs = mockLogs;
    
    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filters.level);
      }
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        filteredLogs = filteredLogs.slice(0, filters.limit);
      }
    }

    return filteredLogs;
  }

  // Security Functions
  async generateSecurityReport(): Promise<{
    failedLogins: number;
    suspiciousActivity: number;
    vulnerabilities: string[];
    recommendations: string[];
    lastScan: Date;
  }> {
    return {
      failedLogins: 3,
      suspiciousActivity: 0,
      vulnerabilities: [],
      recommendations: [
        'Update to latest application version',
        'Review user permissions',
        'Enable two-factor authentication',
        'Regular password policy enforcement'
      ],
      lastScan: new Date()
    };
  }

  async exportAuditReport(startDate: Date, endDate: Date): Promise<Blob> {
    const logs = await this.getSystemLogs({
      startDate,
      endDate
    });

    const csvContent = [
      'Timestamp,Level,Category,Message,User,IP Address',
      ...logs.map(log => 
        `${log.timestamp.toISOString()},${log.level},${log.category},"${log.message}",${log.userName || 'Unknown'},${log.ipAddress || 'Unknown'}`
      )
    ].join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  // Maintenance Functions
  async setMaintenanceMode(enabled: boolean, message?: string): Promise<void> {
    await this.updateSystemSettings({ 
      maintenanceMode: enabled,
      updatedAt: new Date(),
      updatedBy: 'admin'
    });

    await this.logSystemAction(
      'UPDATE', 
      'maintenance_mode', 
      `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`,
      { message }
    );
  }

  async sendSystemNotification(
    type: 'info' | 'warning' | 'error',
    title: string,
    message: string,
    recipients?: string[]
  ): Promise<void> {
    // In a real app, this would send notifications via email, SMS, or in-app notifications
    console.log('System Notification:', { type, title, message, recipients });
    
    await this.logSystemAction(
      'CREATE',
      'system_notification',
      `Notification sent: ${title}`,
      { type, message, recipients }
    );
  }

  // Analytics and Reporting
  async getUsageAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<{
    userLogins: { date: string; count: number }[];
    patientOperations: { date: string; count: number }[];
    systemErrors: { date: string; count: number }[];
    performanceMetrics: { date: string; responseTime: number; errorRate: number }[];
  }> {
    // Mock analytics data - adjust range based on period
    const now = new Date();
    const data = [];
    
    // Determine number of data points based on period
    const dataPoints = period === 'day' ? 7 : period === 'week' ? 4 : period === 'month' ? 12 : 52;
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(now);
      if (period === 'day') {
        date.setDate(date.getDate() - i);
      } else if (period === 'week') {
        date.setDate(date.getDate() - (i * 7));
      } else if (period === 'month') {
        date.setMonth(date.getMonth() - i);
      } else {
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() - (i * 7));
      }
      
      data.push({
        date: period === 'year' ? date.getFullYear().toString() : 
              period === 'month' ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` :
              date.toISOString().split('T')[0],
        userLogins: Math.floor(Math.random() * 50) + 20,
        patientOperations: Math.floor(Math.random() * 30) + 10,
        systemErrors: Math.floor(Math.random() * 5),
        responseTime: Math.random() * 200 + 100,
        errorRate: Math.random() * 2
      });
    }

    return {
      userLogins: data.map(d => ({ date: d.date, count: d.userLogins })),
      patientOperations: data.map(d => ({ date: d.date, count: d.patientOperations })),
      systemErrors: data.map(d => ({ date: d.date, count: d.systemErrors })),
      performanceMetrics: data.map(d => ({ 
        date: d.date, 
        responseTime: d.responseTime, 
        errorRate: d.errorRate 
      }))
    };
  }
}

export const adminService = AdminService.getInstance();