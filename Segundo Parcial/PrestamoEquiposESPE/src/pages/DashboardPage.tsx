import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import TechnicianDashboard from '@/components/dashboard/TechnicianDashboard';
import AppSidebar from '@/components/layout/AppSidebar';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppSidebar>
      {user?.role === 'estudiante' ? (
        <StudentDashboard />
      ) : (
        <TechnicianDashboard />
      )}
    </AppSidebar>
  );
};

export default DashboardPage;
