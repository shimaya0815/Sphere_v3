import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import PrivateRoute from '@/components/auth/PrivateRoute';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// Lazy-loaded pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TaskList = lazy(() => import('@/pages/tasks/TaskList'));
const TaskDetail = lazy(() => import('@/pages/tasks/TaskDetail'));
const ClientList = lazy(() => import('@/pages/clients/ClientList'));
const ClientDetail = lazy(() => import('@/pages/clients/ClientDetail'));
const TimeManagement = lazy(() => import('@/pages/time/TimeManagement'));
const ChatHome = lazy(() => import('@/pages/chat/ChatHome'));
const Wiki = lazy(() => import('@/pages/wiki/Wiki'));
const NotFound = lazy(() => import('@/pages/NotFound'));

const App = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Tasks routes */}
              <Route path="tasks">
                <Route index element={<TaskList />} />
                <Route path="new" element={<TaskDetail />} />
                <Route path=":taskId" element={<TaskDetail />} />
              </Route>
              
              {/* Clients routes */}
              <Route path="clients">
                <Route index element={<ClientList />} />
                <Route path="new" element={<ClientDetail />} />
                <Route path=":clientId" element={<ClientDetail />} />
                <Route path=":clientId/edit" element={<ClientDetail />} />
              </Route>
              
              {/* Time management routes */}
              <Route path="time" element={<TimeManagement />} />
              
              {/* Chat routes */}
              <Route path="chat" element={<ChatHome />} />
              
              {/* Wiki routes */}
              <Route path="wiki">
                <Route index element={<Wiki />} />
                <Route path=":pageId" element={<Wiki key={window.location.pathname} />} />
              </Route>
            </Route>

            {/* 404 route */}
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default App;