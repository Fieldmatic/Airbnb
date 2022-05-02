import React from 'react'
import './AddAdventureForm.css'
import AdventureService from '../../services/AdventureService'
import { useParams } from 'react-router-dom'

export default function UpdateAdventureForm(props) {
    const [formData, setFormData] = React.useState({
        name: "",
        address: {
            street: "",
            city: "",
            state: "",
            zipCode: ""
        },
        promoDescription: "",
        capacity: "",
        rules: "",
        equipment: "",
        cancellationConditions: "",
        hourlyRate: "",
        inputPictures: ""
    });

    let {id} = useParams();

    React.useEffect(() => {
        AdventureService.getAdventure(id).then((result) => {
            let adventure = result.data;
            console.log(adventure)
            setFormData({
                name: adventure.name, 
                address: adventure.address,
                promoDescription: adventure.promoDescription,
                rules: adventure.rules,
                hourlyRate: adventure.hourlyRate,
                dailyRate: adventure.dailyRate,
                cancellationConditions: adventure.cancellationConditions,
                capacity: adventure.capacity,
                equipment: adventure.equipment
            })
        })
      },[])

    var errorMessages = {
        nameError: "",
        addressError: "",
        capacityError: "",
        hourlyRateError: ""
    };

    const [validForm, setValidFrom] = React.useState(true);

    const errors = {
        name: "You must enter adventure name",
        address: "You must enter address",
        number: "This field must be a number"
      };
    
    function handleChange(event) {
        const {name, value} = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    }

    function handleSubmit(event){
        event.preventDefault();
        // validateForm();
        setValidFrom(true);
        if (validForm) {
            let data = new FormData()
            const adventureJson = adventureToJson();
            data.append("adventure", adventureJson)
            AdventureService.updateAdventure(data, id)
        }
        
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

    function adventureToJson() {
        let formDataCopy = { ...formData };
        formDataCopy.equipment = formDataCopy.equipment.trim().split(",");
        const json = JSON.stringify(formDataCopy);
        const adventureJson = new Blob([json], {
            type: 'application/json'
        });
        return adventureJson;
    }

    function validateForm() {
        setValidFrom(true);
        validateName();
        validateAddress();
        validateCapacity();
        validateHourlyRate();
    }

    function validateName() {
        if(formData.name === undefined || formData.name === "") { 
            errorMessages.nameError = errors.name;
            setValidFrom(false);
        }
        else{
            errorMessages.nameError = errors.name;
        }
    }

    function validateAddress() {
        if(formData.address === undefined || formData.address === "") { 
            errorMessages.addressError = errors.address;
            setValidFrom(false);
        }
        else{
            errorMessages.addressError = errors.address;
        }
    }

    function validateCapacity() {
        if(formData.capacity === undefined || formData.capacity === "" || isNaN(formData.capacity)) { 
            errorMessages.capacityError = errors.number;
            setValidFrom(false);
        }
        else{
            errorMessages.capacityError = errors.number;
        }
    }

    function validateHourlyRate() {
        if(formData.hourlyRate === undefined || formData.hourlyRate === "" || isNaN(formData.hourlyRate)) { 
            errorMessages.hourlyRateError = errors.number;
            setValidFrom(false);
        }
        else{
            errorMessages.hourlyRateError = errors.number;
        }
    }

    const renderErrorMessage = (name) => (
        <div className="form--error">{name}</div>
    );
    
    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit}>
                <h2 className="form--title">Update adventure</h2>
                <input 
                    type="text"
                    placeholder="Name"
                    className="form--input"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                />
                {/* {renderErrorMessage(errorMessages.nameError)} */}
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
                {/* {renderErrorMessage(errorMessages.addressError)} */}
                <input 
                    type="text" 
                    placeholder="Capacity"
                    className="form--input"
                    name="capacity"
                    onChange={handleChange}
                    value={formData.capacity}
                />
                {/* {renderErrorMessage(errorMessages.capacityError)} */}
                <input 
                    type="text" 
                    placeholder="Hourly rate"
                    className="form--input"
                    name="hourlyRate"
                    onChange={handleChange}
                    value={formData.hourlyRate}
                />
                {/* {renderErrorMessage(errorMessages.hourlyRateError)} */}
                <textarea 
                    placeholder="Promo description"
                    className="form--input-area"
                    name="promoDescription"
                    onChange={handleChange}
                    value={formData.promoDescription}
                />
                <textarea 
                    placeholder="Behaviour rules"
                    className="form--input-area"
                    name="rules"
                    onChange={handleChange}
                    value={formData.rules}
                />
                <textarea 
                    placeholder="Equipment(separate with ',')"
                    className="form--input-area"
                    name="equipment"
                    onChange={handleChange}
                    value={formData.equipment}
                />
                <textarea 
                    placeholder="Cancelation conditions"
                    className="form--input-area"
                    name="cancellationConditions"
                    onChange={handleChange}
                    value={formData.cancellationConditions}
                />               
                <button
                    className="form--submit"
                >
                    Update adventure
                </button>
            </form>
        </div>
    )
}