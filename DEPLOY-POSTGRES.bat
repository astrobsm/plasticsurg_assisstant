@echo off
echo ================================================
echo PostgreSQL Database Deployment Script
echo Plastic Surgeon Assistant Application
echo ================================================
echo.

REM Check if files exist
if not exist "server\db\schema.sql" (
    echo ERROR: schema.sql not found!
    pause
    exit /b 1
)

if not exist "server\db\seed.sql" (
    echo ERROR: seed.sql not found!
    pause
    exit /b 1
)

if not exist "server\index-postgres.js" (
    echo ERROR: index-postgres.js not found!
    pause
    exit /b 1
)

echo Step 1: Uploading database schema files...
echo ================================================
scp server\db\schema.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload schema.sql
    pause
    exit /b 1
)

scp server\db\seed.sql root@164.90.225.181:/var/www/plasticsurg_assisstant/server/db/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload seed.sql
    pause
    exit /b 1
)
echo ✓ Database files uploaded successfully
echo.

echo Step 2: Uploading backend files...
echo ================================================
scp server\index-postgres.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload index-postgres.js
    pause
    exit /b 1
)

scp server\syncRoutes.js root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload syncRoutes.js
    pause
    exit /b 1
)

scp server\package.json root@164.90.225.181:/var/www/plasticsurg_assisstant/server/
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to upload package.json
    pause
    exit /b 1
)
echo ✓ Backend files uploaded successfully
echo.

echo Step 3: Installing PostgreSQL dependencies...
echo ================================================
ssh root@164.90.225.181 "cd /var/www/plasticsurg_assisstant/server && npm install pg node-fetch"
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

echo ================================================
echo DEPLOYMENT SUCCESSFUL!
echo ================================================
echo.
echo IMPORTANT: Before continuing, you must:
echo.
echo 1. Create PostgreSQL database on Digital Ocean
echo    - Go to: https://cloud.digitalocean.com/databases
echo    - Create PostgreSQL 15 cluster
echo    - Create database: plasticsurg_app
echo    - Create user: plasticsurg_user
echo    - Add trusted source: 164.90.225.181
echo.
echo 2. Update .env file with PostgreSQL connection
echo    - SSH: ssh root@164.90.225.181
echo    - Edit: nano /var/www/plasticsurg_assisstant/server/.env
echo    - Set DATABASE_URL to your PostgreSQL connection string
echo.
echo 3. Run database schema migration
echo    - See POSTGRESQL_DEPLOYMENT_GUIDE.md section 3.3
echo.
echo 4. Activate PostgreSQL backend
echo    - SSH: ssh root@164.90.225.181
echo    - Backup: mv /var/www/plasticsurg_assisstant/server/index.js /var/www/plasticsurg_assisstant/server/index-mysql-backup.js
echo    - Activate: mv /var/www/plasticsurg_assisstant/server/index-postgres.js /var/www/plasticsurg_assisstant/server/index.js
echo    - Restart: pm2 restart backend
echo    - Check: pm2 logs backend --lines 50
echo.
echo 5. Test the deployment
echo    - Health: curl http://localhost:3001/api/health
echo    - Login: curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d "{\"email\":\"admin@unth.edu.ng\",\"password\":\"Admin@123\"}"
echo.
echo For detailed instructions, see:
echo    POSTGRESQL_DEPLOYMENT_GUIDE.md
echo.
pause
