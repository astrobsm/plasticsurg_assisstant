# Plastic Surgeon Assistant PWA

A Progressive Web App for plastic surgery clinical workflows, designed for interns and resident doctors.

## 🏥 Overview

This PWA provides comprehensive support for patient care workflows in plastic & reconstructive surgery including:
- Patient management and treatment plans
- Prescription management
- Wound care protocols  
- Surgical consumables lists
- Safety checklists and pre-op workflow
- Lab ordering and results
- Educational content and assessments
- Offline-capable functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone and navigate to the project
cd plastic-surgeon-assistant

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Demo Login
- **Email**: Any valid email
- **Password**: Use `consultant` or `intern` for different role demos

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (Green #0E9F6E, Red #DC2626 palette)
- **PWA**: Workbox + Service Worker
- **State**: Zustand + React Query
- **Offline**: IndexedDB (Dexie)
- **Icons**: Lucide React
- **Routing**: React Router v6

## 📱 PWA Features

- **Installable**: Add to home screen on mobile/desktop
- **Offline-first**: Works without internet connection
- **Background sync**: Queues actions when offline
- **Push notifications**: Clinical reminders and alerts
- **Responsive**: Mobile-first design

## 👥 User Roles

- **Super Admin**: System administration
- **Consultant**: Approve plans, sign checklists, supervise
- **Registrar**: Create plans, supervise interns
- **Intern**: Primary end-user, create notes, follow protocols
- **Nursing**: View schedules, consumables, tasks
- **Laboratory**: Receive requests, upload results
- **Pharmacy**: Consumable requests and availability

## 🔧 Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build locally
npm run lint         # ESLint check
npm run lint:fix     # Fix ESLint issues
npm run format       # Prettier formatting
npm run type-check   # TypeScript checking
npm run test         # Unit tests (Vitest)
npm run e2e          # E2E tests (Playwright)
```

### Project Structure
```
src/
├── components/      # Reusable UI components
├── pages/          # Route-based page components
├── store/          # Zustand state management
├── types/          # TypeScript definitions
├── utils/          # Helper functions
└── styles/         # Global styles and Tailwind config
```

## 🔒 Security & Compliance

- Role-based access control (RBAC)
- JWT authentication with refresh tokens  
- Audit logging for all clinical actions
- Data encryption at rest and in transit
- HIPAA compliance considerations
- Secure offline data storage

## 🏗️ Deployment

### Production Build
```bash
npm run build
```

### Environment Variables
```env
VITE_API_BASE_URL=https://api.yourserver.com
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### Hosting Options
- **Static Hosting**: Vercel, Netlify, GitHub Pages
- **Self-hosted**: Nginx, Apache with HTTPS
- **Cloud**: Azure Static Web Apps, AWS S3 + CloudFront

## 📋 Clinical Workflows

### Core Features Implemented
- ✅ Authentication with role-based access
- ✅ Dashboard with activity overview
- ✅ Basic navigation and routing
- ✅ PWA manifest and service worker
- ✅ Offline-ready architecture

### Planned Features (MVP)
- 🔄 Patient record management
- 🔄 Treatment plan builder with timeline
- 🔄 Prescription composer with drug checks
- 🔄 WHO-style safety checklists
- 🔄 Lab ordering and result tracking
- 🔄 Educational modules and MCQ tests
- 🔄 Consumables shopping list generator
- 🔄 Surgery scheduling integration

## 🔔 Notifications

- **In-app**: Real-time notifications for tasks
- **Push**: Web Push API for critical alerts
- **SMS**: Optional SMS for urgent notifications (Phase 2)
- **Email**: Daily summaries and reports

## 📊 Analytics & KPIs

- Daily active users by role
- Treatment plans created and completed
- Checklist completion rates before surgery
- Educational module engagement
- System usage patterns and optimization

## 🚨 Important Notes

### Medical Disclaimer
This application is designed to assist medical professionals but should not replace clinical judgment. Always follow institutional protocols and consult supervisors for patient care decisions.

### Data Privacy
- Patient data is stored securely with encryption
- Audit trails maintained for regulatory compliance  
- Follows hospital data governance policies
- Regular security assessments recommended

### Support & Maintenance
- Regular dependency updates
- Security patches and vulnerability assessments
- Clinical workflow validation with medical staff
- User feedback integration and feature requests

## 📞 Support

For technical issues, feature requests, or clinical workflow questions:
- Create GitHub issues for bugs/features
- Contact hospital IT for deployment assistance
- Engage clinical governance for workflow approval

---

**Version**: 0.1.0  
**Last Updated**: November 2025  
**License**: Private/Institutional Use