import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.jsx"
// Fixed imports
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.js"
import "./styles/style.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
