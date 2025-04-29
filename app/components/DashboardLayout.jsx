"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  Divider,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Image from "next/image";
import GraphNode from "./Graphs/GraphNode";

let id = 0;
const getId = () => `graph_node_${id++}`;

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("Dashboards");
  const [message, setMessage] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [contexto, setContexto] = useState("Default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const router = useRouter();

  const nodeTypes = { graphNode: GraphNode };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true);
      fetchUserQuestions(storedUser);
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, []);

  const fetchUserQuestions = async (storedUser) => {
    console.log("here");
    try {
      const res = await fetch(
        `http://209.159.155.110:8000/userPerguntas?user=${storedUser}`
      );
      const data = await res.json();
      console.log("data", data);
      setSubmittedQuestions(data);
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      const { label, query } = JSON.parse(rawData);
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: getId(),
        type: "graphNode",
        position,
        data: {
          label,
          query,
          hasFetched: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowWrapper]
  );

  const onDragStart = (e, item) => {
    const payload = {
      label: item.ds_texto_pergunta,
      query: item.ds_texto_pergunta, // or item.query if it's a separate field
      id: item.id_pergunta, // include ID if useful later
    };
    e.dataTransfer.setData("application/reactflow", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSend = async () => {
    if (message.trim()) {
      const user = localStorage.getItem("user");

      const newItem = { label: message, query: message };
      const newNode = {
        id: getId(),
        type: "graphNode",
        position: {
          x: 200 + Math.random() * 300,
          y: 100 + Math.random() * 300,
        },
        data: newItem,
      };

      setNodes((nds) => [...nds, newNode]);
      setMessage("");
    }
  };

  const tabs = [
    "Data Canvas",
    "Data Explorer",
    "Dashboards",
    "ChatPDF",
    "Configurações",
  ];

  if (!isLoggedIn) return null;

  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          background: "#fff",
          borderRight: "1px solid #ddd",
          p: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1201,
        }}
      >
        <Box>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Image
              src="/assets/ask2Data_logo.png"
              alt="Logo"
              width={180}
              height={100}
            />
          </Box>

          <Typography variant="h6" textAlign="center" fontWeight={600} mb={2}>
            Navegação
          </Typography>
          <Stack spacing={1}>
            {tabs.map((t) => (
              <Typography
                key={t}
                onClick={() => setActiveTab(t)}
                sx={{
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: activeTab === t ? 600 : 400,
                  color: "#333",
                }}
              >
                {t}
              </Typography>
            ))}
          </Stack>

          <Box mt={5}>
            <Typography variant="subtitle2" gutterBottom>
              Últimas pesquisas
            </Typography>
            <Box
              sx={{
                overflowY: "scroll",
                maxHeight: "40vh",
              }}
            >
              {submittedQuestions.map((item, i) => (
                <Card
                  key={i}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  sx={{
                    my: 1,
                    cursor: "grab",
                    "&:hover": { transform: "scale(1.03)" },
                    transition: "transform 0.2s",
                  }}
                >
                  <CardContent>
                    <Typography variant="body2">
                      {item.ds_texto_pergunta}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: "230px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{ background: "#fff", borderBottom: "1px solid #ddd", px: 2 }}
        >
          <Toolbar sx={{ justifyContent: "flex-end" }}>
            <Stack
              width="100%"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {activeTab === "Dashboards" && (
                <Box>
                  <Select
                    fullWidth
                    size="small"
                    value={contexto}
                    onChange={(e) => setContexto(e.target.value)}
                  >
                    <MenuItem value="Default">Contexto</MenuItem>
                    <MenuItem value="Vendas">Vendas</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Financeiro">Financeiro</MenuItem>
                  </Select>
                </Box>
              )}
              <IconButton onClick={handleMenuOpen}>
                <AccountCircle fontSize="large" sx={{ color: "#333" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem onClick={handleMenuClose}>Minha conta</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Stack>
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}
            ref={reactFlowWrapper}
          >
            {activeTab === "Dashboards" && (
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={(params) =>
                    setEdges((eds) => addEdge(params, eds))
                  }
                  nodeTypes={nodeTypes}
                  onDrop={onDrop}
                  onDragOver={(e) => e.preventDefault()}
                  fitView
                  style={{ width: "100%", height: "100%" }}
                >
                  <Controls />
                  <Background />
                </ReactFlow>
              </ReactFlowProvider>
            )}

            {activeTab === "Dahboards" && (
              <Box>
                <Typography variant="h6" mb={1}>
                  Painel de Dados
                </Typography>
                <table
                  style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead style={{ background: "#e0f7fa" }}>
                    <tr>
                      <th style={{ padding: 8 }}>Nome</th>
                      <th style={{ padding: 8 }}>Valor</th>
                      <th style={{ padding: 8 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, i) => (
                      <tr key={i}>
                        <td style={{ padding: 8 }}>Item {i + 1}</td>
                        <td style={{ padding: 8 }}>123</td>
                        <td style={{ padding: 8 }}>OK</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            )}

            {activeTab === "Configurações" && (
              <Typography variant="body1">
                Configurações do sistema aparecem aqui.
              </Typography>
            )}

            {activeTab === "ChatPDF" && (
              <Typography variant="body1">
                Integração com ChatPDF será exibida aqui.
              </Typography>
            )}
          </Box>

          {activeTab === "Dashboards" && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #ddd",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Digite sua pergunta..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                fullWidth
                variant="outlined"
                sx={{ mr: 2 }}
              />
              <Button variant="contained" onClick={handleSend}>
                Enviar
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
