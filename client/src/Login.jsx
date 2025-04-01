import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

const Login = () => {
  const {
    isRegister,
    formData,
    updateFormData,
    handleAuth,
    error,
    isLoading,
    toggleAuthMode,
  } = useContext(AuthContext);

  const handleInputChange = (field) => (value) => {
    updateFormData({ ...formData, [field]: value });
  };

  const buttonConfig = {
    loadingText: isRegister ? "Creating your account..." : "Getting you in...",
    buttonText: isRegister ? "Register" : "Login",
  };

  return (
    <div className="bg-blue-50 h-screen flex items-center">
      <form className="w-64 mx-auto mb-12" onSubmit={handleAuth}>
        {isRegister && (
          <FormInput
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange("name")}
          />
        )}
        <FormInput
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange("email")}
        />
        <FormInput
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange("password")}
        />
        <button
          className="bg-blue-500 text-white block w-full rounded-sm p-2"
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? buttonConfig.loadingText : buttonConfig.buttonText}
        </button>

        <ToggleAuthMode 
          isRegister={isRegister}
          toggleAuthMode={toggleAuthMode}
        />
        <ErrorAlert error={error} />
      </form>
    </div>
  );
};

const FormInput = ({ type, placeholder, value, onChange }) => (
  <input
    className="block w-full rounded-sm p-2 mb-2 border"
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const ToggleAuthMode = ({ isRegister, toggleAuthMode }) => {
  const config = {
    text: isRegister ? "Already a member?" : "Don't have an account?",
    buttonText: isRegister ? "Login here" : "Register",
  };

  return (
    <div className="text-center mt-2">
      <div>
        {config.text}
        <button className="ml-1" type="button" onClick={toggleAuthMode}>
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};

const ErrorAlert = ({ error }) => {
  if (!error?.error) return null;
  
  return (
    <alert variant="danger">
      <b>{`Error status code: ${error.status}`}</b>
      <p>{error.message}</p>
    </alert>
  );
};

export default Login;