import React from "react";
import './Boat.css'
import BoatService from "../../services/BoatService"
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";

export default function Boat () {
    const [formData, setFormData] = React.useState(
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
            type : "FISHINGBOAT",
            length: "",
            enginesNumber : "",
            enginePower : "",
            maxSpeed : "",
            capacity : "",
            navigationEquipment : "",
            fishingEquipment : ""
        }
    )

    const [files, setFiles] = React.useState([]);

    const [imageSrc, setImageSrc] = React.useState(undefined);

    const updateFiles = (incommingFiles) => {
        console.log("incomming files", incommingFiles);
        setFiles(incommingFiles);
    };

    const onDelete = (id) => {
        setFiles(files.filter((x) => x.id !== id));
    };

    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };

    const handleClean = (files) => {
        console.log("list cleaned", files);
    };

    function handleChange(event) {
        const {name, value} = event.target
        console.log(formData)
        setFormData(prevFormData => {
        return {
            ...prevFormData,
            [name]: value
        }
        })
    }

    function handleAddressChange(event) {
        const {name, value} = event.target
        const address = formData.address
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                address: {
                           ...address,
                           [name]:value
                         }
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault()
        let data = new FormData()
        const boatJson = getBoatJson();
        data.append("boat", boatJson)
        files.map((file) => {
          data.append("files", file.file)
        })
        BoatService.addBoat(data)
      }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
            <h1 className='form--header'>Boat</h1>  
            <input
                className="form--input"
                type = "text"
                placeholder = "Name"
                onChange = {handleChange}
                name = "name"
                value = {formData.name}   
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "State"
                onChange = {handleAddressChange}
                name = "state"
                value = {formData.address.state}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "City"
                onChange = {handleAddressChange}
                name = "city"
                value = {formData.address.city}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Zip"
                onChange = {handleAddressChange}
                name = "zipCode"
                value = {formData.address.zipCode}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Street"
                onChange = {handleAddressChange}
                name = "street"
                value = {formData.address.street}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Daily rate"
                onChange = {handleChange}
                name = "dailyRate"
                value = {formData.dailyRate}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Hourly rate"
                onChange = {handleChange}
                name = "hourlyRate"
                value = {formData.hourlyRate}          
            />
            <textarea 
                className="form--input-area"
                placeholder = "Promotional description"
                onChange = {handleChange}
                value = {formData.promotionalDescription}
                name = "promotionalDescription"
            />
            <textarea 
                className="form--input-area"
                placeholder = "Rules"
                onChange = {handleChange}
                value = {formData.rules}
                name = "rules"
            />
            <textarea 
                className="form--input-area"
                placeholder = "Cancellation conditions"
                onChange = {handleChange}
                value = {formData.cancellationConditions}
                name = "cancellationConditions"
            />
            <label className="type--label">Boat Type:</label>
            <select 
                className="form--type"
                value={formData.type}
                onChange={handleChange}
                name="type"
            >
                <option value="FISHINGBOAT">Fishing boat</option>
                <option value="CRUISER">Cruiser</option>
                <option value="BOWRIDER">Bowrider</option>
                <option value="RUNABOUT">Runabout</option>
                <option value="SAILBOAT">Sailboat</option>
                <option value="SPEEDBOAT">Speedboat</option>
                <option value="TRAWLER">Trawler</option>
                <option value="JETSKI">Jetski</option>
                <option value="YACHT">Yacht</option>
            </select>
            <input 
                className="form--input"
                type = "text"
                placeholder = "Length"
                onChange = {handleChange}
                name = "length"
                value = {formData.length}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Number of engines"
                onChange = {handleChange}
                name = "enginesNumber"
                value = {formData.enginesNumber}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Engine power"
                onChange = {handleChange}
                name = "enginePower"
                value = {formData.enginePower}          
            />
            <input 
                className="form--input"
                type = "text"
                placeholder = "Max speed"
                onChange = {handleChange}
                name = "maxSpeed"
                value = {formData.maxSpeed}          
            />
            <input
                className="form--input"
                type = "text"
                placeholder = "Capacity"
                onChange = {handleChange}
                name = "capacity"
                value = {formData.capacity}
            />
            <textarea 
                className="form--input-area"
                placeholder = "Navigation equipment"
                onChange = {handleChange}
                value = {formData.navigationEquipment}
                name = "navigationEquipment"
            />
            <textarea 
                className="form--input-area"
                placeholder = "Fishing equipment"
                onChange = {handleChange}
                value = {formData.fishingEquipment}
                name = "fishingEquipment"
            />            
            <Dropzone
            style={{ minWidth: "100%", margin:"20px", fontSize:"20px" }}
            onChange={updateFiles}
            minHeight="10%"
            onClean={handleClean}
            value={files}
            maxFiles={10}
            header={true}
            maxFileSize={5000000}
        >
            {files.map((file) => (
            <FileItem
                {...file}
                key={file.id}
                onDelete={onDelete}
                onSee={handleSee}
                resultOnTooltip
                preview
                info
                hd
            />
            ))}
            <FullScreenPreview
            imgSource={imageSrc}
            openImage={imageSrc}
            onClose={(e) => handleSee(undefined)}
            />
        </Dropzone>
            <button className="form--submit">Submit</button>
            </form>
        </div>
    )
    

    function getBoatJson() {
        let formDataCopy = { ...formData };
        formDataCopy.navigationEquipment = formDataCopy.navigationEquipment.trim().split(",");
        formDataCopy.fishingEquipment = formDataCopy.fishingEquipment.trim().split(",");
        const json = JSON.stringify(formDataCopy);
        const boatJson = new Blob([json], {
            type: 'application/json'
        });
        return boatJson;
    }
}