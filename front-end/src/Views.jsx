import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import AddAdventureForm from "./components/Adventure/AddAdventureForm";
import Cottage from "./components/cottage/Cottage";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {<div>Profil</div>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;