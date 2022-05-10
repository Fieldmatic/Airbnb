import React from "react"
import { useParams } from 'react-router-dom'
import Header from "../../Header";
import BoatService from "../../services/BoatService";


export default function EntityDetails() {
    const [boat, setBoat] = React.useState(
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
            type: "",
            enginesNumber: 0,
            enginePower: 0,
            maxSpeed: 0,
            capacity: 0,
            fishingEquipment: 0,
            navigationEquipment: 0
          }
    )
    let {id} = useParams();

    function setBoatType(type) {
        if (type == "FISHINGBOAT") 
            return "Fishing boat"
    }

    React.useEffect(() => {
        BoatService.getBoat(id).then((response) => {
            let cottageResponse = response.data;
            setBoat({
                name : cottageResponse.name, 
                address : cottageResponse.address,
                promotionalDescription : cottageResponse.promotionalDescription,
                rules : cottageResponse.rules,
                hourlyRate : cottageResponse.hourlyRate,
                dailyRate : cottageResponse.dailyRate,
                cancellationConditions : cottageResponse.cancellationConditions,
                type : setBoatType(cottageResponse.type),
                enginesNumber : cottageResponse.enginesNumber,
                enginePower : cottageResponse.enginePower,
                maxSpeed : cottageResponse.maxSpeed,
                capacity: cottageResponse.capacity,
                navigationEquipment: cottageResponse.navigationEquipment,
                fishingEquipment: cottageResponse.fishingEquipment
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
                        <label className="entityDetailsLabel">{boat.name} </label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Address</label>
                        <label className="entityDetailsLabel">{boat.address.street}, {boat.address.city}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Price</label>
                        <label className="entityDetailsLabel">{boat.dailyRate}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Promo Description</label>
                        <label className="entityDetailsLabel">{boat.promotionalDescription}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Rules</label>
                        <label className="entityDetailsLabel">{boat.rules}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Cancellation conditions</label>
                        <label className="entityDetailsLabel">{boat.cancellationConditions}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Boat type</label>
                        <label className="entityDetailsLabel">{boat.type}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Number of engines</label>
                        <label className="entityDetailsLabel">{boat.enginesNumber}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Engines power</label>
                        <label className="entityDetailsLabel">{boat.enginePower}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Max speed</label>
                        <label className="entityDetailsLabel">{boat.maxSpeed}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Capacity</label>
                        <label className="entityDetailsLabel">{boat.capacity}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Navigation equipment</label>
                        <label className="entityDetailsLabel">{boat.navigationEquipment}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Fishing equipment</label>
                        <label className="entityDetailsLabel">{boat.fishingEquipment}</label>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}