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

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoginError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginError(error.message);
    } else {
      setEmail("");
      setPassword("");
      navigate("/");
    }
  };

  if (user) return <Navigate to={"/"} />;

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
          <img src={logo} alt="PickyPlate" />

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
            Login
          </Button>
          <Link to={"/signup"}>Click here to register</Link>
        </Box>
      </form>

      {loginError && <Typography variant="body2">{loginError}</Typography>}
    </>
  );
}
