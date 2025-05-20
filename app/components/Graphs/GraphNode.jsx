import React, { memo } from "react";
import dynamic from "next/dynamic";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import { NodeResizer, useStore } from "@xyflow/react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const GraphNode = memo(({ id, data, onRefresh, onRemove }) => {
  const graphData = data.result;

  // Check if resizing is happening
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
        paddingTop: "6.5%",
        background: "#fff",
        border: "1px solid #ccc",
      }}
    >
      <NodeResizer
        color="#00bcd4"
        isVisible
        minWidth={350}
        minHeight={250}
        handleStyle={{ width: 10, height: 10 }}
      />

      {/* Refresh Button */}
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

      {/* Close Button */}
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
      {!graphData && <Typography>Loading...</Typography>}
      {graphData && Array.isArray(graphData.data) && graphData.layout ? (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            responsive: true,
            useResizeHandler: true,
            autosize: true,
            margin: { l: 70, r: 70, t: 50, b: 70 },
            font: { size: 10 },
            legend: { font: { size: 10 } },
          }}
          useResizeHandler
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: isResizing ? "none" : "auto",
          }}
        />
      ) : (
        <Typography variant="body2" color="textSecondary">
          Sem dados suficientes para gerar o gráfico.
        </Typography>
      )}
    </Box>
  );
});

export default GraphNode;
