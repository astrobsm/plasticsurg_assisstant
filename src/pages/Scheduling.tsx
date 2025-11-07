import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Download,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  schedulingService, 
  WardRound, 
  ClinicSession, 
  SurgeryBooking,
  WardRoundPatient,
  ClinicAppointment,
  OperationList
} from '../services/schedulingService';

type SchedulingTab = 'ward_rounds' | 'clinics' | 'surgery';

export default function Scheduling() {
  const [activeTab, setActiveTab] = useState<SchedulingTab>('ward_rounds');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [wardRounds, setWardRounds] = useState<WardRound[]>([]);
  const [clinics, setClinics] = useState<ClinicSession[]>([]);
  const [surgeries, setSurgeries] = useState<SurgeryBooking[]>([]);
  const [showWardRoundForm, setShowWardRoundForm] = useState(false);
  const [showClinicForm, setShowClinicForm] = useState(false);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSchedulingData();
  }, [selectedDate]);

  const loadSchedulingData = async () => {
    setLoading(true);
    try {
      const [wardRoundsData, clinicsData, surgeriesData] = await Promise.all([
        schedulingService.getWardRounds(selectedDate),
        schedulingService.getClinicSessions(selectedDate),
        schedulingService.getSurgeryBookings(selectedDate)
      ]);
      
      setWardRounds(wardRoundsData);
      setClinics(clinicsData);
      setSurgeries(surgeriesData);
    } catch (error) {
      console.error('Error loading scheduling data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateOperationList = async () => {
    try {
      const operationList = await schedulingService.generateOperationList(selectedDate, 'Main Theatre Complex');
      await schedulingService.generateOperationListPDF(operationList);
    } catch (error) {
      console.error('Error generating operation list:', error);
    }
  };

  const getWeekDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const TabButton = ({ tab, label, icon: Icon }: { tab: SchedulingTab; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
        activeTab === tab
          ? 'bg-green-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Scheduling Management</h1>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(parseISO(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={generateOperationList}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Operation List PDF</span>
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto">
          {getWeekDates().map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="text-xs">{format(date, 'EEE')}</div>
              <div>{format(date, 'd')}</div>
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4">
          <TabButton tab="ward_rounds" label="Ward Rounds" icon={Users} />
          <TabButton tab="clinics" label="Clinics" icon={MapPin} />
          <TabButton tab="surgery" label="Surgery" icon={Clock} />
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'ward_rounds' && (
        <WardRoundsSection 
          wardRounds={wardRounds}
          selectedDate={selectedDate}
          onRefresh={loadSchedulingData}
          showForm={showWardRoundForm}
          setShowForm={setShowWardRoundForm}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      )}

      {activeTab === 'clinics' && (
        <ClinicsSection 
          clinics={clinics}
          selectedDate={selectedDate}
          onRefresh={loadSchedulingData}
          showForm={showClinicForm}
          setShowForm={setShowClinicForm}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      )}

      {activeTab === 'surgery' && (
        <SurgerySection 
          surgeries={surgeries}
          selectedDate={selectedDate}
          onRefresh={loadSchedulingData}
          showForm={showSurgeryForm}
          setShowForm={setShowSurgeryForm}
          editingItem={editingItem}
          setEditingItem={setEditingItem}
        />
      )}
    </div>
  );
}

// Ward Rounds Section Component
const WardRoundsSection = ({ 
  wardRounds, 
  selectedDate, 
  onRefresh, 
  showForm, 
  setShowForm, 
  editingItem, 
  setEditingItem 
}: any) => {
  const [formData, setFormData] = useState({
    ward_name: '',
    start_time: '08:00',
    end_time: '10:00',
    consultant: '',
    registrar: '',
    intern: '',
    notes: '',
    patients: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schedulingService.createWardRound({
        date: selectedDate,
        ...formData,
        status: 'scheduled'
      });
      setShowForm(false);
      setFormData({
        ward_name: '',
        start_time: '08:00',
        end_time: '10:00',
        consultant: '',
        registrar: '',
        intern: '',
        notes: '',
        patients: []
      });
      onRefresh();
    } catch (error) {
      console.error('Error creating ward round:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Ward Rounds - {format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Ward Round</span>
        </button>
      </div>

      {/* Ward Rounds List */}
      <div className="space-y-4">
        {wardRounds.map((round) => (
          <div key={round.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(round.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">{round.ward_name}</h3>
                  <p className="text-sm text-gray-600">{round.start_time} - {round.end_time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Consultant:</span>
                <p className="text-sm text-gray-900">{round.consultant}</p>
              </div>
              {round.registrar && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Registrar:</span>
                  <p className="text-sm text-gray-900">{round.registrar}</p>
                </div>
              )}
              {round.intern && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Intern:</span>
                  <p className="text-sm text-gray-900">{round.intern}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {round.patients.length} patients • {round.patients.filter(p => p.seen).length} seen
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                round.status === 'completed' ? 'bg-green-100 text-green-800' :
                round.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                round.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {round.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ward Round Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Ward Round</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ward Name</label>
                  <input
                    type="text"
                    value={formData.ward_name}
                    onChange={(e) => setFormData({ ...formData, ward_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultant</label>
                  <input
                    type="text"
                    value={formData.consultant}
                    onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registrar (Optional)</label>
                  <input
                    type="text"
                    value={formData.registrar}
                    onChange={(e) => setFormData({ ...formData, registrar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intern (Optional)</label>
                  <input
                    type="text"
                    value={formData.intern}
                    onChange={(e) => setFormData({ ...formData, intern: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Schedule Ward Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Clinics Section Component
const ClinicsSection = ({ 
  clinics, 
  selectedDate, 
  onRefresh, 
  showForm, 
  setShowForm, 
  editingItem, 
  setEditingItem 
}: any) => {
  const [formData, setFormData] = useState({
    clinic_type: 'general_plastic',
    location: '',
    start_time: '08:00',
    end_time: '17:00',
    consultant: '',
    max_patients: 20,
    notes: ''
  });

  const clinicTypes = [
    { value: 'general_plastic', label: 'General Plastic Surgery' },
    { value: 'reconstructive', label: 'Reconstructive Surgery' },
    { value: 'aesthetic', label: 'Aesthetic Surgery' },
    { value: 'hand_surgery', label: 'Hand Surgery' },
    { value: 'burn_clinic', label: 'Burn Clinic' },
    { value: 'follow_up', label: 'Follow-up Clinic' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schedulingService.createClinicSession({
        date: selectedDate,
        ...formData,
        appointments: [],
        status: 'scheduled'
      });
      setShowForm(false);
      setFormData({
        clinic_type: 'general_plastic',
        location: '',
        start_time: '08:00',
        end_time: '17:00',
        consultant: '',
        max_patients: 20,
        notes: ''
      });
      onRefresh();
    } catch (error) {
      console.error('Error creating clinic session:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Clinic Sessions - {format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Clinic Session</span>
        </button>
      </div>

      {/* Clinic Sessions List */}
      <div className="space-y-4">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {clinicTypes.find(t => t.value === clinic.clinic_type)?.label}
                  </h3>
                  <p className="text-sm text-gray-600">{clinic.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-600 hover:text-green-600 transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Time:</span>
                <p className="text-sm text-gray-900">{clinic.start_time} - {clinic.end_time}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Consultant:</span>
                <p className="text-sm text-gray-900">{clinic.consultant}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Capacity:</span>
                <p className="text-sm text-gray-900">{clinic.appointments.length}/{clinic.max_patients}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {clinic.appointments.filter(a => a.status === 'completed').length} completed appointments
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                clinic.status === 'completed' ? 'bg-green-100 text-green-800' :
                clinic.status === 'active' ? 'bg-blue-100 text-blue-800' :
                clinic.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {clinic.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clinic Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Clinic Session</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Type</label>
                  <select
                    value={formData.clinic_type}
                    onChange={(e) => setFormData({ ...formData, clinic_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    {clinicTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultant</label>
                  <input
                    type="text"
                    value={formData.consultant}
                    onChange={(e) => setFormData({ ...formData, consultant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Patients</label>
                  <input
                    type="number"
                    value={formData.max_patients}
                    onChange={(e) => setFormData({ ...formData, max_patients: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Schedule Clinic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Surgery Section Component
const SurgerySection = ({ 
  surgeries, 
  selectedDate, 
  onRefresh, 
  showForm, 
  setShowForm, 
  editingItem, 
  setEditingItem 
}: any) => {
  const [formData, setFormData] = useState({
    theatre_number: '',
    start_time: '08:00',
    estimated_end_time: '10:00',
    primary_surgeon: '',
    assistant_surgeon: '',
    anaesthetist: '',
    scrub_nurse: '',
    circulating_nurse: '',
    patient_id: '',
    patient_name: '',
    procedure_name: '',
    procedure_code: '',
    urgency: 'elective',
    anaesthesia_type: 'general',
    estimated_duration_minutes: 120,
    special_requirements: [],
    equipment_needed: [],
    implants_needed: [],
    blood_type: '',
    allergies: [],
    medical_conditions: [],
    pre_op_checklist_completed: false,
    consent_obtained: false,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await schedulingService.createSurgeryBooking({
        date: selectedDate,
        ...formData,
        status: 'scheduled'
      });
      setShowForm(false);
      // Reset form
      onRefresh();
    } catch (error) {
      console.error('Error creating surgery booking:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'text-red-600';
      case 'urgent':
        return 'text-orange-600';
      default:
        return 'text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Surgery Schedule - {format(selectedDate, 'EEEE, MMMM d, yyyy')}</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Book Surgery</span>
        </button>
      </div>

      {/* Surgery List */}
      <div className="space-y-4">
        {surgeries.map((surgery) => (
          <div key={surgery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">{surgery.procedure_name}</h3>
                  <p className="text-sm text-gray-600">Theatre {surgery.theatre_number} • {surgery.start_time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getUrgencyColor(surgery.urgency)}`}>
                  {surgery.urgency.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Patient:</span>
                <p className="text-sm text-gray-900">{surgery.patient_name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Primary Surgeon:</span>
                <p className="text-sm text-gray-900">{surgery.primary_surgeon}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Duration:</span>
                <p className="text-sm text-gray-900">{surgery.estimated_duration_minutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {surgery.anaesthesia_type} anaesthesia
                </span>
                {surgery.pre_op_checklist_completed && (
                  <span className="flex items-center text-sm text-green-600">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Pre-op completed
                  </span>
                )}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                surgery.status === 'completed' ? 'bg-green-100 text-green-800' :
                surgery.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                surgery.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {surgery.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Surgery Booking Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Book Surgery</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Theatre Number</label>
                  <input
                    type="text"
                    value={formData.theatre_number}
                    onChange={(e) => setFormData({ ...formData, theatre_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={formData.patient_name}
                    onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Procedure Name</label>
                  <input
                    type="text"
                    value={formData.procedure_name}
                    onChange={(e) => setFormData({ ...formData, procedure_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Surgeon</label>
                  <input
                    type="text"
                    value={formData.primary_surgeon}
                    onChange={(e) => setFormData({ ...formData, primary_surgeon: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Anaesthetist</label>
                  <input
                    type="text"
                    value={formData.anaesthetist}
                    onChange={(e) => setFormData({ ...formData, anaesthetist: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="elective">Elective</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimated_duration_minutes}
                    onChange={(e) => setFormData({ ...formData, estimated_duration_minutes: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="30"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Book Surgery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};