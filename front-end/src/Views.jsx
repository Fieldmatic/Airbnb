import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import Home from "./Home";
import AddAdventureForm from "./components/Adventure/AddAdventureForm";
import UpdateAdventureForm from "./components/Adventure/UpdateAdventureFrom"
import EditProfile from "./components/Client/EditProfile";
import Cottage from "./components/cottage/Cottage";
import AllEntities from "./components/ViewEntities/AllEntities";
import EditCottage from "./components/cottage/EditCottage";
import Boat from "./components/Boat/Boat";
import OwnerRegistration from "./components/Owner/OwnerRegistration";
import ClientRegistration from "./components/Client/ClientRegistration";
import InstructorRegistration from "./components/Instructor/InstructorRegistration";
import InstructorUpdate from "./components/Instructor/InstructorUpdate";
import ViewHostEntities from "./components/Bookable/ViewHostEntities";
import BookableDetails from "./components/ViewEntities/BookableDetails";
import Login from "./components/Login/Login";
import DeletionReasons from "./components/Admin/DeletionReasons";
import UserRegistration from "./components/Admin/UserRegistration";
import Actions from "./components/Bookable/Actions";
import Periods from "./components/Bookable/Periods";
import ReservationHistory from "./components/Reservation/ReservationHistory";
import Admin from "./components/Admin/pages/home/Admin";
import Requests from "./components/Admin/pages/list/Requests";
import AdminProfile from "./components/Admin/pages/profile/AdminProfile";
import AdminEntities from "./components/Admin/pages/list/Entities";
import EditBoat from "./components/Boat/EditBoat";
import ReserveForClient from "./components/Owner/Reservation/ReserveForClient";
import ShowWishList from "./components/ViewEntities/ShowWishList";
import Statistics from "./components/Owner/Statistics";

const Views = () => {
  return (
    <Routes>
      <Route index element = {<Home/>}/>
      <Route path = "/login" element =  {<Login/>}/>
      <Route path = "/addAdventure" element = {<AddAdventureForm />}/>
      <Route path = "/editAdventure/:id" element = {<UpdateAdventureForm />}/>
      <Route path = "/addCottage" element = {<Cottage/>}/>
      <Route path = "/statistics" element = {<Statistics/>}/>
      <Route path = "/editCottage/:id" element = {<EditCottage/>}/>
      <Route path = "/editBoat/:id" element = {<EditBoat/>}/>
      <Route path = "/editProfile" element = {< EditProfile />}/>
      <Route path = "/showEntities" element = {< AllEntities />}/>
      <Route path = "/showWishList" element = {< ShowWishList />}/>
      <Route path = "/addBoat" element = {<Boat/>}/>
      <Route path = "/ownerRegistration" element = {<OwnerRegistration/>}/>
      <Route path = "/clientRegistration" element = {<ClientRegistration/>}/>
      <Route path = "/viewHostEntities" element = {<ViewHostEntities />} />
      <Route path = "/addActions/:id" element = {< Actions />}/>
      <Route path = "/addAvailabilityPeriods/:id" element = {< Periods />}/>
      <Route path = "/hostReservations" element = {<ReservationHistory/>}/>
      <Route path = "/instructorRegistration" element = {<InstructorRegistration />} />
      <Route path = "/editInstructor" element = {<InstructorUpdate />} />
      <Route path = "/reserveAgain/:bookableId&:email" element = {<ReserveForClient/>} />
      <Route path = "/bookableDetails/:id&:entityType&:user&:heartColor" element = {<BookableDetails />} />
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