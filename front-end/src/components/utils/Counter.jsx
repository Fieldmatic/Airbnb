import React from "react";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {IconButton}  from "@mui/material";

export default function App(props) {
  let [value, setValue] = React.useState(props.value);

  React.useEffect(() => {
    {props.handleChange(props.name, value)};
  }, [value])

  React.useEffect(() => {
    {setValue(props.value)}
  },[props.value])

  function incrementCount() {
    setValue(function(oldValue) {
      return oldValue + 1 
    });
  }

  function decrementCount() {
    setValue(function(oldValue) {
      if (oldValue > 0) return oldValue-1
      else return oldValue
    })
  }

  return (
    <div className="counter">
      <IconButton onClick = {incrementCount} >
        <AddIcon/>
      </IconButton>
      <label
      >{value}</label>
      <IconButton onClick = {decrementCount}>
        <RemoveIcon/>
      </IconButton>
    </div>
  );
}