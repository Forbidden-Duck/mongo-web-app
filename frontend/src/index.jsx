import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import reducer from "./store";

import { ThemeProvider, createTheme } from "@mui/material/styles";

console.log("Hello, welcome to the console...");

const store = configureStore({ reducer: reducer });
const theme = createTheme({});
ReactDOM.render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Provider>
    </StrictMode>,
    document.getElementById("root")
);
