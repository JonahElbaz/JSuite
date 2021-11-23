import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';
import {config} from "./config";
import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';


firebase.initializeApp(config.firebaseConfig);
const queryClient = new QueryClient()


ReactDOM.render(
  <QueryClientProvider client={queryClient} contextSharing={true}>
    <BrowserRouter>
      <ToastProvider>
        <App/>
      </ToastProvider>
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
