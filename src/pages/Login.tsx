import { SyntheticEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../supabase";
import logo from "../assets/logo-medium.svg";
import { useUserContext } from "../context/UserContext";

export function Login() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
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
        onSubmit={handleSubmit}
      >
        <Box maxHeight={46} sx={{ mb: 4 }}>
          <img src={logo} alt="PickyPlate" />
        </Box>

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
        <Button
          variant="contained"
          type="submit"
          disabled={!email || !password || isLoading}
          sx={{ mt: 2 }}
        >
          Login
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
