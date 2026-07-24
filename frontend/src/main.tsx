import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from './features/auth/AuthProvider'
import { BrowserRouter } from "react-router-dom";
createRoot(document.getElementById('app')!).render(
<BrowserRouter>
<AuthProvider>
    <App />
  </AuthProvider>
  </BrowserRouter>
)
