import React from 'react'
import './AddAdventureForm.css'
import AdventureService from '../../services/AdventureService'

export default function AddAdventureForm() {
    const [formData, setFormData] = React.useState({
        adventureName: "",
        address: "",
        promoDescription: "",
        capacity: "",
        rules: "",
        equipment: "",
        cancelationConditions: "",
        hourlyRate: "",
        inputPictures: ""
    });

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
    
    function handleSubmit(event) {
        event.preventDefault();
        validateForm();
        if (validForm) {
            AdventureService.addAdventure(formData);
            console.log("Success");
        }
    }

    function validateForm() {
        setValidFrom(true);
        validateName();
        validateAddress();
        validateCapacity();
        validateHourlyRate();
    }

    function validateName() {
        if(formData.adventureName === undefined || formData.adventureName === "") { 
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
                <h2 className="form--title">Create adventure</h2>
                <input 
                    type="text"
                    placeholder="Name"
                    className="form--input"
                    name="adventureName"
                    onChange={handleChange}
                    value={formData.adventureName}
                />
                {renderErrorMessage(errorMessages.nameError)}
                <input 
                    type="text" 
                    placeholder="Address"
                    className="form--input"
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
                />
                {renderErrorMessage(errorMessages.addressError)}
                <input 
                    type="text" 
                    placeholder="Capacity"
                    className="form--input"
                    name="capacity"
                    onChange={handleChange}
                    value={formData.capacity}
                />
                {renderErrorMessage(errorMessages.capacityError)}
                <input 
                    type="text" 
                    placeholder="Hourly rate"
                    className="form--input"
                    name="hourlyRate"
                    onChange={handleChange}
                    value={formData.hourlyRate}
                />
                {renderErrorMessage(errorMessages.hourlyRateError)}
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
                    name="cancelationConditions"
                    onChange={handleChange}
                    value={formData.cancelationConditions}
                />
                <input 
                    type="file" 
                    placeholder="Choose pictures"
                    className="form--input-picture"
                    name="inputPictures"
                    onChange={handleChange}
                    value={formData.inputPictures}
                />
                
                <button
                    className="form--submit"
                >
                    Create adventure
                </button>
            </form>
        </div>
    )
}