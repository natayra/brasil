import React, { useState, memo, useCallback } from "react";
import dynamic from "next/dynamic";
import GraphFetcher from "../../queries/GraphFetcher";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
const GraphNode = memo(({ id, data, onRefresh, onRemove }) => {
  const graphData = data.result;

  return (
    <Box sx={{ width: "fit-content", borderRadius: 2, paddingTop: "6.5%" }}>
      <IconButton
        aria-label="refresh"
        onClick={() => onRefresh(id, data.query)}
        size="small"
        sx={(theme) => ({
          position: "absolute",
          right: 40,
          top: 0,
          color: "black",
          background: theme.palette.secondary.main,
          "&:hover": {
            background: theme.palette.primary.light,
          },
        })}
      >
        <RefreshIcon sx={{ fontSize: "1.25rem" }} />
      </IconButton>

      <IconButton
        aria-label="close"
        onClick={() => onRemove(id)}
        size="small"
        sx={(theme) => ({
          position: "absolute",
          right: 0,
          top: 0,
          color: "black",
          background: theme.palette.error.light,
          "&:hover": {
            background: theme.palette.error.main,
          },
        })}
      >
        <CloseIcon sx={{ fontSize: "1.25rem" }} />
      </IconButton>

      {!graphData && <Typography>Loading...</Typography>}
      {graphData && Array.isArray(graphData.data) && graphData.layout ? (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            title: {
              ...graphData.layout?.title,
              font: { size: 16 },
            },
            responsive: true,
            useResizeHandler: true,
            autosize: true,
            margin: { l: 20, r: 20, t: 50, b: 40 },
            font: { size: 10 },
            legend: { font: { size: 10 } },
          }}
          useResizeHandler
          style={{
            width: "100%",
            height: "100%",
            padding: 0,
            overflow: "visible",
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
