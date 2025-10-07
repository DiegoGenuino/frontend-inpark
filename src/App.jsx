import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './utils/auth.jsx'
import { Sidebar } from './components/sidebar/Sidebar.jsx'
import { Signup } from './pages/Signup.jsx';
import { Login } from './pages/Login.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import './App.css'

function App() {
  return (
   <AuthProvider>
    <Router>
      <div className="app-container">
        <Sidebar/>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/estacionamentos" element={<div>Estacionamentos</div>} />
            <Route path="/minhas-reservas" element={<div>Minhas Reservas</div>} />
            <Route path="/reservas" element={<div>Reservas</div>} />
            <Route path="/manage-users" element={<div>Gerenciar Usuários</div>} />
            <Route path="/view-reports" element={<div>Ver Relatórios</div>} />
            <Route path="/admin-settings" element={<div>Configurações</div>} />
            <Route path="/company-info" element={<div>Informações da Empresa</div>} />
          </Routes>
        </main>
      </div>
    </Router>
   </AuthProvider>
  )
}

export default App
