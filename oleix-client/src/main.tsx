import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'axiosConfig';
import 'assets/scss/index.scss';
import './interceptors/ErrorHandling';
import { CookiesProvider } from 'react-cookie';
import toastr from 'toastr';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';

toastr.options.closeButton = true;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <AuthProvider requireLoginList={['/adverts/new', '/adverts/me', '/adverts/:id/edit']}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </AuthProvider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
