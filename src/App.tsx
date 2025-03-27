import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Main from '@/pages/Main';
import { withAuth } from '@/middleware/auth';

const ProtectedMain = withAuth(Main);

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedMain />} />
      </Routes>
    </Router>
  );
};

export default App;
