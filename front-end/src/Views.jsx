import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import AddAdventureForm from "./Components/Adventure/AddAdventureForm";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addCottage" element = {<div>Kucica</div>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editProfile" element = {<div>Profil</div>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;