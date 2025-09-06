import './App.css'
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./contexts/auth/AuthProvider.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

function App() {

  return (
      <BrowserRouter>
          <AuthProvider>
              <AppRoutes />
          </AuthProvider>
      </BrowserRouter>
  )
}

export default App
