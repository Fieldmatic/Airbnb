import React from "react"
import { useParams } from 'react-router-dom'
import CottageService from "../../services/CottageService";
import Header from "../../Header";


export default function EntityDetails() {
    const [cottage, setCottage] = React.useState(
        {
            name : "",
            address: {
              street: "",
              city: "",
              state: "",
              zipCode: ""
            },
            promotionalDescription : "",
            rules : "",
            hourlyRate : "",
            dailyRate : "",
            cancellationConditions: "",
            singleRooms : 0,
            doubleRooms : 0,
            tripleRooms : 0,
            quadRooms : 0
          }
    )
    let {id} = useParams();

    React.useEffect(() => {
        CottageService.getCottage(id).then((response) => {
            let cottageResponse = response.data;
            setCottage({
                name : cottageResponse.name, 
                address : cottageResponse.address,
                promotionalDescription : cottageResponse.promotionalDescription,
                rules : cottageResponse.rules,
                hourlyRate : cottageResponse.hourlyRate,
                dailyRate : cottageResponse.dailyRate,
                cancellationConditions : cottageResponse.cancellationConditions,
                singleRooms : cottageResponse.singleRooms,
                doubleRooms : cottageResponse.doubleRooms,
                tripleRooms : cottageResponse.tripleRooms,
                quadRooms : cottageResponse.quadRooms
            })
        }) 
    }, [])

    return(
        <div>
            <Header />
            <div className="entityDetails">
                <form className="entityDetailsForm">
                    <div className="formData">
                        <label className="entityDetailsLabel">Name</label>
                        <label className="entityDetailsLabel">{cottage.name} </label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Address</label>
                        <label className="entityDetailsLabel">{cottage.address.street}, {cottage.address.city}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Price</label>
                        <label className="entityDetailsLabel">{cottage.dailyRate}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Promo Description</label>
                        <label className="entityDetailsLabel">{cottage.promotionalDescription}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Rules</label>
                        <label className="entityDetailsLabel">{cottage.rules}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Cancellation conditions</label>
                        <label className="entityDetailsLabel">{cottage.cancellationConditions}</label>
                    </div>
                    <div className="formData">
                        {cottage.singleRooms != 0 && <label className="entityDetailsLabel">Single rooms </label>}
                        {cottage.singleRooms != 0 && <label className="entityDetailsLabel">{cottage.singleRooms}</label>}
                    </div>
                    <div className="formData">
                        {cottage.doubleRooms != 0 && <label className="entityDetailsLabel">Double rooms </label>}
                        {cottage.doubleRooms != 0 && <label className="entityDetailsLabel">{cottage.doubleRooms}</label>}
                    </div>
                    <div className="formData">
                        {cottage.tripleRooms != 0 && <label className="entityDetailsLabel">Triple rooms </label>}
                        {cottage.tripleRooms != 0 && <label className="entityDetailsLabel">{cottage.tripleRooms}</label>}
                    </div>
                    <div className="formData">
                        {cottage.quadRooms != 0 && <label className="entityDetailsLabel">Quad rooms </label>}
                        {cottage.quadRooms != 0 && <label className="entityDetailsLabel">{cottage.quadRooms}</label>}
                    </div>
                    
                </form>
            </div>
        </div>
    )
}