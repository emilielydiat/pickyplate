import { SyntheticEvent, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../supabase";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess(false);
    setSignupError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setSignupError(error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextField
            label="Email address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" disabled={!email || !password}>
            Submit
          </Button>
        </Box>
      </form>

      {signupError && <Typography variant="body2">{signupError}</Typography>}

      {success && (
        <Typography variant="body2">
          Success! Please check your email to proceed.
        </Typography>
      )}
    </>
  );
}
