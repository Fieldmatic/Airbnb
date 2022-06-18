import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";       




const muiStyles = () => {
    const useStyles = makeStyles(() => ({
      input1: {
        height: 20
      },
      input2: {
        height: 20,
      }
    }));

    const StyledTextField = withStyles({
      root: {
        "& label": {
          width: "100%",
          textAlign: "center",
          hintStyle: {width: '600px', textAlign: 'center' },
          transformOrigin: "center",
            "&.Mui-focused": {
              transformOrigin: "center"
            }
         }
      }
    })(TextField);


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
            color: "black",
            fontWeight: "bold",
            fontSize: "medium"
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
              borderColor: "lightgray",
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "#FF5A5F",
              borderWidth: 2
            },
            "&.Mui-focused fieldset": {
              borderColor: "#FF5A5F"
            },
            svg : {color : '#FF5A5F'}
            
          },
          select: {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'red',
            },
            
          },
          '.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline' :{
           borderColor: "red",
        }
          
          
            

      }
            
 
    return {
        style,
        timePickerTheme,
        useStyles,
        StyledTextField,
        formLabelTheme,
        radioStyle
    };
}

 
export default muiStyles();