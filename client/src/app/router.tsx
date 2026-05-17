import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';

const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const InterviewSetup = lazy(() => import('../pages/InterviewSetup'));
const InterviewRoom = lazy(() => import('../pages/InterviewRoom'));
const FeedbackPage = lazy(() => import('../pages/Feedback'));
const History = lazy(() => import('../pages/History'));
const Profile = lazy(() => import('../pages/Profile'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#07070B' }}>
      <div
        className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#8B5CF6', borderRightColor: '#22D3EE' }}
      />
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/interview/setup"
          element={<ProtectedRoute><InterviewSetup /></ProtectedRoute>}
        />
        <Route
          path="/interview/:id"
          element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>}
        />
        <Route
          path="/feedback/:interviewId"
          element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><History /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />
      </Routes>
    </Suspense>
  );
}
