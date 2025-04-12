"use client";

import React, { useRef, useCallback } from "react";
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
import { Card, CardContent, Typography, Box, Paper } from "@mui/material";

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Sample graph data for files
const graphData = {
  "file1.py": {
    data: [
      {
        x: [1, 2, 3],
        y: [4, 1, 7],
        type: "scatter",
        mode: "lines+markers",
        marker: { color: "red" },
      },
    ],
    layout: { title: "Graph from file1.py" },
  },
  "file2.py": {
    data: [
      {
        labels: ["A", "B", "C"],
        values: [30, 50, 20],
        type: "pie",
      },
    ],
    layout: { title: "Graph from file2.py" },
  },
};

const files = Object.keys(graphData);

// Unique ID generator
let id = 0;
const getId = () => `graph_node_${id++}`;

// Custom node to render Plotly graphs
const GraphNode = ({ data }) => {
  const { graph } = data;

  return (
    <Box
      sx={{
        width: 300,
        height: 250,
        background: "#fff",
        border: "1px solid #ccc",
      }}
    >
      <Plot
        data={graph?.data || []}
        layout={{ ...graph?.layout, autosize: true }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true, autosizable: true }}
      />
    </Box>
  );
};

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

    if (!fileName || !graphData[fileName]) return;

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
        graph: graphData[fileName],
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, []);

  const onDragStart = (event, fileName) => {
    event.dataTransfer.setData("application/reactflow", fileName);
    event.dataTransfer.effectAllowed = "move";
  };

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
        {files.map((file) => (
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
