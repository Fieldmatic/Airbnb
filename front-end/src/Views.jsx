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
import ViewHostEntities from "./components/Owner/ViewHostEntities";
import BookableDetails from "./components/ViewEntities/BookableDetails";
import Login from "./components/Login/Login";
import DeletionReasons from "./components/Admin/DeletionReasons";
import UserRegistration from "./components/Admin/UserRegistration";
import Admin from "./components/Admin/pages/home/Admin";
import Requests from "./components/Admin/pages/list/Requests";
import AdminProfile from "./components/Admin/pages/profile/AdminProfile";
import AdminEntities from "./components/Admin/pages/list/Entities";


const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/login" element =  {<Login/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editAdventure/:id" element = {<UpdateAdventureForm />}/>
      <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/editCottage/:id" element = {<EditCottage/>}/>
      <Route path = "/editProfile" element = {< ClientProfile />}/>
      <Route path = "/showEntities" element = {< AllEntities />}/>
      <Route path = "/addBoat" element = {<Boat/>}/>
      <Route path = "/ownerRegistration" element = {<OwnerRegistration/>}/>
      <Route path = "/clientRegistration" element = {<ClientRegistration/>}/>
      <Route path = "/instructorRegistration" element = {<InstructorRegistration />} />
      <Route path = "/editInstructor" element = {<InstructorUpdate />} />
      <Route path = "/viewOwnerCottages" element = {<ViewHostEntities />} />
      <Route path = "/bookableDetails/:id&:entityType" element = {<BookableDetails />} />
      <Route path = "/viewDeletionRequests" element= {<DeletionReasons />} />
      <Route path = "/viewRegistrationRequests" element= {<UserRegistration />} />
      <Route path = "/admin">
        <Route index element={<Admin />} />
        <Route path="registrationRequests" element={<Requests registration={true} />} />
        <Route path="deletionRequests" element={<Requests registration={false} />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="entities">
          <Route path="adventures" element={<AdminEntities type={1} />}/>
          <Route path="cottages" element={<AdminEntities type={2} />}/>
          <Route path="boats" element={<AdminEntities type={3} />}/>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Views;