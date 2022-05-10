import React from "react"
import { useParams } from 'react-router-dom'
import AdventureService from "../../services/AdventureService";
import Header from "../../Header";


export default function EntityDetails() {
    const [adventure, setAdventure] = React.useState(
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
            dailyRate : "",
            cancellationConditions: "",
            capacity: 0
          }
    )
    let {id} = useParams();

    React.useEffect(() => {
        AdventureService.getAdventure(id).then((response) => {
            let adventureResponse = response.data;
            setAdventure({
                name : adventureResponse.name, 
                address : adventureResponse.address,
                promotionalDescription : adventureResponse.promotionalDescription,
                rules : adventureResponse.rules,
                hourlyRate : adventureResponse.hourlyRate,
                dailyRate : adventureResponse.dailyRate,
                cancellationConditions : adventureResponse.cancellationConditions,
                capacity : adventureResponse.capacity
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
                        <label className="entityDetailsLabel">{adventure.name} </label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Address</label>
                        <label className="entityDetailsLabel">{adventure.address.street}, {adventure.address.city}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Hourly Price</label>
                        <label className="entityDetailsLabel">{adventure.hourlyRate}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Rules</label>
                        <label className="entityDetailsLabel">{adventure.rules}</label>
                    </div>

                    <div className="formData">
                        <label className="entityDetailsLabel">Cancellation conditions</label>
                        <label className="entityDetailsLabel">{adventure.cancellationConditions}</label>
                    </div>
                    <div className="formData">
                        <label className="entityDetailsLabel">Capacity</label>
                        <label className="entityDetailsLabel">{adventure.capacity}</label>
                    </div>       
                </form>
            </div>
        </div>
    )
}