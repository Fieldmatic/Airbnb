import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";       




const muiStyles = () => {
    const useStyles = makeStyles(() => ({
      input1: {
        height: 10
      },
      input2: {
        height: 10,
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
        useStyles,
        StyledTextField
    };
}

 
export default muiStyles();