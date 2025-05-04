"use client";

import { useEffect, useState } from "react";

const useLoggedUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser;
};

export default useLoggedUser;
