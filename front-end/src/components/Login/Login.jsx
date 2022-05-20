import React from "react";
import {useNavigate} from "react-router-dom";
import {Form,Button,Col, Container, Row} from "react-bootstrap";    
import Alert from "react-bootstrap/Alert";
import SecureLoginImg from "../../images/secure_login.png";
import UserImg from "../../images/user.png"
import Header from "../../Header"
import LoginService from "../../services/LoginRegisterService"
import "./Login.css";

function Login() {
   
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = React.useState(false);
    
    const [loginData, setLoginData] = React.useState (
        {
          username : "",
          password : ""     
        }
  
    )

    function handleChange(event) {
        const {name, value} = event.target
        setLoginData(prevLoginData => {
        return {
            ...prevLoginData,
            [name]: value
        }
        })
    }

    function handleSubmit(event){
        event.preventDefault()
        LoginService.login(loginData)
                    .then(res => {         
                        console.log(res.status)           
                        const token = res.data.accessToken;
                        const expiration = res.data.expiresIn
                        console.log(token)
                        console.log(expiration)
                        localStorage.setItem("user",token)
                        localStorage.setItem("expiration", expiration)
                        navigate("/")             
                    }).catch(error => {
                     setShowAlert(true)   
                    
                       
                    });    
      }

    return (
        <>
        <Header/>
        {showAlert &&
         <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
         <Alert.Heading>Invalid login!</Alert.Heading>
         <p>
         User with given username and password doesn't exist!
         </p>
         </Alert>
        }
        <Container className = "mt-5">
           <Row>
               <Col lg={4} md={6} sm={12} className="mt-5 p-2">
                    <div className = "iconContainer">
                        <img className="user-icon" src = {UserImg} alt = "icon"/>
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                             type="username" 
                             placeholder="Enter username" 
                             onChange = {handleChange}
                             name = "username"
                             value = {loginData.username}
                             />   
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                             type="password" 
                             placeholder="Enter password" 
                             onChange = {handleChange}
                             name = "password"
                             value = {loginData.password}                       
                             />
                        </Form.Group>
                        <Button variant="primary w-100" type="submit">
                            Login
                        </Button>
                    </Form>
               </Col>
               <Col lg = {8} md = {6} sm = {12}>
                    <img className="w-100" src = {SecureLoginImg} alt = ""/>
               </Col>
           </Row> 
        </Container>
        </>


    )
}
export default Login