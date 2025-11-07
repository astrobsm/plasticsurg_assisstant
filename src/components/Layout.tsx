import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  FlaskConical, 
  GraduationCap, 
  Settings,
  Stethoscope,
  ClipboardList,
  User,
  LogOut,
  Bell
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: ClipboardList },
  { name: 'Patients', href: '/patients', icon: Users },
  { name: 'Procedures', href: '/procedures', icon: Stethoscope },
  { name: 'Scheduling', href: '/scheduling', icon: Calendar },
  { name: 'Labs', href: '/labs', icon: FlaskConical },
  { name: 'Education', href: '/education', icon: GraduationCap },
  { name: 'MCQ Assessment', href: '/mcq-education', icon: GraduationCap },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-clinical-light">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PS</span>
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-semibold text-clinical-dark">
                    Plastic Surgery Assistant
                  </h1>
                  <p className="text-xs text-clinical">Clinical Management System</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-clinical-dark">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-400" />
                  <div className="text-sm">
                    <p className="font-medium text-clinical-dark">{user?.name}</p>
                    <p className="text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-clinical-dark"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="bg-white w-64 min-h-screen shadow-sm border-r border-gray-200">
          <div className="px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-clinical-dark'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}