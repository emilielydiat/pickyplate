import { useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
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
  const [signupError, setSignupError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "all",
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

  if (success) {
    return (
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

        <Typography component="h1" variant="h6" mt={5}>
          Check your email to activate your account
        </Typography>
        <Typography variant="body2" mt={2}>
          Click the link in the email, and start planning meals with your
          favourite people!
          <br />
          Didn't receive the email? Check other folders like promotions or
          updates, just in case.
        </Typography>
        <Divider sx={{ mt: 10, mb: 4 }} />

        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{
            alignSelf: "center",
            textTransform: "none",
            color: "grey.700",
            "&:hover": { color: "grey.900" },
          }}
        >
          Already activated your account? Login
        </Button>
      </Box>
    );
  }

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

        <Divider sx={{ mt: 10, mb: 4 }} />

        <Button
          component={Link}
          to="/login"
          variant="text"
          sx={{
            alignSelf: "center",
            textTransform: "none",
            color: "grey.700",
            "&:hover": { color: "grey.900" },
          }}
        >
          Already have an account? Login
        </Button>
      </Box>
    </>
  );
}
