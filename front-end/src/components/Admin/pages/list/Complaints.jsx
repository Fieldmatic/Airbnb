import "./requests.scss"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import ComplaintTable from "../../components/complaintTable/ComplaintTable"

const Complaints = (props) => {
  return (
    <div className="requestList">
      <AdminSidebar/>
      <div className="requestListContainer">
        <AdminNavbar/>
        <ComplaintTable refresh={props.refresh}/> {/* mozda refresh ne treba */}
      </div>
    </div>
  )
}

export default Complaints