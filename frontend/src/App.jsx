import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import FooterComp from "./components/footer/FooterComp";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
// import { lazy } from "react";

// const Contact = lazy(() => import("./pages/Contact"));
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
      <FooterComp />
    </BrowserRouter>
  );
}

export default App;
