import React from 'react'
import './Cottage.css'
import CottageService from '../../services/CottageService'
import Counter from "../utils/Counter"
import Tags from '../utils/Tags'
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";
import Header from "../../Header";
import { Navigate } from "react-router-dom";
import { TextField } from '@mui/material';
import muiStyles from '../utils/muiStyles';
import { anyFieldEmpty } from '../utils/formValidation';


export default function Cottage() {
  const [formData, setFormData] = React.useState (
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

  const [tags, setTags] = React.useState([]);

  const [redirect, setRedirect] = React.useState("")

  const [files, setFiles] = React.useState([]);

  const [imageSrc, setImageSrc] = React.useState(undefined);

  const [errors, setErrors] = React.useState(false);

  const updateFiles = (incommingFiles) => {
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

  function handleRoomChange(name, value) {
    setFormData(prevFormData => {
      return {
        ...prevFormData,
        [name]: value
      }
    })
  }

  function handleSubmit(event){
    event.preventDefault()
    setErrors(true);
    if (anyFieldEmpty(formData))
      return;
    if(isNaN(formData.address.zipCode))
      return;
    if(isNaN(formData.hourlyRate))
        return;
    if(isNaN(formData.dailyRate))
        return;

    formData.additionalServices = tags;
    let data = new FormData()
    const json = JSON.stringify(formData)
    const cottageJson = new Blob([json], {
      type: 'application/json'
    });
    data.append("cottage", cottageJson)
    files.map((file) => {
      data.append("files", file.file)
    })
    CottageService.addCottage(data).then(response => {
      alert(response.data)
      setRedirect("/")
    })
  }

  if (redirect){
    return (
        <Navigate to={redirect}/>
    )
  }

  return (
    <div>
      <Header />
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h1 className='form--header'>Cottage</h1>
          <div className='form--pair'>
                <TextField
                  sx={muiStyles.style} 
                  label = "Name"
                  variant='outlined'
                  className="form--input"
                  type = "text"           
                  onChange = {handleChange}
                  name = "name"
                  value = {formData.name}
                  error={formData.name === "" && errors}
                  helperText={(formData.name === "" && errors) ? "Name is required!" : ""}
                  required={errors}   
                />
               <TextField
                  sx={muiStyles.style} 
                  label = "Cancellation conditions"
                  variant='outlined'
                  className="form--input"
                  placeholder = "Cancellation conditions"
                  onChange = {handleChange}
                  value = {formData.cancellationConditions}
                  name = "cancellationConditions"
                  error={formData.cancellationConditions === "" && errors}
                  helperText={(formData.cancellationConditions === "" && errors) ? "Cancellation conditions are required!" : ""}
                  required={errors}
                />
          </div>
          <br />
          <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "Country"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "state"
                  value = {formData.address.state}   
                  error={formData.address.state === "" && errors}
                  helperText={(formData.address.state === "" && errors) ? "County is required!" : ""}
                  required={errors}       
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Zip"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "zipCode"
                  value = {formData.address.zipCode} 
                  error={(formData.address.zipCode === "" && errors) || (isNaN(formData.address.zipCode) && errors)}
                  helperText={(formData.address.zipCode === "" && errors) ? "ZIP is required!" : "" ||
                              (isNaN(formData.address.zipCode) && errors) ? "ZIP must be a number!" : ""}
                  required={errors}          
              />
          </div>
          <br />
          <div className='form--pair'>
              <TextField
                  sx={muiStyles.style} 
                  label = "City"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "city"
                  value = {formData.address.city}
                  error={formData.address.city === "" && errors}
                  helperText={(formData.address.city === "" && errors) ? "City is required!" : ""}
                  required={errors}          
              />
              <TextField
                  sx={muiStyles.style} 
                  label = "Street"
                  variant='outlined'
                  className="form--input"
                  type = "text"
                  onChange = {handleAddressChange}
                  name = "street"
                  value = {formData.address.street}
                  error={formData.address.street === "" && errors}
                  helperText={(formData.address.street === "" && errors) ? "Street is required!" : ""}
                  required={errors}          
              />
          </div>
          <br />
          <div className='form--pair'>
          <iframe style={{width: "100%", height:"250px", marginTop: "25px"}} src={`https://maps.google.com/maps?q=${createAddressUrl()}&t=&z=13&ie=UTF8&iwloc=&output=embed`} frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"></iframe>    
          </div>
          <br />
          <div className='form--pair'>
            <TextField
              sx={muiStyles.style} 
              label = "Daily rate"
              variant='outlined'
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "dailyRate"
              value = {formData.dailyRate}  
              error={(formData.dailyRate === "" && errors) || (isNaN(formData.dailyRate) && errors)}
              helperText={(formData.dailyRate === "" && errors) ? "Daily rate is required!" : "" ||
                          (isNaN(formData.dailyRate) && errors) ? "Daily rate must be a number!" : ""}
              required={errors}        
            />
            <TextField
              sx={muiStyles.style} 
              label = "Hourly rate"
              variant='outlined'
              className="form--input"
              type = "text"
              onChange = {handleChange}
              name = "hourlyRate"
              value = {formData.hourlyRate} 
              error={(formData.hourlyRate === "" && errors) || (isNaN(formData.hourlyRate) && errors)}
              helperText={(formData.hourlyRate === "" && errors) ? "Hourly rate is required!" : "" ||
                          (isNaN(formData.hourlyRate) && errors) ? "Hourly rate must be a number!" : ""}
              required={errors}         
            />
          </div>
          <br />
          <div className='form--pair'>
              <TextField
                  id="outlined-multiline-flexible"
                  label="Promotional description"
                  className="form--input-area"
                  sx = {muiStyles.style}
                  multiline
                  maxRows={6}
                  name = "promotionalDescription"
                  value={formData.promotionalDescription}
                  onChange={handleChange}
                  error={formData.promotionalDescription === "" && errors}
                  helperText={(formData.promotionalDescription === "" && errors) ? "Promotional description is required!" : ""}
                  required={errors}
              />
          </div>
          <div className='form--pair'>
              <TextField
                  id="outlined-multiline-flexible"
                  label="Rules"
                  className="form--input-area"
                  sx = {muiStyles.style}
                  multiline
                  maxRows={6}
                  name = "rules"
                  value={formData.rules}
                  onChange={handleChange}
                  error={formData.rules === "" && errors}
                  helperText={(formData.rules === "" && errors) ? "Rules are required!" : ""}
                  required={errors}
              />
          </div>
          <div className='form--bedrooms'>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Single rooms: </label>  
              <Counter name = "singleRooms" value = {formData.singleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
            <label className='bedRoom--label'>Double rooms: </label>  
              <Counter name = "doubleRooms" value = {formData.doubleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Triple rooms: </label>  
              <Counter name = "tripleRooms" value = {formData.tripleRooms} handleChange = {handleRoomChange}/>
            </div>
            <div className='bedRoom'>
              <label className='bedRoom--label'>Quad rooms: </label>  
              <Counter name = "quadRooms" value = {formData.quadRooms} handleChange = {handleRoomChange}/>
            </div>
          </div>
          <div className='form--pair'>
            <Tags tags = {tags} setTags ={setTags}/>
          </div>
          <div className='form--pair'>
            <Dropzone
                style={{minWidth: "100%", fontSize:"18px" }}
                onChange={updateFiles}
                minHeight="25vh"
                onClean={handleClean}
                value={files}
                label='Drop your interior & exterior pictures here'
                accept = {".jpg, .png, .jpeg"}
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
          </div>
          <div className='form--pair'>
            <button className="form--submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  )
    function createAddressUrl(){
        let addressQuery = formData.address.street + ", " + formData.address.city + ", " + formData.address.state
        addressQuery = addressQuery.replace(/ /g,"%20")
        return addressQuery
    }
}
