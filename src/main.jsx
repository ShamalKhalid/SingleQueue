// main.tsx or main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import App from './App';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import UserForm from './User/UserForm'
import Login from './login/Login'
import CounterDash from './Counter/CounterDash';
import AdminDash from './Admin/AdminDash'
import Staff from './Admin/Staff';
import Counter from './Admin/Counter'
import TVView from './TVView/TVView'
import ConfirmationPage from './User/Confirmation'
import Ads from './Admin/Ads';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/userForm',
    element: <UserForm />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/counterDash',
    element: <CounterDash />,
  },
  {
    path: '/adminDash',
    element: <AdminDash />,
  },
  {
    path: '/counter',
    element: <Counter />,
  },
  {
    path: '/staff',
    element: <Staff />,
  },
  {
    path: '/tvView',
    element: <TVView />
  },
  {
    path: '/Confirmation',
    element: <ConfirmationPage />,
  },
  {
    path: '/ads',
    element: <Ads />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NextUIProvider>
      <RouterProvider router={router} />
    </NextUIProvider>
  </React.StrictMode>,
);
