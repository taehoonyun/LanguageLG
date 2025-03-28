import React from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button } from "react-bootstrap";
import { useAuth } from "@/hooks/useAuth";
import { styles } from "./styles";

interface LoginForm {
  username: string;
}

const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const { login, isLoading, error: authError } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.username);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div style={styles.container}>
      <Container>
        <div style={styles.card}>
          <h2 style={styles.title}>Welcome Back! 👋</h2>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-4">
              <Form.Label style={styles.label}>Username</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter your username" 
                {...register("username", { 
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters"
                  }
                })}
                style={styles.input}
              />
              {errors.username && (
                <div style={styles.error}>
                  {errors.username.message}
                </div>
              )}
            </Form.Group>
            {authError && (
              <div style={styles.error} className="mb-3">
                {authError}
              </div>
            )}
            <Button 
              type="submit" 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
