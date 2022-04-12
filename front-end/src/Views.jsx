import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addCottage" element = {<div>Kucica</div>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {<div>Profil</div>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;