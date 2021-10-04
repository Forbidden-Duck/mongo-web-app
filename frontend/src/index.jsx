import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { ThemeProvider, createTheme } from "@mui/material/styles";

console.log("Hello, welcome to the console...");

const theme = createTheme({});
ReactDOM.render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <App />
        </ThemeProvider>
    </StrictMode>
);
