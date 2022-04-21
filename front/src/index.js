import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Setting from './Setting';
import Files from './Files';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/files" element={<Files />} />
        </Routes>
    </BrowserRouter>
    , document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
