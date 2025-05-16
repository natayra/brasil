"use client";

const useSelectedContext = () => {
  const storedContext = localStorage.getItem("selectedDomain");
  return storedContext;
};

export default useSelectedContext;
