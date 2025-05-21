"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Link from "next/link";
import Image from "next/image";
import useLoggedUser from "../hooks/useLoggedUser";
import Logo from "../assets/inn2Data.jpeg"

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const storedUser = useLoggedUser();

  useEffect(() => {
    if (storedUser) {
      router.push("/datacanvas");
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = `http://209.159.155.110:8000/login?user=${form.username}&pwd=${form.password}&operacao=in`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data === true) {
        setSuccess(true);
        localStorage.setItem("user", form.username);
      } else {
        setError(data.message || "Falha no login");
      }
    } catch (err) {
      console.log("err", err);

      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/datacanvas");
      }, 200); 

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        flexDirection: "column",
        p: 3,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "2%",
          top: "2%",
          textAlign: "center",
          mb: 2,
        }}
      >
        <Image
          src={Logo}
          alt="Logo"
          width={130}
          height={60}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Typography variant="subtitle1" gutterBottom>
            Nome de usuário
          </Typography>
          <TextField
            fullWidth
            name="username"
            value={form.username}
            onChange={handleChange}
            variant="filled"
            placeholder="Digite seu usuário"
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle1" gutterBottom>
            Senha
          </Typography>
          <TextField
            fullWidth
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            variant="filled"
            placeholder="Digite sua senha"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Login realizado com sucesso!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ textTransform: "none", mb: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : "Entrar"}
          </Button>

          <Typography variant="body2" textAlign="center">
            <Link
              href="/cadastrodeusuarios"
              style={{ textDecoration: "none", color: "#1976d2" }}
            >
              Ainda não está cadastrado?
            </Link>
          </Typography>
        </form>
      </Box>
    </Box>
  );
}
