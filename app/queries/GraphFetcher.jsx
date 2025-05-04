"use client";

import React, { useEffect, useState } from "react";
import useLoggedUser from "../hooks/useLoggedUser";

const GraphFetcher = ({ onDataFetched, QUERY }) => {
  const [loading, setLoading] = useState(true);
  const user = useLoggedUser();

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch(
          `http://209.159.155.110:8000/resposta?query_natural=${QUERY}&banco=postgresql&dominio=superstore&user=${user}`
        );
        const data = await response.json();
        console.log("data here", data)
        onDataFetched(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, [QUERY]);

  return loading ? <div>Carregando...</div> : null;
};

export default GraphFetcher;
