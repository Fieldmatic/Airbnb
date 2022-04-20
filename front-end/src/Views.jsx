import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import AddAdventureForm from "./Components/Adventure/AddAdventureForm";
import UpdateAdventureForm from "./Components/Adventure/UpdateAdventureFrom"
// import Cottage from "./components/cottage/Cottage";
// import EditCottage from "./components/cottage/EditCottage";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editAdventure/:id" element = {<UpdateAdventureForm />}/>
      {/* <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/editCottage/:id" element = {<EditCottage/>}/> */}
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {<div>Profil</div>}/>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;