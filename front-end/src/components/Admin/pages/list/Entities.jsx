import React from "react"
import AdminSidebar from "../../components/sidebar/AdminSidebar"
import AdminNavbar from "../../components/navbar/AdminNavbar"
import EntityTable from "../../components/entityTable/EntityTable"

const Entities = (props) => {

    let title = "";

    if (props.type === 1) {
        // ucitaj avanture
        title = "Adventures"
    }else if(props.type === 2) {
        // ucitaj vikendice
        title = "Cottages"
    }else {
        // ucitaj brodove
        title = "Boats"
    }

    return (
        <div className="requestList">
            <AdminSidebar/>
            <div className="requestListContainer">
                <AdminNavbar/>
                <EntityTable title={title} />
            </div>
        </div>
    )
}

export default Entities