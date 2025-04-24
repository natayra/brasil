"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";

export default function LoginModal({ setIsLoggedIn }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    const url = `http://209.159.155.110:8000/sign?user=${form.username}&pwd=${form.password}&operacao=in`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data === true) {
        console.log(data);
        setSuccess(true);
        setIsLoggedIn(true);
        localStorage.setItem("user", form.username);
        console.log("Login success");
        setTimeout(() => {
          setOpen(false);
        }, 1500);
      } else {
        setError(data.message || "Falha no login");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Login
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 2 },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Login
        </DialogTitle>
        <Box
          display="flex"
          justifyContent="flex-end"
          position="absolute"
          top={10}
          right={10}
        >
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
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

            <DialogActions sx={{ flexDirection: "column", justifyContent: "center", mt: 1 }}>
              <Button
                type="submit"
                variant="outlined"
                fullWidth
                disabled={loading}
                sx={{ textTransform: "none", marginBottom: 3 }}
              >
                {loading ? <CircularProgress size={24} /> : "Entrar"}
              </Button>
              <Link href="/cadastrodeusuarios">Ainda não está cadastrado?</Link>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
