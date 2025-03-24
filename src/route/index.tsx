import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router"
import Main from "../pages/Main";
import Layout from "../layouts";
import Login from "../pages/Login";


const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;