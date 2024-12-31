import React, { useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from '../firebaseConfig';
import { registerUser } from '../api/userApi'

const AuthForm = () => {
  const [error, setError] = useState([]);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const {register, handleSubmit, formState: { errors }} = useForm();

  const onSubmit = async(data) => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        navigate('/dashboard'); 
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password,
        );
        const user = userCredential.user;
        const token = await user.getIdToken();
      
     
        await registerUser({
          name: data.name,
          email: data.email},
          token
        );
        navigate('/dashboard');
      }
    } catch (error) {
      setError([error.message])
    }
  }
  return (
    <Container fluid="md">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <div className="p-4 mt-5 border rounded shadow-sm">
            <div className="d-flex gap-2 mb-4">
              <Button 
                variant={isLogin ? 'primary' : 'outline-primary'}
                onClick={() => setIsLogin(true)}
                className="w-50"
                aria-label="Switch to Login Form"
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? 'primary' : 'outline-primary'}
                onClick={() => setIsLogin(false)}
                className="w-50"
                aria-label="Switch to Sign Up Form"
              >
                Sign Up     
              </Button>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
              {!isLogin && (
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className="text-danger">{errors.name.message}</p>}
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control 
                 type="email" 
                  placeholder="Enter email" 
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    }
                  })}
                />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    }
                  })}
                />
                {errors.password && <p className="text-danger">{errors.password.message}</p>}
              </Form.Group>
              {error.length > 0 && <p className="text-danger mb-3">{error[0]}</p>}
              <Button variant="primary" 
                type="submit"
                aria-label={isLogin ? 'Submit Login Form' : 'Submit Sign Up Form'}>
                  {isLogin ? 'Login' : 'Sign Up'}
                </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthForm;