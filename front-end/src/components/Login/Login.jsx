import React from "react";
import {Form,Button,Col, Container, Row} from "react-bootstrap";    
import SecureLoginImg from "../../images/secure_login.png";
import UserImg from "../../images/user.png"
import Header from "../../Header"
import "./Login.css";

function Login() {
    return (
        <>
        <Header/>
        <Container className = "mt-5">
           <Row>
               <Col lg={4} md={6} sm={12} className="mt-5 p-2">
                    <div className = "iconContainer">
                        <img className="user-icon" src = {UserImg} alt = "icon"/>
                    </div>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" />
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
