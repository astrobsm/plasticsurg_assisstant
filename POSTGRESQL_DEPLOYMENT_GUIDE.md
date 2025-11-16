# PostgreSQL Database Deployment Guide
## Digital Ocean Managed PostgreSQL Integration

This guide will help you set up a robust PostgreSQL database for the Plastic Surgeon Assistant application.

---

## 📋 Table of Contents

1. [Create PostgreSQL Database on Digital Ocean](#step-1-create-postgresql-database)
2. [Configure Connection](#step-2-configure-connection)
3. [Initialize Database Schema](#step-3-initialize-schema)
4. [Deploy Backend](#step-4-deploy-backend)
5. [Test Integration](#step-5-test-integration)
6. [Migration from MySQL](#step-6-migration-optional)

---

## Step 1: Create PostgreSQL Database

### 1.1 Navigate to Digital Ocean Databases

1. Go to https://cloud.digitalocean.com/databases
2. Click **"Create Database Cluster"**
3. Select **PostgreSQL** as database engine
4. Choose version: **PostgreSQL 15** (recommended)

### 1.2 Configure Database Cluster

**Basic Configuration:**
- **Data Center Region**: Frankfurt 1 (or closest to your droplet)
- **Database Cluster Name**: `plasticsurg-db`
- **Node Plan**: 
  - Development: Basic ($15/month - 1GB RAM, 10GB Disk, 1 vCPU)
  - Production: Basic ($25/month - 2GB RAM, 25GB Disk, 1 vCPU)

**Advanced Settings:**
- **Trusted Sources**: Add your droplet IP (164.90.225.181)
- **Connection Pools**: Enable for better performance
- **Automatic Backups**: Daily (included)

### 1.3 Create Database

After cluster is created:
1. Click on **"Users & Databases"** tab
2. Create a new database: `plasticsurg_app`
3. Create a new user: `plasticsurg_user` with strong password

---

## Step 2: Configure Connection

### 2.1 Get Connection Details

From Digital Ocean dashboard, copy:
- **Host**: `your-db-cluster-do-user-xxxxx-0.x.db.ondigitalocean.com`
- **Port**: `25060`
- **User**: `plasticsurg_user`
- **Password**: `[generated password]`
- **Database**: `plasticsurg_app`
- **SSL Mode**: Required

### 2.2 Update Backend .env File

SSH into your droplet:
```bash
ssh root@164.90.225.181
```

Edit the backend .env file:
```bash
nano /var/www/plasticsurg_assisstant/server/.env
```

Update with PostgreSQL connection string:
```env
# PostgreSQL Database URL
DATABASE_URL=postgresql://plasticsurg_user:[PASSWORD]@[HOST]:25060/plasticsurg_app?sslmode=require

# JWT Secret
JWT_SECRET=plastic_surgery_assistant_secret_key_2024

# Server Port
PORT=3001
```

**Example**:
```env
DATABASE_URL=postgresql://plasticsurg_user:AVNS_xxxxxxxxx@plasticsurg-db-do-user-12345-0.c.db.ondigitalocean.com:25060/plasticsurg_app?sslmode=require
JWT_SECRET=plastic_surgery_assistant_secret_key_2024
PORT=3001
```

Save and exit (Ctrl+X, Y, Enter)

---

## Step 3: Initialize Schema

### 3.1 Upload Database Files

From your local machine:

```powershell
# Upload schema file
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\db\schema.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/

# Upload seed file
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\db\seed.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/
```

### 3.2 Install PostgreSQL Client on Droplet

```bash
ssh root@164.90.225.181
apt-get update
apt-get install -y postgresql-client
```

### 3.3 Run Schema Migration

Replace placeholders with your actual connection details:

```bash
# Set connection string
export PGPASSWORD='your_password_here'

# Run schema creation
psql -h your-db-host.db.ondigitalocean.com \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -f /var/www/plasticsurg_assisstant/server/db/schema.sql

# Run seed data
psql -h your-db-host.db.ondigitalocean.com \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -f /var/www/plasticsurg_assisstant/server/db/seed.sql

# Clear password from environment
unset PGPASSWORD
```

### 3.4 Verify Tables Created

```bash
export PGPASSWORD='your_password_here'

psql -h your-db-host.db.ondigitalocean.com \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -c "\dt"

unset PGPASSWORD
```

You should see all tables listed.

---

## Step 4: Deploy Backend

### 4.1 Upload New Backend Files

From your local machine:

```powershell
# Upload new PostgreSQL backend
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\index-postgres.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/

# Upload sync routes
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\syncRoutes.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/

# Upload updated package.json
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\package.json root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
```

### 4.2 Install PostgreSQL Driver

```bash
ssh root@164.90.225.181
cd /var/www/plasticsurg_assisstant/server
npm install pg node-fetch
```

### 4.3 Backup Current Backend

```bash
mv /var/www/plasticsurg_assisstant/server/index.js /var/www/plasticsurg_assisstant/server/index-mysql-backup.js
```

### 4.4 Activate PostgreSQL Backend

```bash
mv /var/www/plasticsurg_assisstant/server/index-postgres.js /var/www/plasticsurg_assisstant/server/index.js
```

### 4.5 Restart Backend Service

```bash
pm2 restart backend
pm2 logs backend --lines 50
```

Look for:
```
✅ Connected to PostgreSQL database
📊 PostgreSQL version: PostgreSQL 15.x
✅ Database schema initialized
✅ Seed data inserted
✅ Default users verified
🚀 Backend server running on port 3001
```

---

## Step 5: Test Integration

### 5.1 Test Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-11-16T..."
}
```

### 5.2 Test Login

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@unth.edu.ng",
    "password": "Admin@123"
  }'
```

Should return:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "admin-001",
    "email": "admin@unth.edu.ng",
    "full_name": "System Administrator",
    "role": "super_admin"
  },
  "message": "Login successful"
}
```

### 5.3 Test Frontend Connection

1. Open browser: http://164.90.225.181
2. Login with:
   - Email: `admin@unth.edu.ng`
   - Password: `Admin@123`
3. Navigate to Patients page
4. Register a test patient
5. Check browser console for sync logs

---

## Step 6: Migration from MySQL (Optional)

If you have existing data in MySQL that needs to be migrated:

### 6.1 Export MySQL Data

```bash
# Export patients
mysql -h mysql-host -u user -p database -e "SELECT * FROM patients" --batch --raw > patients.csv

# Export users (excluding passwords for security)
mysql -h mysql-host -u user -p database -e "SELECT id, email, full_name, role FROM users" --batch --raw > users.csv
```

### 6.2 Import to PostgreSQL

```bash
# Create temporary import table
psql -h pg-host -U pg-user -d pg-database -c "CREATE TABLE temp_import (...);"

# Copy data
\copy temp_import FROM 'patients.csv' WITH CSV HEADER

# Migrate with transformations
INSERT INTO patients SELECT ... FROM temp_import;
```

### 6.3 Verify Migration

```bash
# Check record counts
psql -h pg-host -U pg-user -d pg-database -c "SELECT COUNT(*) FROM patients;"
```

---

## 📊 Database Schema Overview

The PostgreSQL database includes **26 tables**:

### Core Tables
- `users` - User accounts and authentication
- `ai_settings` - AI/OpenAI configuration

### Patient Management
- `patients` - Patient demographics and medical info
- `patient_admissions` - Hospital admissions records

### Treatment Planning
- `treatment_plans` - Treatment plan headers
- `treatment_plan_steps` - Individual treatment steps

### Surgical Procedures
- `surgery_bookings` - Surgery scheduling
- `surgical_checklists` - WHO-style safety checklists
- `surgical_consumables` - Inventory items
- `consumable_usage` - Usage tracking

### Laboratory
- `lab_investigations` - Lab orders and results

### Prescriptions
- `prescriptions` - Prescription headers
- `prescription_items` - Individual medications

### Wound Care
- `wound_care_records` - Wound assessment and treatment

### CME/Education
- `cme_topics` - Educational content
- `mcq_questions` - Assessment questions
- `user_assessments` - User test results

### MDT (Multidisciplinary Team)
- `mdt_meetings` - Meeting scheduling
- `mdt_cases` - Patient case discussions

### Audit
- `audit_logs` - Complete audit trail

---

## 🔒 Security Best Practices

### Database Security

1. **Connection Pooling**: Limited to 20 connections
2. **SSL Required**: All connections use TLS encryption
3. **Trusted Sources**: Only your droplet IP can connect
4. **Strong Passwords**: Generated by Digital Ocean
5. **Regular Backups**: Daily automated backups

### Application Security

1. **JWT Authentication**: 24-hour token expiration
2. **Password Hashing**: bcrypt with salt rounds 10
3. **RBAC**: Role-based access control
4. **Soft Deletes**: Data never permanently deleted
5. **Audit Logging**: All actions tracked

---

## 🚀 Performance Optimization

### Indexes Created

All tables have optimized indexes on:
- Primary keys (UUID)
- Foreign keys
- Frequently queried fields (status, dates, names)
- Deleted flag for soft deletes

### Triggers

Auto-update `updated_at` timestamp on every update

### Connection Pool

- Max connections: 20
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds

---

## 📈 Monitoring

### Check Database Status

```bash
# Connection count
psql -h host -U user -d db -c "SELECT count(*) FROM pg_stat_activity;"

# Active queries
psql -h host -U user -d db -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Database size
psql -h host -U user -d db -c "SELECT pg_size_pretty(pg_database_size('plasticsurg_app'));"

# Table sizes
psql -h host -U user -d db -c "SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size FROM pg_tables WHERE schemaname = 'public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;"
```

### PM2 Monitoring

```bash
pm2 status
pm2 logs backend --lines 100
pm2 monit
```

---

## 🐛 Troubleshooting

### Connection Issues

**Problem**: "Connection refused"
```bash
# Check if PostgreSQL is accessible
telnet your-db-host 25060

# Check firewall rules in Digital Ocean
# Ensure droplet IP is in trusted sources
```

**Problem**: "SSL connection required"
```bash
# Ensure DATABASE_URL includes sslmode=require
# Check SSL certificates are valid
```

### Schema Issues

**Problem**: "Table already exists"
```bash
# This is normal if running schema.sql multiple times
# Script uses "CREATE TABLE IF NOT EXISTS"
```

**Problem**: "Default users not created"
```bash
# Manually create admin user
psql -h host -U user -d db
INSERT INTO users (id, email, password, full_name, role, department, is_approved, is_active)
VALUES ('admin-001', 'admin@unth.edu.ng', '$2b$10$...', 'System Administrator', 'super_admin', 'Administration', true, true);
```

### Backend Issues

**Problem**: "Cannot find module 'pg'"
```bash
cd /var/www/plasticsurg_assisstant/server
npm install pg
pm2 restart backend
```

**Problem**: "Database connection error"
```bash
# Check .env file
cat /var/www/plasticsurg_assisstant/server/.env

# Test connection manually
export PGPASSWORD='password'
psql -h host -U user -d db -c "SELECT 1;"
```

---

## 📚 Next Steps

1. ✅ **Database Created** - PostgreSQL cluster running
2. ✅ **Schema Initialized** - All 26 tables created
3. ✅ **Backend Deployed** - Node.js connected to PostgreSQL
4. ✅ **Users Created** - Admin and sample consultant
5. 🔄 **Frontend Sync** - Configure IndexedDB → PostgreSQL sync
6. 🔄 **Test Workflows** - Register patients, create treatments
7. 🔄 **Production Ready** - Monitor, backup, optimize

---

## 💡 Support

For issues or questions:
- Check PM2 logs: `pm2 logs backend`
- Check PostgreSQL logs in Digital Ocean dashboard
- Review connection string format
- Ensure firewall rules allow connections
- Verify SSL certificates

---

**Created**: November 16, 2025  
**Version**: 1.0  
**Database**: PostgreSQL 15  
**Framework**: Node.js + Express + pg
