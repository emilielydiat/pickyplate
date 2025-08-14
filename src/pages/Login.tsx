import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import supabase from "../supabase";
import logo from "../assets/logo-medium.svg";
import { useUserContext } from "../context/UserContext";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const emailFormat = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export function Login() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
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
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setLoginError(
        error.message ||
          "Something went wrong when logging in. Please try again later."
      );
    } else {
      navigate("/");
    }
  };

  if (user) return <Navigate to={"/"} />;

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
        <Box maxHeight={46} mb={5}>
          <img src={logo} alt="PickyPlate" />
        </Box>

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
          type="password"
          label="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Minimum 8 characters" },
            maxLength: { value: 80, message: "Maximum 80 characters" },
          })}
          error={!!errors.password}
          helperText={errors.password?.message || " "}
          disabled={isSubmitting}
        />

        {loginError && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {loginError}
          </Typography>
        )}

        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{ mt: 3 }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>

        <Divider sx={{ mt: 10, mb: 4 }} />
        <Button
          component={Link}
          to="/signup"
          variant="text"
          sx={{
            alignSelf: "center",
            textTransform: "none",
            color: "grey.700",
            "&:hover": { color: "grey.900" },
          }}
        >
          Don't have an account? Register
        </Button>
      </Box>
    </>
  );
}
