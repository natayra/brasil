'use client';

import React, { useState } from 'react';
import { DndContext, useDraggable } from '@dnd-kit/core';
import dynamic from 'next/dynamic';
import { Box, Drawer, List, ListItem, Card, CardContent, Typography, Divider } from '@mui/material';

// Dynamically import Plotly to avoid SSR issues in Next.js
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Sample data for the files (you would likely get this from your server or API)
const graphData = {
  'file1.py': {
    data: [
      {
        x: [1, 2, 3],
        y: [4, 1, 7],
        type: 'scatter',
        mode: 'lines+markers',
        marker: { color: 'red' },
      },
    ],
    layout: { title: 'Graph from file1.py' },
  },
  'file2.py': {
    data: [
      {
        labels: ['A', 'B', 'C'],
        values: [30, 50, 20],
        type: 'pie',
      },
    ],
    layout: { title: 'Graph from file2.py' },
  },
};

const files = Object.keys(graphData);

// Draggable File Component with Material UI Card
function FileItem({ id, onClick }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <ListItem ref={setNodeRef} {...listeners} {...attributes} onClick={() => onClick(id)}>
      <Card
        sx={{
          width: '100%',
          marginBottom: 2,
          boxShadow: 3,
          '&:hover': {
            cursor: 'grab',
            boxShadow: 6,
            transform: 'scale(1.05)',
          },
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
      >
        <CardContent>
          <Typography variant="body1" color="textPrimary">
            {id}
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  );
}

// Draggable File Preview Component (keeps showing file name while dragging)
function DraggableFilePreview({ id, position, setPosition }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  const handleDrag = (e) => {
    // Update the position of the dragged card based on mouse movement
    const newPosition = {
      x: e.clientX - 75, // Adjust the position for half the card's width
      y: e.clientY - 50, // Adjust the position for half the card's height
    };
    setPosition(newPosition); // Update card position
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDrag={handleDrag}
      sx={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1,
        cursor: 'move',
        transition: 'none', // Disable transition during dragging for smooth movement
      }}
    >
      <Card
        sx={{
          width: '150px',
          boxShadow: 3,
          padding: 1,
        }}
      >
        <CardContent>
          <Typography variant="body1" color="textPrimary">
            {id}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Draggable Graph Container
function DraggableGraph({ graphData, position, setPosition }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: 'graph-container' });

  const handleDrag = (e) => {
    const newPosition = {
      x: e.clientX - 100, // Keep the graph near the mouse cursor
      y: e.clientY - 50,
    };
    setPosition(newPosition); // Update graph position
  };

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDrag={handleDrag}
      sx={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        zIndex: 1,
        cursor: 'move',
        transition: 'all 0.3s ease',
      }}
    >
      {graphData ? (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            autosize: true,
          }}
          useResizeHandler
          style={{ width: '100%', height: '100%' }}
          config={{ responsive: true }}
        />
      ) : (
        <Typography variant="body1" color="textSecondary">
          No graph data available
        </Typography>
      )}
    </Box>
  );
}

export default function GraphDashboard() {
  const [activeFile, setActiveFile] = useState(null);
  const [graphPosition, setGraphPosition] = useState({ x: 100, y: 100 });
  const [draggingFile, setDraggingFile] = useState(null); // New state to track which file is being dragged

  const handleDragEnd = (event) => {
    const { active } = event;
    setActiveFile(active.id); // Set the active file to the dragged file
    setDraggingFile(null); // Reset dragging state after drop
  };

  const handleFileClick = (file) => {
    setActiveFile(file);
  };

  const handleFileDragStart = (file) => {
    setDraggingFile(file); // Track which file is being dragged
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', height: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Sidebar with File Names */}
        <Drawer
          sx={{
            width: 280,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 280,
              boxSizing: 'border-box',
              backgroundColor: '#fafafa',
              borderRight: '1px solid #ddd',
              padding: '16px',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Files
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <List>
              {files.map((file) => (
                <FileItem key={file} id={file} onClick={handleFileClick} />
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 3, position: 'relative' }}>
          {/* Show file name preview during drag */}
          {draggingFile && (
            <DraggableFilePreview
              id={draggingFile} // Show the file name while dragging
              position={graphPosition}
              setPosition={setGraphPosition}
            />
          )}
          
          {/* If a file is selected, show the graph */}
          {activeFile && !draggingFile && (
            <DraggableGraph
              graphData={graphData[activeFile]} // Pass the correct graph data here
              position={graphPosition}
              setPosition={setGraphPosition}
            />
          )}
          {/* If no file is selected, show a message */}
          {!activeFile && !draggingFile && (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 3,
              }}
            >
              <Typography variant="h6" color="textSecondary">
                Drag a file from the sidebar to view its graph.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </DndContext>
  );
}


