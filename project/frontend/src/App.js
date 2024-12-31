import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import ProtectedRoute from './route/ProtectedRoute';
import AuthForm from './components/AuthForm';
import DashboardPage from './pages/DashboardPage';
import MoodCalenderView from './components/MoodCalenderView';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/calender-view" element={<ProtectedRoute><MoodCalenderView /></ProtectedRoute>} />         
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
