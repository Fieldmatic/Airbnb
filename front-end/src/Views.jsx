import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import AddAdventureForm from "./components/Adventure/AddAdventureForm";
import UpdateAdventureForm from "./components/Adventure/UpdateAdventureFrom"
import ClientProfile from "./components/Client/ClientProfile";
import Cottage from "./components/cottage/Cottage";
import AllEntities from "./components/ViewEntities/AllEntities";
import EditCottage from "./components/cottage/EditCottage";
import Boat from "./components/Boat/Boat";
import OwnerRegistration from "./components/Owner/OwnerRegistration";
import RegistrationForm from "./components/Instructor/RegistrationForm";


const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editAdventure/:id" element = {<UpdateAdventureForm />}/>
      <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/editCottage/:id" element = {<EditCottage/>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/addExperience" element = {<div>Pecanje</div>}/>
      <Route path = "/editProfile" element = {< ClientProfile />}/>
      <Route path = "/showEntities" element = {< AllEntities />}/>
      <Route path = "/addBoat" element = {<Boat/>}/>
      <Route path = "/ownerRegistration" element = {<OwnerRegistration/>}/>
      <Route path = "/registrateInstructor" element = {<RegistrationForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;