import React from "react";
import {Form,Button,Col, Container, Row} from "react-bootstrap";    
import SecureLoginImg from "../../images/secure_login.png";
import UserImg from "../../images/user.png"
import Header from "../../Header"
import LoginService from "../../services/LoginRegisterService"
import "./Login.css";
import { Navigate } from "react-router-dom";

function Login() {
    const [loginData, setLoginData] = React.useState (
        {
          username : "",
          password : ""     
        }
  
    )

    const [redirect, setRedirect] = React.useState("");

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
                        const token = res.data.accessToken;
                        const expiration = res.data.expiresIn
                        console.log(token)
                        console.log(expiration)
                        localStorage.setItem("user",token)
                        localStorage.setItem("expiration", expiration)
                        setRedirect("/")                 
                    });    
      }

    if (redirect){
    return (
        <Navigate to={redirect}/>
    )
    }

    return (
        <>
        <Header/>
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
