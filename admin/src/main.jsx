import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Slide, ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SocketProvider } from './context/SocketProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
        <App />
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>,
)
