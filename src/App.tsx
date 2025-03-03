
// import './App.css'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"
import CheckListLayout from "./components/layout/CheckListLayout"


function App() {
 
  return (
   <ThemeProvider theme={theme}>
   <CssBaseline />
   <Router>
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/CheckListLayout" element={<CheckListLayout />} />
        {/* <Route path="/E170" element={<E170 />} />
        <Route path="/ATR" element={<ATR />} /> */}
        <Route path="/*" element={<NoMatch />} />
      </Route>
    </Routes>
   </Router>
   </ThemeProvider> 
  )
}

export default App
