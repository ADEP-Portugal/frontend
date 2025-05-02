import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Agenda from './pages/Agenda';
import ForgotPassword from './pages/ForgotPassword';
import EmailSend from './pages/EmailSend';
import { AuthProvider } from './context/authContext';
import Signup from './pages/Signup';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Appointment from './pages/Appointment';
import Lawsuit from './pages/Lawsuit';
import Tasks from './pages/Tasks';
import { ThemeProvider } from './components/theme-provider';
import AssociatePage from './pages/Associate';
import UsefulLink from './pages/UsefulLink';
import ReportPage from './pages/Report';

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/login" element={<Login />} />
              {/* <Route path="/signup" element={<Signup />} /> */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/email-send" element={<EmailSend />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/appointment" element={<Appointment />} />
              <Route path="/lawsuit" element={<Lawsuit />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/associate" element={<AssociatePage />} />
              <Route path="/useful-links" element={<UsefulLink />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
