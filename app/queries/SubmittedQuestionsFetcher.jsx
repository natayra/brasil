"use client";

import { useEffect } from "react";
import useLoggedUser from "../hooks/useLoggedUser";

const SubmittedQuestionsFetcher = ({ setSubmittedQuestions }) => {
  const user = useLoggedUser();

  useEffect(() => {
    console.log("here")
    const fetchSubmittedQuestions = async () => {
      try {
        const response = await fetch(
          `http://209.159.155.110:8000/userPerguntas?user=${user}`
        );
        const data = await response.json();
        setSubmittedQuestions(data);
      } catch (error) {
        console.error("Error fetching submitted questions:", error);
      }
    };

    fetchSubmittedQuestions();
  }, []);
};

export default SubmittedQuestionsFetcher;
