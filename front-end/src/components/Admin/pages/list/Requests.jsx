import "./requests.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import Datatable from "../../components/datatable/Datatable"

const Requests = (props) => {
  return (
    <div className="requestList">
      <AdminSidebar/>
      <div className="requestListContainer">
        <AdminNavbar/>
        <Datatable registration={props.registration}/>
      </div>
    </div>
  )
}

export default Requests