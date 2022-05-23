import "./requestList.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import Datatable from "../../components/datatable/Datatable"

const RequestList = () => {
  return (
    <div className="requestList">
      <AdminSidebar/>
      <div className="requestListContainer">
        <AdminNavbar/>
        <Datatable/>
      </div>
    </div>
  )
}

export default RequestList