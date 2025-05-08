import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import './styles/main.css';
import { SnackbarProvider } from './utils/SnackbarProvider';

function App() {
 return (
   <Router>
     <SnackbarProvider>
       <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/register" element={<Register />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/products/:id" element={<ProductDetail />} />
       </Routes>
     </SnackbarProvider>
   </Router>
 );
}

export default App;