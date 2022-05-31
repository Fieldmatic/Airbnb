import { createTheme } from "@mui/material/styles";

const muiStyles = () => {
    const timePickerTheme = createTheme({
        palette: {
          primary: {
            main: "#FF5A5F",
          },
        },
      });

    const formLabelTheme = createTheme ({
      palette: {
        primary: {
          main: '#000000',
        },
      },
      
    })
    const radioStyle = {
      '&, &.Mui-checked': {
        color: '#FF5A5F',
      },
    }

    const style = {
        "& label": {
            color: "black"
          },

          "&:hover label": {
            fontWeight: 700
          },
          "& label.Mui-focused": {
            color: "black"
          },
          "& .MuiInput-underline:after": {
            borderBottomColor: "#FF5A5F"
          },
          "& .MuiOutlinedInput-root": {                           
            "& > fieldset": {
              borderColor: "black"
            },
            "&:hover fieldset": {
              borderColor: "#FF5A5F",
              borderWidth: 2
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF5A5F"
            },
            svg : {color : '#FF5A5F'}
            
          }
      }
            
 
    return {
        style,
        timePickerTheme,
        formLabelTheme,
        radioStyle
    };
}

 
export default muiStyles();