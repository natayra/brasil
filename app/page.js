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
  console.log("data", data);
  console.log("query", query);

  const handleDataFetched = (response) => {
    try {
      let parsed =
        typeof response === "string" ? JSON.parse(response) : response;

      if (parsed?.tipo_resposta === "texto") {
        const conteudo = parsed.conteudo;
        const graphPayload =
          typeof conteudo === "string" ? JSON.parse(conteudo) : conteudo;
        setGraphData(graphPayload);
      } else {
        setError("Unsupported response type");
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
        QUERY={query}
      />
      {error && <div>{error}</div>}
      {!graphData ? (
        <Typography variant="body2">Loading graph...</Typography>
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

  const nodeTypes = {
    graphNode: (props) => <GraphNode {...props} query={chatInput} />,
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
    const fileName = event.dataTransfer.getData("application/reactflow");
    const flowBounds = reactFlowWrapper.current.getBoundingClientRect();

    if (!fileName) return;

    const position = {
      x: event.clientX - flowBounds.left,
      y: event.clientY - flowBounds.top,
    };

    const newNode = {
      id: getId(),
      type: "graphNode",
      position,
      data: {
        label: fileName,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onDragStart = (event, fileName) => {
    event.dataTransfer.setData("application/reactflow", fileName);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSend = () => {
    if (chatInput.trim()) {
      console.log("User typed:", chatInput);
      // Add your message handling logic here
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
        }}
      >
        <Typography variant="h6" gutterBottom>
          Drag a File
        </Typography>
        {availableFiles.map((file) => (
          <Card
            key={file}
            draggable
            onDragStart={(e) => onDragStart(e, file)}
            sx={{
              mb: 2,
              cursor: "grab",
              "&:hover": { transform: "scale(1.03)" },
              transition: "transform 0.2s",
            }}
          >
            <CardContent>
              <Typography>{file}</Typography>
            </CardContent>
          </Card>
        ))}
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
