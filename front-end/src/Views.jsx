import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import ClientProfile from "./components/Client/ClientProfile";
import AddAdventureForm from "./components/Adventure/AddAdventureForm";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addCottage" element = {<div>Kucica</div>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {< ClientProfile />}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editProfile" element = {<div>Profil</div>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;