import React from "react"
import "./adminNavbar.scss"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AdminService from "../../../../services/AdminService";


export default function AdminNavbar() {

    const [profileImage, setProfileImage] = React.useState(undefined)

    React.useEffect(() => {
        AdminService.getProfilePicture().then((response) => {
            setProfileImage(response.data);
        })
      },[])

    return (
        <div className="adminNavbar">
            <div className="wrapper">
                <div className="searchBar">
                    <input type="text" placeholder="Search..." />
                    <SearchOutlinedIcon />
                </div>
                <div className="items">
                    <div className="item">
                        <img
                        src={
                            profileImage
                              ? URL.createObjectURL(profileImage)
                              : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                          }
                        alt=""
                        className="avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}