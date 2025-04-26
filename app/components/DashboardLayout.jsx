"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation"; // <- NEW
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
  const [activeTab, setActiveTab] = useState("Ask2Data");
  const [message, setMessage] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [contexto, setContexto] = useState("Default");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const router = useRouter(); // <- NEW

  const nodeTypes = { graphNode: GraphNode };

  useEffect(() => {
    // On page load, check if user is logged in
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      router.push("/"); // Redirect to login if not logged
    }
  }, []);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/"); // Back to login page
  };

  const onDrop = useCallback((event) => {
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
      data: { label, query },
    };
    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onDragStart = (e, item) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSend = () => {
    if (message.trim()) {
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
      setSubmittedQuestions((prev) => [...prev, newItem]);
      setNodes((nds) => [...nds, newNode]);
      setMessage("");
    }
  };

  const tabs = ["Ask2Data", "Dahboards", "Configurações", "ChatPDF"];

  if (!isLoggedIn) return null; // Avoid showing page while checking login

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
                  <Typography variant="body2">{item.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {activeTab === "Ask2Data" && (
          <Box sx={{ mb: 10 }}>
            <Typography variant="subtitle2" gutterBottom>
              Contexto
            </Typography>
            <Select
              fullWidth
              size="small"
              value={contexto}
              onChange={(e) => setContexto(e.target.value)}
            >
              <MenuItem value="Default">Default</MenuItem>
              <MenuItem value="Vendas">Vendas</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Financeiro">Financeiro</MenuItem>
            </Select>
          </Box>
        )}
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
          </Toolbar>
        </AppBar>

        {/* Main section */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}
            ref={reactFlowWrapper}
          >
            {activeTab === "Ask2Data" && (
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

          {activeTab === "Ask2Data" && (
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
