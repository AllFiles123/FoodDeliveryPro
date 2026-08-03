import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateSignup } from "../../../utils/validators";
import authService from "../../../services/authService";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

export default function useSignupForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleTermsChange = (event) => {
    setAcceptedTerms(event.target.checked);

    setErrors((prev) => ({
      ...prev,
      terms: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateSignup(formData);

    if (!acceptedTerms) {
      validationErrors.terms =
        "You must accept the Terms & Conditions.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      if (response.success) {
        localStorage.setItem(
          "token",
          response.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        navigate("/otp", {
          state: {
            email: formData.email,
          },
        });
      }

    } catch (error) {
      console.error(error);

      setErrors({
        submit:
          error.response?.data?.message ||
          "Signup failed",
      });

    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    acceptedTerms,
    handleChange,
    handleTermsChange,
    handleSubmit,
  };
}
