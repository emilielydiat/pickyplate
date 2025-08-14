import { SyntheticEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      navigate("/");
    }
  };

  if (user) return <Navigate to={"/"} />;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "sm",
          gap: 2,
          padding: 2,
          marginX: "auto",
        }}
        component="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box maxHeight={46} sx={{ mb: 4 }}>
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
        <Button
          variant="contained"
          type="submit"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <Box mt={4}>
          <Link to="/signup">
            <Typography
              sx={{
                textDecoration: "none",
                color: "grey.700",
                "&:hover": { textDecoration: "none", color: "grey.900" },
              }}
            >
              Don't have an account? Register
            </Typography>
          </Link>
        </Box>
      </Box>

      {loginError && <Typography variant="body2">{loginError}</Typography>}
    </>
  );
}
