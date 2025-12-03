import { useState } from "react";
import styled from "styled-components";

const FormContainer = styled.div`
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 12px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 12px;
  background: ${(props) => (props.active ? "#10b981" : "transparent")};
  color: ${(props) => (props.active ? "white" : "#6b7280")};
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.active ? "0 2px 8px rgba(16, 185, 129, 0.3)" : "none"};
  font-family: "Futura", sans-serif;

  &:hover {
    background: ${(props) => (props.active ? "#059669" : "#e5e7eb")};
  }
`;

const FormWrapper = styled.form`
  // ✅ Changed to form
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  font-family: "Futura", sans-serif;
`;

const Input = styled.input`
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;
  font-family: "Futura", sans-serif;
  background: white !important;
  color: #1f2937 !important;

  &:focus {
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    background: white !important;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: #1f2937 !important;
    border-color: #e5e7eb;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  margin-top: 8px;
  font-family: "Futura", sans-serif;

  &:hover {
    background: #059669;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: shake 0.4s ease;

  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-8px);
    }
    75% {
      transform: translateX(8px);
    }
  }

  &:before {
    content: "⚠️";
    font-size: 16px;
  }
`;

const HelperText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 16px;
  font-family: "Futura", sans-serif;
`;

export default function AuthForm({ onSignup, onLogin, error }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      onLogin({ identifier: formData.username, password: formData.password });
    } else {
      onSignup(formData);
    }
  };

  return (
    <FormContainer>
      <TabContainer>
        <Tab active={isLogin} onClick={() => setIsLogin(true)} type="button">
          Login
        </Tab>
        <Tab active={!isLogin} onClick={() => setIsLogin(false)} type="button">
          Sign Up
        </Tab>
      </TabContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <FormWrapper onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </InputGroup>

        {!isLogin && (
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>
        )}

        <InputGroup>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </InputGroup>

        <SubmitButton type="submit">
          {isLogin ? "Login" : "Create Account"}
        </SubmitButton>
      </FormWrapper>

      <HelperText>
        {isLogin
          ? "New to Ease? Click Sign Up above"
          : "Already have an account? Click Login above"}
      </HelperText>
    </FormContainer>
  );
}
