"use client";

import React, { useRef, useCallback, useState, memo } from "react";
import dynamic from "next/dynamic";
import {
  ReactFlowProvider,
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import GraphFetcher from "./GraphFetcher";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

let id = 0;
const getId = () => `graph_node_${id++}`;

// Custom node to render Plotly charts
const GraphNode = memo(({ data, query }) => {
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  const handleDataFetched = (response) => {
    try {
      console.log("API response:", response); // Add this
      let parsed =
        typeof response === "string" ? JSON.parse(response) : response;

      if (parsed?.conteudo) {
        const conteudo = parsed.conteudo;
        const graphPayload =
          typeof conteudo === "string" ? JSON.parse(conteudo) : conteudo;

        if (graphPayload?.data && graphPayload?.layout) {
          setGraphData(graphPayload);
        } else {
          setError("Invalid graph format");
        }
      }
    } catch (err) {
      console.error("Failed to parse graph data", err);
      setError("Invalid graph data");
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        height: 280,
        background: "#fff",
        border: "1px solid #ccc",
        p: 1,
      }}
    >
      <GraphFetcher
        fileName={data?.label}
        onDataFetched={handleDataFetched}
        QUERY={data?.query || data?.label}
      />
      {error && <div>{error}</div>}
      {!graphData ? (
        <Typography variant="body2"></Typography>
      ) : (
        <Plot
          data={graphData.data}
          layout={{ ...graphData.layout, autosize: true }}
          useResizeHandler
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </Box>
  );
});

export default function DnDGraphFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [chatInput, setChatInput] = useState("");
  const [submittedQuestions, setSubmittedQuestions] = useState([]);

  const nodeTypes = {
    graphNode: GraphNode,
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const rawData = event.dataTransfer.getData("application/reactflow");

    if (!rawData) return;

    const { label, query } = JSON.parse(rawData);
    const flowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = {
      x: event.clientX - flowBounds.left,
      y: event.clientY - flowBounds.top,
    };

    const newNode = {
      id: getId(),
      type: "graphNode",
      position,
      data: { label, query },
    };

    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onDragStart = (event, item) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(item));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      const newItem = {
        label: chatInput,
        query: chatInput,
      };

      setSubmittedQuestions((prev) => [...prev, newItem]);

      // Add the node to the canvas
      const newNode = {
        id: getId(),
        type: "graphNode",
        position: {
          x: 250 + Math.random() * 200, // Random offset so they don’t overlap
          y: 100 + Math.random() * 200,
        },
        data: newItem,
      };

      setNodes((nds) => [...nds, newNode]);

      setChatInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // You can customize this list or fetch it dynamically
  const availableFiles = ["Exemplo 1", "Exemplo 2", "Exemplo 3"];

  return (
    <Box sx={{ display: "flex", height: "84vh" }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          p: 2,
          backgroundColor: "#f4f4f4",
          borderRight: "1px solid #ddd",
          position: "relative",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Últimas pesquisas
        </Typography>
        <Typography variant="subtitle" marginBottom="8rem">
          (arraste para ver)
        </Typography>
        {submittedQuestions.map((item, index) => (
          <Card
            key={`submitted-${index}`}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            sx={{
              my: 2,
              cursor: "grab",
              "&:hover": { transform: "scale(1.03)" },
              transition: "transform 0.2s",
              textAlign: "left"
            }}
          >
            <CardContent>
              <Typography>{item.label}</Typography>
            </CardContent>
          </Card>
        ))}
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: 16,
            right: 16,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selecione um domínio
          </Typography>
          <Box
            component="select"
            sx={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              fontSize: "14px",
              backgroundColor: "#fff",
              outline: "none",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              color: "#333",
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Superstore
            </option>
            <option value="placeholder1">Placeholder 1</option>
            <option value="placeholder2">Placeholder 2</option>
          </Box>
        </Box>
      </Box>

      {/* Canvas */}
      <Box sx={{ flexGrow: 1 }} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            fitView
            style={{ backgroundColor: "#f7f9fb" }}
          >
            <Controls />

            <Background />
          </ReactFlow>
        </ReactFlowProvider>
        <Box
          sx={{
            height: "15vh",
            borderTop: "1px solid #eee",
            backgroundColor: "#fafafa",
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f4f4f4",
              borderRadius: "16px",
              px: 2,
              py: 1,
              height: "60%",
              border: "1px solid #D3D3D3",
            }}
          >
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              style={{
                flexGrow: 1,
                border: "none",
                outline: "none",
                fontSize: "1rem",
                resize: "none",
                background: "transparent",
                padding: 0,
                margin: 0,
                height: "100%",
              }}
            />
            <IconButton onClick={handleSend} color="primary">
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
