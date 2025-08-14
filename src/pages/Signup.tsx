import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../supabase";
import logo from "../assets/logo-medium.svg";
import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  email: string;
  password: string;
};

const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const passwordStrength = /^(?=.*\d)(?=.*[!@#$%^&*])([^\s]*)$/;

export function Signup() {
  const [success, setSuccess] = useState(false);
  const [signupError, setSignupError] = useState("Error safasdsa");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const trimOnBlur =
    (field: keyof FormValues) => (e: React.FocusEvent<HTMLInputElement>) => {
      setValue(field, e.target.value.trim(), {
        shouldValidate: true,
        shouldDirty: true,
      });
    };

  const onSubmit = async (data: FormValues) => {
    setSuccess(false);
    setSignupError("");

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name }, emailRedirectTo: location.origin },
    });

    if (error) {
      setSignupError(
        error.message ||
          "Something went wrong when signing up. Please try again later."
      );
    } else {
      setSuccess(true);
      reset({ email: "", password: "", name: data.name });
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "sm",
          padding: 2,
          marginX: "auto",
        }}
      >
        <Box maxHeight={46}>
          <img src={logo} alt="PickyPlate" />
        </Box>

        <Typography component="h1" variant="body1" mb={5}>
          Create an account to enjoy meals together with friends!
        </Typography>

        <TextField
          label="Display name"
          type="text"
          {...register("name", {
            required: "Display name is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 30, message: "Maximum 30 characters" },
          })}
          onBlur={trimOnBlur("name")}
          error={!!errors.name}
          helperText={errors.name?.message || " "}
          disabled={isSubmitting}
        />

        <TextField
          label="Email address"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: emailFormat,
              message: "Enter a valid email",
            },
          })}
          onBlur={trimOnBlur("email")}
          error={!!errors.email}
          helperText={errors.email?.message || " "}
          disabled={isSubmitting}
        />

        <TextField
          label="Password"
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 80, message: "Maximum 80 characters" },
            pattern: {
              value: passwordStrength,
              message:
                "No spaces allowed, include a number and a special character",
            },
          })}
          error={!!errors.password}
          helperText={errors.password?.message || " "}
          disabled={isSubmitting}
        />

        {signupError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {signupError}
          </Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </Button>
      </Box>

      {success && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Success! Please check your email to proceed.
        </Typography>
      )}

      <Box mt={3}>
        <Link to="/login">
          <Typography
            sx={{
              textDecoration: "none",
              color: "grey.700",
              "&:hover": { textDecoration: "none", color: "grey.900" },
            }}
          >
            Already have an account? Login
          </Typography>
        </Link>
      </Box>
    </>
  );
}
