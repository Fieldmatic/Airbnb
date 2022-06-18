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
                />
          </div>
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
              />
          </div>
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
              />
          </div>
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
            />
          </div>
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
                accept = {".jpg, .png"}
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
}
