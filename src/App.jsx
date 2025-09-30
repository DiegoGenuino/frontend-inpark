import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/sidebar/Sidebar.jsx'
import { AuthProvider } from './utils/auth.jsx'
import './App.css'

function App() {
  return (
   <AuthProvider>
    <Router>
      <Sidebar/>
    </Router>
   </AuthProvider>
  )
}

export default App
