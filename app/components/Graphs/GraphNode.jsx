import React, { memo } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { NodeResizer, useStore } from "@xyflow/react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const GraphNode = memo(({ id, data, onRefresh, onRemove }) => {
  const graphData = data.result;

  const isResizing = useStore((state) => {
    const internals = state?.nodeInternals;
    return internals?.get?.(id)?.resizing ?? false;
  });

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        paddingTop: "3%",
        background: "#fff",
        border: "1px solid #ccc",
        boxSizing: "border-box",  
      }}
    >
      <NodeResizer
        color="#00bcd4"
        isVisible
        minWidth={150}   
        minHeight={100}  
        handleStyle={{ width: 10, height: 10 }}
      />

      <IconButton
        aria-label="refresh"
        onClick={() => onRefresh(id, data.query)}
        size="small"
        sx={(theme) => ({
          position: "absolute",
          right: 32,
          top: 5,
          zIndex: 2,
          color: "black",
          "&:hover": {
            background: theme.palette.grey[200],
          },
        })}
      >
        <RefreshIcon sx={{ fontSize: "0.75rem" }} />
      </IconButton>

      <IconButton
        aria-label="close"
        onClick={() => onRemove(id)}
        size="small"
        sx={(theme) => ({
          position: "absolute",
          right: 5,
          top: 5,
          zIndex: 2,
          color: "black",
          "&:hover": {
            background: theme.palette.grey[200],
          },
        })}
      >
        <CloseIcon sx={{ fontSize: "0.75rem" }} />
      </IconButton>

      {!graphData && (
        <Typography variant="h6" p={10} pt={8}>
          Carregando...
        </Typography>
      )}

      {graphData && Array.isArray(graphData.data) && graphData.layout && (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            responsive: true,
            useResizeHandler: true,
            autosize: true,
            margin: { l: 50, r: 20, t: 20, b: 50 },
            font: { size: 8 },
            legend: { font: { size: 10 } },
          }}
          useResizeHandler
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: isResizing ? "none" : "auto",
          }}
        />
      )}
    </Box>
  );
});

export default GraphNode;
