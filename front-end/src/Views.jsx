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
import ClientRegistration from "./components/Client/ClientRegistration";
import InstructorRegistration from "./components/Instructor/InstructorRegistration";
import InstructorUpdate from "./components/Instructor/InstructorUpdate";
import ViewCottages from "./components/Owner/ViewCottages";
import DeletionReasons from "./components/Admin/DeletionReasons";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editAdventure/:id" element = {<UpdateAdventureForm />}/>
      <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/editCottage/:id" element = {<EditCottage/>}/>
      <Route path = "/editProfile" element = {< ClientProfile />}/>
      <Route path = "/showEntities" element = {< AllEntities />}/>
      <Route path = "/addBoat" element = {<Boat/>}/>
      <Route path = "/ownerRegistration" element = {<OwnerRegistration/>}/>
      <Route path = "/clientRegistration" element = {<ClientRegistration/>}/>
      <Route path = "/registrateInstructor" element = {<InstructorRegistration />} />
      <Route path = "/editInstructor/:id" element = {<InstructorUpdate />} />
      <Route path = "/viewOwnerCottages" element = {<ViewCottages entityType = "cottage" id = "2"/>} />
      <Route path = "/viewDeletionRequests" element= {<DeletionReasons />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;