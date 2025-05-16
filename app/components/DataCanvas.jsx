"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, TextField, Button } from "@mui/material";
import {
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import GraphNode from "./Graphs/GraphNode";
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import ContextoDropdown from "./ContextoDropdown";
import SubmittedQuestionsFetcher from "../queries/SubmittedQuestionsFetcher";
import useLoggedUser from "../hooks/useLoggedUser";

let id = 0;
const getId = () => `graph_node_${id++}`;

function FlowWithAutoFit({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onDrop,
  nodeTypes,
  setEdges,
}) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    if (nodes.length > 0) {
      fitView({ padding: 0.2 });
    }
  }, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
      nodeTypes={nodeTypes}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      fitView
      style={{ width: "100%", height: "100%" }}
    >
      <Controls showFitView />
      <Background />
    </ReactFlow>
  );
}

export default function DataCanvas() {
  const [activeTab, setActiveTab] = useState("Data Canvas");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const router = useRouter();
  const storedUser = useLoggedUser();
  const nodeTypes = {
    graphNode: (nodeProps) => (
      <GraphNode
        {...nodeProps}
        id={nodeProps.id}
        onRefresh={handleRefresh}
        onRemove={handleRemove}
      />
    ),
  };

  useEffect(() => {
    if (storedUser) {
      setIsLoggedIn(true);
      router.push("/datacanvas");
    } else {
      router.push("/");
    }
  }, []);

  const fetchGraphData = async (query, user) => {
    try {
      const response = await fetch(
        `http://209.159.155.110:8000/resposta?query_natural=${query}&banco=postgresql&dominio=superstore&user=${user}`
      );
      const data = await response.json();
      const parsed = typeof data === "string" ? JSON.parse(data) : data;

      if (parsed?.conteudo) {
        const content =
          typeof parsed.conteudo === "string"
            ? JSON.parse(parsed.conteudo)
            : parsed.conteudo;

        if (content?.data && content?.layout) {
          return content;
        }
      }
    } catch (error) {
      console.error("Failed to fetch node data:", error);
    }

    return null;
  };

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();
      const rawData = event.dataTransfer.getData("application/reactflow");
      if (!rawData) return;

      const { label, query } = JSON.parse(rawData);
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const result = await fetchGraphData(query, storedUser);

      const newNode = {
        id: getId(),
        type: "graphNode",
        position,
        data: {
          label,
          query,
          result,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowWrapper, storedUser]
  );

  const handleSend = async () => {
    if (message.trim()) {
      const query = message;
      const result = await fetchGraphData(query, storedUser);

      const newNode = {
        id: getId(),
        type: "graphNode",
        position: {
          x: 200 + Math.random() * 300,
          y: 100 + Math.random() * 300,
        },
        data: { label: query, query, result },
      };

      setNodes((nds) => [...nds, newNode]);
      setMessage("");
    }
  };

  const handleRefresh = async (nodeId, query) => {
    const result = await fetchGraphData(query, storedUser);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                result,
              },
            }
          : node
      )
    );
  };

  const handleRemove = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      <SubmittedQuestionsFetcher
        setSubmittedQuestions={setSubmittedQuestions}
      />
      <TopBar setIsLoggedIn={setIsLoggedIn} />
      <SideBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        submittedQuestions={submittedQuestions}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: "300px"
        }}
      >
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ flexGrow: 1, p: 2, overflowY: "auto" }}
            ref={reactFlowWrapper}
          >
            {activeTab === "Data Canvas" && (
              <ReactFlowProvider>
                <FlowWithAutoFit
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onDrop={onDrop}
                  nodeTypes={nodeTypes}
                  setEdges={setEdges}
                />
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

          {activeTab === "Data Canvas" && (
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #ddd",
                backgroundColor: "#fff",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box mr="0.5rem">
                <ContextoDropdown />
              </Box>
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
