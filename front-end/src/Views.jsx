import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import ClientProfile from "./components/Client/ClientProfile";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addCottage" element = {<div>Kucica</div>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {< ClientProfile />}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;