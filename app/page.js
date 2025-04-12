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
import { Card, CardContent, Typography, Box } from "@mui/material";
import GraphFetcher from "./GraphFetcher";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

let id = 0;
const getId = () => `graph_node_${id++}`;

// Custom node to render Plotly charts
const GraphNode = memo(({ data }) => {
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);

  const handleDataFetched = (data) => {
    try {
      if (typeof data === "string") {
        const parsed = JSON.parse(data);
        setGraphData(parsed);
      } else {
        setGraphData(data);
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
      <GraphFetcher fileName={data?.label} onDataFetched={handleDataFetched} />

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

const nodeTypes = {
  graphNode: GraphNode,
};

export default function DnDGraphFlow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

  // You can customize this list or fetch it dynamically
  const availableFiles = ["Exemplo 1", "Exemplo 2", "Exemplo 3"];

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
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
      </Box>
    </Box>
  );
}
