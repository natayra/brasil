import React, { useState, memo, useCallback } from "react";
import dynamic from "next/dynamic";
import GraphFetcher from "../../queries/GraphFetcher";
import { Box, Typography } from "@mui/material";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const GraphNode = memo(({ data }) => {
  const [graphData, setGraphData] = useState(null);
  const [error, setError] = useState(null);
  console.log("graphData", data);

  const handleDataFetched = useCallback((response) => {
    try {
      let parsed =
        typeof response === "string" ? JSON.parse(response) : response;
      if (parsed?.conteudo) {
        const content =
          typeof parsed.conteudo === "string"
            ? JSON.parse(parsed.conteudo)
            : parsed.conteudo;
        if (content?.data && content?.layout) {
          setGraphData(content);
        } else {
          setError("Invalid graph format");
        }
      }
    } catch (err) {
      setError("Invalid graph data");
    }
  }, []);

  return (
    <Box sx={{ width: 320, height: 280, background: "#fff", borderRadius: 2 }}>
      <GraphFetcher
        fileName={data?.ds_texto_pergunta}
        onDataFetched={handleDataFetched}
        QUERY={data?.query || data?.ds_texto_pergunta}
      />
      {error && <Typography color="error">{error}</Typography>}
      {graphData && (
        <Plot
          data={graphData.data}
          layout={{
            ...graphData.layout,
            autosize: true,
            margin: { l: 10, r: 10, t: 30, b: 30 },
            font: { size: 10 },
            legend: { font: { size: 8 } },
          }}
          useResizeHandler
          style={{ width: "100%", height: "100%", padding: 0 }}
        />
      )}
    </Box>
  );
});

export default GraphNode;
