import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import LibrarianLayout from './layouts/LibrarianLayout';
import ReaderLayout from './layouts/ReaderLayout';

// Pages
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Readers from './pages/Readers';
import Borrow from './pages/Borrow';
import Reservations from './pages/Reservations';
import Fines from './pages/Fines';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import ReaderDashboard from './pages/ReaderDashboard';
import MyBooks from './pages/MyBooks';
import ImportBooks from './pages/ImportBooks';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading] = useState(false);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  const role = user.role?.toLowerCase() || 'reader';

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
        {/* Admin Routes */}
        {role === 'admin' && (
           <AdminLayout user={user} onLogout={handleLogout}>
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/books" element={<Books />} />
               <Route path="/readers" element={<Readers />} />
               <Route path="/borrow" element={<Borrow />} />
               <Route path="/reservations" element={<Reservations />} />
               <Route path="/fines" element={<Fines />} />
               <Route path="/reports" element={<Reports />} />
               <Route path="/notifications" element={<Notifications />} />
               <Route path="/import-books" element={<ImportBooks />} />
               <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
           </AdminLayout>
        )}

        {/* Librarian Routes */}
        {(role === 'librarian' || role === 'thuthu') && (
           <LibrarianLayout user={user} onLogout={handleLogout}>
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/books" element={<Books />} />
               <Route path="/readers" element={<Readers />} />
               <Route path="/borrow" element={<Borrow />} />
               <Route path="/reservations" element={<Reservations />} />
               <Route path="/fines" element={<Fines />} />
               <Route path="/reports" element={<Reports />} />
               <Route path="/notifications" element={<Notifications />} />
               <Route path="/import-books" element={<ImportBooks />} />
               <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
           </LibrarianLayout>
        )}

        {/* Reader Routes */}
        {role === 'reader' && (
           <ReaderLayout user={user} onLogout={handleLogout}>
             <Routes>
               <Route path="/" element={<ReaderDashboard />} />
               <Route path="/my-books" element={<MyBooks />} />
               <Route path="/history" element={<MyBooks />} />
               <Route path="/notifications" element={<Notifications />} />
               <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
           </ReaderLayout>
        )}
      </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
