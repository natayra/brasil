"use client";

import React, { useEffect, useState } from "react";

const GraphFetcher = ({ onDataFetched, QUERY }) => {
  const [loading, setLoading] = useState(true);
  const user = localStorage.getItem("user");

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch(
          `http://209.159.155.110:8000/resposta?query_natural="${QUERY}"&banco="postgresql"&dominio="superstore"&user=${user}`
        );
        const data = await response.json();
        onDataFetched(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [QUERY, onDataFetched]);

  return loading ? <div>Carregando...</div> : null;
};

export default GraphFetcher;
