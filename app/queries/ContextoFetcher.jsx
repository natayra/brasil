"use client";

import { useEffect } from "react";
import useLoggedUser from "../hooks/useLoggedUser";

const ContextoFetcher = ({
  selectedContexto,
  setContextosUser,
  contextosUser,
}) => {
  const user = useLoggedUser();

  useEffect(() => {
    const fetchContextoData = async () => {
      try {
        const response = await fetch(
          `http://209.159.155.110:8000/dominios?user=${user}`
        );
        const data = await response.json();
        console.log("contexto data", data);
        const dominiosName = data.map((dominio) => dominio.nm_dominio);
        setContextosUser([...contextosUser, dominiosName].flat());
      } catch (error) {
        console.error("Error fetching contexto data:", error);
      }
    };

    fetchContextoData();
  }, [selectedContexto]);
};

export default ContextoFetcher;
