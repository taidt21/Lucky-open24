import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './custom.css';
import './App.css';
import reportWebVitals from './reportWebVitals';
import initializeStores from './stores/storeInitializer';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const stores = initializeStores();
root.render(
    <Provider {...stores}>
        <App />
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
registerServiceWorker();
