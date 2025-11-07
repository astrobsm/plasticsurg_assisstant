import React, { useState, useEffect } from 'react';
import { PreoperativeAssessmentForm } from '../components/procedures/PreoperativeAssessment';
import { WHOSafetyChecklistForm } from '../components/procedures/WHOSafetyChecklist';
import { IntraoperativeFindingsForm } from '../components/procedures/IntraoperativeFindings';
import { PostoperativeCareForm } from '../components/procedures/PostoperativeCare';
import { WoundCareAssessmentForm } from '../components/procedures/WoundCareAssessment';
import { SurgicalFitnessScoreForm } from '../components/procedures/SurgicalFitnessScore';

export const Procedures: React.FC = () => {
  const [activeModule, setActiveModule] = useState('overview');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>('');

  const modules = [
    { id: 'overview', name: 'Overview', icon: '📋', description: 'Procedure management dashboard' },
    { id: 'preop', name: 'Preoperative Assessment', icon: '🔍', description: 'Patient fitness and risk evaluation' },
    { id: 'fitness', name: 'Surgical Fitness Scoring', icon: '📊', description: 'Comprehensive risk scoring system' },
    { id: 'who-checklist', name: 'WHO Safety Checklist', icon: '✅', description: 'World Health Organization safety protocols' },
    { id: 'intraop', name: 'Intraoperative Findings', icon: '🏥', description: 'Surgical procedure documentation' },
    { id: 'postop', name: 'Postoperative Care', icon: '🩺', description: 'Recovery tracking and care plans' },
    { id: 'wound-care', name: 'Wound Care', icon: '🔬', description: 'Wound assessment and management' }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return <ProcedureOverview />;
      case 'preop':
        return (
          <PreoperativeAssessmentForm 
            patientId={selectedPatientId}
            procedureId={selectedProcedureId}
            onComplete={(assessmentId) => {
              console.log('Preoperative assessment completed:', assessmentId);
            }}
          />
        );
      case 'fitness':
        return (
          <SurgicalFitnessScoreForm 
            patientId={selectedPatientId}
            onComplete={(scoreId) => {
              console.log('Fitness scoring completed:', scoreId);
            }}
          />
        );
      case 'who-checklist':
        return (
          <WHOSafetyChecklistForm 
            procedureId={selectedProcedureId}
            onComplete={(checklistId) => {
              console.log('WHO checklist completed:', checklistId);
            }}
          />
        );
      case 'intraop':
        return (
          <IntraoperativeFindingsForm 
            patientId={selectedPatientId}
            procedureId={selectedProcedureId}
            onComplete={(findingsId) => {
              console.log('Intraoperative findings recorded:', findingsId);
            }}
          />
        );
      case 'postop':
        return (
          <PostoperativeCareForm 
            patientId={selectedPatientId}
            procedureId={selectedProcedureId}
            onComplete={(careId) => {
              console.log('Postoperative care plan created:', careId);
            }}
          />
        );
      case 'wound-care':
        return (
          <WoundCareAssessmentForm 
            patientId={selectedPatientId}
            procedureId={selectedProcedureId}
            onComplete={(assessmentId) => {
              console.log('Wound care assessment completed:', assessmentId);
            }}
          />
        );
      default:
        return <ProcedureOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Surgical Procedures</h1>
                <p className="text-gray-600 mt-1">Comprehensive surgical management and documentation</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Patient</option>
                  <option value="patient_1">John Doe (HOSP/2024/0001)</option>
                  <option value="patient_2">Jane Smith (HOSP/2024/0002)</option>
                </select>
                
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  + New Procedure
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Module Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Procedure Modules</h3>
              </div>
              
              <div className="p-2">
                {modules.map(module => (
                  <button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                      activeModule === module.id
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{module.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{module.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{module.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Today's Procedures</span>
                  <span className="font-semibold text-green-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending WHO Checklists</span>
                  <span className="font-semibold text-orange-600">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Risk Patients</span>
                  <span className="font-semibold text-red-600">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wound Care Due</span>
                  <span className="font-semibold text-blue-600">7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderModuleContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Dashboard Component
const ProcedureOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Current Procedures */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Procedures</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {/* Active Procedure Cards */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Abdominoplasty - Jane Smith</h4>
                  <p className="text-sm text-gray-600">Started: 08:30 AM | Estimated completion: 11:30 AM</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">✅ WHO Sign-in Complete</span>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">⏳ Time-out Pending</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-green-600">In Progress</span>
                  <p className="text-sm text-gray-500">OR 3</p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">Breast Reconstruction - Mary Johnson</h4>
                  <p className="text-sm text-gray-600">Started: 10:00 AM | Estimated completion: 02:00 PM</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">🔍 Preop Complete</span>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">📋 Documentation Pending</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-blue-600">Scheduled</span>
                  <p className="text-sm text-gray-500">OR 1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔍</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Preoperative</h4>
              <p className="text-sm text-gray-600">5 pending assessments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">WHO Checklists</h4>
              <p className="text-sm text-gray-600">3 incomplete</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔬</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Wound Care</h4>
              <p className="text-sm text-gray-600">12 active assessments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Fitness Scoring</h4>
              <p className="text-sm text-gray-600">2 high-risk patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Intraoperative</h4>
              <p className="text-sm text-gray-600">1 active procedure</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900">Postoperative</h4>
              <p className="text-sm text-gray-600">8 patients in recovery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-sm text-gray-700">WHO Safety Checklist completed for John Doe - Rhinoplasty</span>
              <span className="text-xs text-gray-500">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Preoperative assessment completed for Sarah Wilson</span>
              <span className="text-xs text-gray-500">15 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              <span className="text-sm text-gray-700">Wound care assessment due for Michael Brown</span>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span className="text-sm text-gray-700">High surgical fitness score alert for Patient #0034</span>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Procedures;