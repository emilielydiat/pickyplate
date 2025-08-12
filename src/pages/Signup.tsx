import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../supabase";
import logo from "../assets/logo-medium.svg";

export function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess(false);
    setSignupError("");
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name }, emailRedirectTo: location.origin },
    });

    if (error) {
      setSignupError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "sm",
          gap: 2,
          padding: 2,
          marginX: "auto",
        }}
      >
        <Box maxHeight={46}>
          <img src={logo} alt="PickyPlate" />
        </Box>

        <Typography component="h1" variant="body1">
          Create an account to enjoy meals together with friends!
        </Typography>

        <TextField
          required
          label="Nickname"
          name="name"
          value={name}
          disabled={isLoading}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          required
          label="Email address"
          name="email"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          required
          type="password"
          label="Password"
          name="password"
          value={password}
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ mt: 2 }}
        >
          Sign up
        </Button>
      </Box>

      {signupError && <Typography variant="body2">{signupError}</Typography>}

      {success && (
        <Typography variant="body2">
          Success! Please check your email to proceed.
        </Typography>
      )}

      <Box mt={4}>
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
