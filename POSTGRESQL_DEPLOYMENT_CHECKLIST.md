# PostgreSQL Deployment Checklist

## 📋 Pre-Deployment Checklist

### Digital Ocean Account
- [ ] Active Digital Ocean account
- [ ] Payment method configured
- [ ] Access to database creation

### Local Environment
- [ ] All files downloaded/created
- [ ] SSH access to droplet (164.90.225.181)
- [ ] SCP/SFTP capability confirmed

---

## 🗄️ Database Setup (30 minutes)

### 1. Create PostgreSQL Cluster
- [ ] Login to Digital Ocean dashboard
- [ ] Navigate to Databases section
- [ ] Click "Create Database Cluster"
- [ ] Select **PostgreSQL 15**
- [ ] Choose datacenter region (Frankfurt 1 recommended)
- [ ] Select plan:
  - [ ] Development: $15/month (1GB RAM, 10GB Disk)
  - [ ] Production: $25/month (2GB RAM, 25GB Disk)
- [ ] Name cluster: `plasticsurg-db`
- [ ] Click "Create Database Cluster"
- [ ] Wait 3-5 minutes for provisioning

### 2. Configure Database Access
- [ ] Click on "Users & Databases" tab
- [ ] Create new database: `plasticsurg_app`
- [ ] Create new user: `plasticsurg_user`
- [ ] Copy generated password (save securely!)
- [ ] Go to "Settings" tab
- [ ] Click "Add Trusted Source"
- [ ] Enter droplet IP: `164.90.225.181`
- [ ] Save settings

### 3. Copy Connection Details
- [ ] Copy host address (format: `name-do-user-xxxxx-0.x.db.ondigitalocean.com`)
- [ ] Copy port (usually `25060`)
- [ ] Copy username (`plasticsurg_user`)
- [ ] Copy password (from step 2)
- [ ] Copy database name (`plasticsurg_app`)

**Connection String Format:**
```
postgresql://plasticsurg_user:[PASSWORD]@[HOST]:25060/plasticsurg_app?sslmode=require
```

---

## 📁 File Upload (10 minutes)

### Upload Database Files
Run these commands from your local machine:

```powershell
# Schema file
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\db\schema.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/
```
- [ ] schema.sql uploaded (verify: 100% complete)

```powershell
# Seed data file
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\db\seed.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/
```
- [ ] seed.sql uploaded (verify: 100% complete)

### Upload Backend Files

```powershell
# New PostgreSQL backend
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\index-postgres.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
```
- [ ] index-postgres.js uploaded

```powershell
# Sync routes module
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\syncRoutes.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
```
- [ ] syncRoutes.js uploaded

```powershell
# Updated package.json
scp C:\Users\USER\PLASTIC-SURGASSISSTANT\server\package.json root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
```
- [ ] package.json uploaded

**OR use the automated script:**
```powershell
DEPLOY-POSTGRES.bat
```
- [ ] Automated deployment completed

---

## ⚙️ Configuration (15 minutes)

### 1. SSH into Droplet
```bash
ssh root@164.90.225.181
```
- [ ] SSH connection successful

### 2. Update Environment Variables
```bash
cd /var/www/plasticsurg_assisstant/server
nano .env
```

Update to:
```env
DATABASE_URL=postgresql://plasticsurg_user:[YOUR_PASSWORD]@[YOUR_HOST]:25060/plasticsurg_app?sslmode=require
JWT_SECRET=plastic_surgery_assistant_secret_key_2024
PORT=3001
```

- [ ] DATABASE_URL updated with correct credentials
- [ ] JWT_SECRET confirmed
- [ ] PORT set to 3001
- [ ] File saved (Ctrl+X, Y, Enter)

### 3. Install Dependencies
```bash
cd /var/www/plasticsurg_assisstant/server
npm install pg node-fetch
```
- [ ] `pg` installed successfully
- [ ] `node-fetch` installed successfully
- [ ] No error messages

---

## 🔧 Database Initialization (10 minutes)

### 1. Install PostgreSQL Client
```bash
apt-get update
apt-get install -y postgresql-client
```
- [ ] PostgreSQL client installed

### 2. Set Database Password
```bash
export PGPASSWORD='[YOUR_DATABASE_PASSWORD]'
```
- [ ] Password exported to environment

### 3. Run Schema Migration
```bash
psql -h [YOUR_HOST] \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -f /var/www/plasticsurg_assisstant/server/db/schema.sql
```
- [ ] Schema executed without errors
- [ ] UUID extension created
- [ ] All 26 tables created
- [ ] Indexes created
- [ ] Triggers created

### 4. Run Seed Data
```bash
psql -h [YOUR_HOST] \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -f /var/www/plasticsurg_assisstant/server/db/seed.sql
```
- [ ] Seed data inserted
- [ ] Default users created
- [ ] Sample consumables added

### 5. Verify Tables
```bash
psql -h [YOUR_HOST] \
     -p 25060 \
     -U plasticsurg_user \
     -d plasticsurg_app \
     -c "\dt"
```
- [ ] All 26 tables listed
- [ ] No errors displayed

### 6. Clear Password from Environment
```bash
unset PGPASSWORD
```
- [ ] Password cleared from environment

---

## 🚀 Backend Deployment (10 minutes)

### 1. Backup Current Backend
```bash
cd /var/www/plasticsurg_assisstant/server
mv index.js index-mysql-backup.js
```
- [ ] Current backend backed up

### 2. Activate PostgreSQL Backend
```bash
mv index-postgres.js index.js
```
- [ ] PostgreSQL backend activated

### 3. Restart Backend Service
```bash
pm2 restart backend
```
- [ ] Backend restarted successfully
- [ ] Process shows "online" status

### 4. Check Backend Logs
```bash
pm2 logs backend --lines 50 --nostream
```

Look for these messages:
- [ ] ✅ Connected to PostgreSQL database
- [ ] 📊 PostgreSQL version: PostgreSQL 15.x
- [ ] ✅ Database schema initialized (or skip if already done)
- [ ] ✅ Seed data inserted (or skip if already done)
- [ ] ✅ Default users verified
- [ ] 🚀 Backend server running on port 3001
- [ ] 📍 http://localhost:3001

**Any errors?**
- [ ] No errors in logs
- [ ] If errors: check DATABASE_URL format
- [ ] If errors: verify database connection

---

## ✅ Testing (15 minutes)

### 1. Health Check
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
- [ ] Status: healthy
- [ ] Database: connected
- [ ] Timestamp returned

### 2. Test Login
```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@unth.edu.ng","password":"Admin@123"}'
```

Expected response:
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
- [ ] Token received
- [ ] User object returned
- [ ] Login successful message
- [ ] No error messages

### 3. Test Frontend Connection
Open browser: `http://164.90.225.181`

- [ ] Website loads successfully
- [ ] Login page displays
- [ ] No console errors in browser

Login with:
- Email: `admin@unth.edu.ng`
- Password: `Admin@123`

- [ ] Login successful
- [ ] Dashboard loads
- [ ] User name displays in header

### 4. Test Patient Registration
Navigate to **Patients** page:

- [ ] Patients page loads
- [ ] Registration form displays
- [ ] Create a test patient:
  - Hospital Number: TEST001
  - First Name: John
  - Last Name: Doe
  - Date of Birth: 1990-01-01
  - Gender: Male

- [ ] Patient created successfully
- [ ] Patient appears in list
- [ ] Open browser console (F12)
- [ ] Check for sync logs
- [ ] Verify no errors

### 5. Verify Database Sync
Back on the server:
```bash
export PGPASSWORD='[YOUR_PASSWORD]'
psql -h [YOUR_HOST] -p 25060 -U plasticsurg_user -d plasticsurg_app -c "SELECT COUNT(*) FROM patients;"
unset PGPASSWORD
```
- [ ] Count shows at least 1 patient
- [ ] Test patient is in database

### 6. Test AI Configuration (Optional)
Login as admin → Navigate to Admin → Settings

- [ ] AI Configuration section visible
- [ ] Can enter OpenAI API key
- [ ] Settings save successfully

---

## 🎉 Post-Deployment (30 minutes)

### 1. Monitor Performance
```bash
pm2 monit
```
- [ ] CPU usage < 50%
- [ ] Memory usage acceptable
- [ ] No restarts occurring

### 2. Check Database Metrics
Login to Digital Ocean → Databases → Your Cluster

- [ ] CPU usage normal (< 50%)
- [ ] Memory usage normal (< 70%)
- [ ] Connection count acceptable
- [ ] No alerts

### 3. Configure Backups
In Digital Ocean Database Dashboard:

- [ ] Verify daily backups enabled
- [ ] Set retention period (7 days recommended)
- [ ] Note backup window time

### 4. Set Up Monitoring Alerts
In Digital Ocean → Databases → Settings → Alerts

- [ ] CPU usage alert (threshold: 80%)
- [ ] Memory usage alert (threshold: 80%)
- [ ] Storage usage alert (threshold: 75%)
- [ ] Add notification email

### 5. Document Credentials
Save securely (password manager recommended):

- [ ] Database host address
- [ ] Database port
- [ ] Database name
- [ ] Database username
- [ ] Database password
- [ ] Admin user email/password
- [ ] Connection string

### 6. Update Documentation
- [ ] Update README.md with PostgreSQL info
- [ ] Document any custom configurations
- [ ] Note deployment date and version

---

## 🔐 Security Checklist

### Database Security
- [ ] SSL/TLS enabled and required
- [ ] Only droplet IP in trusted sources
- [ ] Strong database password used
- [ ] Default PostgreSQL port NOT exposed to internet
- [ ] Regular backups configured

### Application Security
- [ ] JWT_SECRET is strong and unique
- [ ] Default admin password changed (recommended)
- [ ] HTTPS enabled on frontend (recommended)
- [ ] Rate limiting configured (recommended)

---

## 🐛 Troubleshooting

### Issue: Cannot connect to database
**Check:**
- [ ] DATABASE_URL format correct
- [ ] Host address copied correctly
- [ ] Port is 25060
- [ ] SSL mode is 'require'
- [ ] Droplet IP in trusted sources
- [ ] Database user has correct permissions

**Test connection:**
```bash
psql -h [HOST] -p 25060 -U plasticsurg_user -d plasticsurg_app -c "SELECT 1;"
```

### Issue: Backend won't start
**Check:**
- [ ] `pm2 logs backend` for errors
- [ ] .env file exists and readable
- [ ] pg module installed (`npm list pg`)
- [ ] index.js is the PostgreSQL version
- [ ] Port 3001 not already in use

### Issue: Login fails
**Check:**
- [ ] Health endpoint works
- [ ] Users table has default users
- [ ] Password hashing working
- [ ] JWT_SECRET is set
- [ ] Browser console for errors

### Issue: Frontend sync not working
**Check:**
- [ ] Network tab in browser DevTools
- [ ] API endpoints returning data
- [ ] CORS enabled on backend
- [ ] Authentication token being sent
- [ ] IndexedDB not corrupted

---

## 📊 Success Criteria

### ✅ Deployment Successful When:
- [ ] PostgreSQL database created and accessible
- [ ] All 26 tables created in database
- [ ] Backend connects to PostgreSQL successfully
- [ ] Health check returns "healthy"
- [ ] Admin login works
- [ ] Patient registration works
- [ ] Data syncs to PostgreSQL
- [ ] No errors in PM2 logs
- [ ] No errors in browser console
- [ ] Dashboard displays real-time data

---

## 📞 Support Resources

### Documentation
- [ ] POSTGRESQL_DEPLOYMENT_GUIDE.md - Detailed instructions
- [ ] POSTGRESQL_IMPLEMENTATION_SUMMARY.md - Technical overview
- [ ] server/db/schema.sql - Database schema

### Digital Ocean Resources
- [ ] Database dashboard: https://cloud.digitalocean.com/databases
- [ ] Documentation: https://docs.digitalocean.com/products/databases/postgresql/
- [ ] Community: https://www.digitalocean.com/community/

### Testing URLs
- [ ] Health: http://164.90.225.181:3001/api/health
- [ ] Frontend: http://164.90.225.181
- [ ] PM2 Monitor: `pm2 monit` (on server)

---

## 🎯 Next Steps After Deployment

### Week 1: Testing & Validation
- [ ] Test all major workflows
- [ ] Verify sync functionality
- [ ] Test offline mode
- [ ] Check performance
- [ ] Review logs daily

### Week 2: User Training
- [ ] Create user documentation
- [ ] Train staff on new features
- [ ] Collect feedback
- [ ] Address issues

### Week 3: Optimization
- [ ] Analyze query performance
- [ ] Optimize slow queries
- [ ] Review backup strategy
- [ ] Fine-tune connection pool

### Month 2: Production Hardening
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring dashboard
- [ ] Create disaster recovery plan
- [ ] Document runbooks

---

## 📝 Notes

**Deployment Date:** _______________

**Deployed By:** _______________

**Database Cluster Name:** _______________

**Database Plan:** _______________

**Issues Encountered:**
- 
- 
- 

**Resolutions:**
- 
- 
- 

**Additional Notes:**
- 
- 
- 

---

**Version:** 1.0  
**Last Updated:** November 16, 2025  
**Status:** ✅ Ready for Use
