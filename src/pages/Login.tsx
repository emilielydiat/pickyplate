import { SyntheticEvent, useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import supabase from "../supabase";
import logo from "../assets/logo-medium.svg";
import { SupabaseUserContext } from "../context/SupabaseUserContext.tsx";

export function Login() {
  const { user } = useContext(SupabaseUserContext);
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
        <Box maxHeight={46}>
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
        <Button type="submit" disabled={!email || !password || isLoading}>
          Login
        </Button>
        <Link to={"/signup"}>Click here to register</Link>
      </Box>

      {loginError && <Typography variant="body2">{loginError}</Typography>}
    </>
  );
}
