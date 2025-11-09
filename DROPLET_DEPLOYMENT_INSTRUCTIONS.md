# Plastic Surgeon Assistant - Deployment Instructions

## 🚀 Deploy to Your Digital Ocean Droplet

### **Droplet Information:**
- **Name**: PLASTICSURGEONASSISSTANT
- **IP Address**: 164.90.225.181
- **Private IP**: 10.114.0.3
- **Location**: Frankfurt (FRA1)
- **OS**: Ubuntu 24.04 LTS x64
- **Resources**: 1 GB Memory / 25 GB Disk
- **Database**: [Configure in Digital Ocean Dashboard]

---

## 📋 Deployment Steps

### **Option 1: Automatic Deployment (Recommended)**

#### **Step 1: Copy the deployment script to your droplet**

```powershell
# From your local machine (Windows PowerShell)
scp deploy-to-droplet.sh root@164.90.225.181:~/
```

#### **Step 2: SSH into your droplet**

```powershell
ssh root@164.90.225.181
```

#### **Step 3: Run the deployment script**

```bash
# Make script executable
chmod +x ~/deploy-to-droplet.sh

# Run deployment
./deploy-to-droplet.sh
```

The script will automatically:
- ✅ Update system packages
- ✅ Install Node.js 20.x
- ✅ Install Nginx web server
- ✅ Clone your GitHub repository
- ✅ Install dependencies
- ✅ Build production app
- ✅ Configure Nginx
- ✅ Set up firewall
- ✅ Start the application

---

### **Option 2: Manual Deployment**

If you prefer to run commands manually:

#### **1. SSH into droplet:**
```bash
ssh root@164.90.225.181
```

#### **2. Update system:**
```bash
apt update && apt upgrade -y
```

#### **3. Install Node.js 20.x:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

#### **4. Install Nginx:**
```bash
apt install -y nginx
```

#### **5. Install Git:**
```bash
apt install -y git
```

#### **6. Clone repository:**
```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/astrobsm/plasticsurg_assisstant.git
cd plasticsurg_assisstant
```

#### **7. Install dependencies:**
```bash
npm install --legacy-peer-deps
```

#### **8. Build production app:**
```bash
npm run build
```

#### **9. Configure Nginx:**
```bash
nano /etc/nginx/sites-available/plasticsurg
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name 164.90.225.181;
    root /var/www/plasticsurg_assisstant/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /sw.js {
        add_header Cache-Control "no-cache";
    }
}
```

#### **10. Enable site and restart Nginx:**
```bash
ln -s /etc/nginx/sites-available/plasticsurg /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

#### **11. Configure firewall:**
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

---

## 🌐 Access Your Application

**URL**: http://164.90.225.181

### **Default Login Credentials:**
- **Admin**: 
  - Email: `admin@unth.edu.ng`
  - Password: `admin123`

- **Doctor**: 
  - Email: `doctor@unth.edu.ng`
  - Password: `doctor123`

---

## 🔄 Updating the Application

When you push changes to GitHub:

```bash
# SSH into droplet
ssh root@164.90.225.181

# Navigate to app directory
cd /var/www/plasticsurg_assisstant

# Pull latest changes
git pull origin main

# Rebuild
npm install --legacy-peer-deps
npm run build

# Restart Nginx
systemctl restart nginx
```

---

## 🔐 Setting Up SSL (HTTPS)

### **If you have a domain name:**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### **Update Nginx config to use domain:**
```bash
nano /etc/nginx/sites-available/plasticsurg
# Change: server_name 164.90.225.181;
# To: server_name yourdomain.com;
```

---

## 💾 Database Integration (Future)

**Your database**: Check Digital Ocean dashboard for connection details

Currently, the app uses **IndexedDB** (client-side storage). To integrate with your Digital Ocean database:

1. **Get database connection details** from Digital Ocean dashboard
2. **Create backend API** (Node.js/Express)
3. **Update frontend** to call backend API
4. **Migrate data** from IndexedDB to PostgreSQL/MySQL

---

## 🧪 Testing Checklist

After deployment, test these features:

- [ ] App loads at http://164.90.225.181
- [ ] Login with default credentials
- [ ] Register new patient
- [ ] Create treatment plan
- [ ] Submit lab request
- [ ] Take MCQ assessment
- [ ] View CME articles
- [ ] Book surgery
- [ ] PWA install prompt appears
- [ ] Service worker caches assets
- [ ] Offline functionality works

---

## 📊 Monitoring

### **Check Nginx logs:**
```bash
# Error logs
tail -f /var/log/nginx/plasticsurg_error.log

# Access logs
tail -f /var/log/nginx/plasticsurg_access.log
```

### **Check Nginx status:**
```bash
systemctl status nginx
```

### **Check disk space:**
```bash
df -h
```

### **Check memory usage:**
```bash
free -m
```

---

## 🚨 Troubleshooting

### **App not loading:**
```bash
# Check if Nginx is running
systemctl status nginx

# Check if build exists
ls -la /var/www/plasticsurg_assisstant/dist

# Rebuild if needed
cd /var/www/plasticsurg_assisstant
npm run build
```

### **502 Bad Gateway:**
```bash
# Check Nginx error logs
tail -f /var/log/nginx/plasticsurg_error.log

# Restart Nginx
systemctl restart nginx
```

### **Permission denied:**
```bash
# Fix permissions
chown -R www-data:www-data /var/www/plasticsurg_assisstant
chmod -R 755 /var/www/plasticsurg_assisstant
```

---

## 📞 Support Commands

### **Restart services:**
```bash
systemctl restart nginx
```

### **View running processes:**
```bash
ps aux | grep nginx
```

### **Check ports:**
```bash
netstat -tlnp | grep :80
```

### **Update app from GitHub:**
```bash
cd /var/www/plasticsurg_assisstant
git pull
npm install --legacy-peer-deps
npm run build
systemctl restart nginx
```

---

## 🎉 Deployment Complete!

Your Plastic Surgeon Assistant PWA is now live at:

**http://164.90.225.181**

Start using the application and monitor the logs for any issues!
