import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboard from '@/view/components/dashboard/StudentDashboard';
import TechnicianDashboard from '@/view/components/dashboard/TechnicianDashboard';
import AppSidebar from '@/view/components/layout/AppSidebar';

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
