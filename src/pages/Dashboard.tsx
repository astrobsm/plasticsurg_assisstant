import { 
  Users, 
  Calendar, 
  FlaskConical, 
  ClipboardCheck,
  AlertTriangle,
  TrendingUp 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  const stats = [
    {
      name: 'Active Patients',
      value: '23',
      icon: Users,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      name: 'Pending Tasks',
      value: '7',
      icon: ClipboardCheck,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      name: 'Lab Results',
      value: '4',
      icon: FlaskConical,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      name: 'Urgent Items',
      value: '2',
      icon: AlertTriangle,
      color: 'text-danger-600',
      bg: 'bg-danger-50',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Treatment plan updated for Patient #123',
      time: '2 hours ago',
      type: 'plan',
    },
    {
      id: 2,
      title: 'Lab results received for Patient #456',
      time: '4 hours ago',
      type: 'lab',
    },
    {
      id: 3,
      title: 'Surgery scheduled for Patient #789',
      time: '1 day ago',
      type: 'surgery',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-clinical-dark">
          Welcome back, {user?.name?.split(' ')[1] || user?.name}
        </h1>
        <p className="text-clinical mt-1">
          Here's what's happening with your patients today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-clinical-dark">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-clinical-dark mb-4">
            Recent Activities
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-clinical-dark">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-clinical-dark mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/patients" className="w-full btn-primary justify-start">
              <Users className="h-4 w-4 mr-2" />
              Add New Patient
            </Link>
            <Link to="/treatment-plan-builder" className="w-full btn-secondary justify-start">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Create Treatment Plan (Offline Demo)
            </Link>
            <button className="w-full btn-secondary justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Surgery
            </button>
            <button className="w-full btn-secondary justify-start">
              <FlaskConical className="h-4 w-4 mr-2" />
              Order Lab Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}