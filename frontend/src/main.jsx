import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Chatpage from './Pages/Chatpage';
import { ToastContainer, toast } from 'react-toastify';
import { ChatProvider } from './Context/ChatProvider';
import { Provider } from './components/ui/chakra/provider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />
  },
  {
    path: '/chat',
    element: <ChatProvider><Chatpage /></ChatProvider>
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider>
    <ToastContainer />
    <RouterProvider router={router} />
  </Provider>
  ,
)
