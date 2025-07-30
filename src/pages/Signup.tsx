import { SyntheticEvent, useState } from "react";
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
      options: { data: { name } },
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
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "sm",
          gap: 2,
          padding: 2,
          marginX: "auto",
        }}
        component="form"
        onSubmit={handleSubmit}
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

        <Button type="submit" disabled={isLoading}>
          Submit
        </Button>
      </Box>

      {signupError && <Typography variant="body2">{signupError}</Typography>}

      {success && (
        <Typography variant="body2">
          Success! Please check your email to proceed.
        </Typography>
      )}
    </>
  );
}
