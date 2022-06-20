import React from "react"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import EntityTable from "../../components/entityTable/EntityTable"


const Entities = (props) => {

    let title = "";
    if (props.entity === "adventure") 
        title = "Adventures"
    else if(props.entity === "cottage")
        title = "Cottages"
    else
        title = "Boats"

    return (
        <div className="requestList">
            <AdminSidebar/>
            <div className="requestListContainer">
                <AdminNavbar/>
                <EntityTable entity={props.entity} title={title}/>
            </div>
        </div>
    )
}

export default Entities