
// import './App.css'

import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import A350 from "./pages/A350"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"

function App() {
 
  return (
   <ThemeProvider theme={theme}>
   <CssBaseline />
   <Router>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/A350" element={<A350 />} />
        <Route path="/*" element={<NoMatch />} />
      </Route>
    </Routes>
   </Router>
   </ThemeProvider> 
  )
}

export default App
