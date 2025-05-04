"use client";

import { MenuItem, Select, Box } from "@mui/material";
import { useState } from "react";
import ContextoFetcher from "../queries/ContextoFetcher";

const ContextoDropdown = () => {
  const [selectedContexto, setSelectedContexto] = useState("Default");
  const [contextosUser, setContextosUser] = useState([]);
  const dropdownUniqueContextos = [...new Set(contextosUser)];

  return (
    <Box>
      <ContextoFetcher
        selectedContexto={selectedContexto}
        setContextosUser={setContextosUser}
        contextosUser={contextosUser}
      />
      <Select
        fullWidth
        size="medium"
        value={selectedContexto}
        onChange={(e) => setSelectedContexto(e.target.value)}
      >
        <MenuItem value="Default">Contexto</MenuItem>
        {dropdownUniqueContextos.map((option) => (
          <MenuItem value={option}>{option}</MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default ContextoDropdown;
