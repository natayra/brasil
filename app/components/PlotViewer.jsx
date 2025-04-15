import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import Next.js dynamic function

// Dynamically import Plotly with SSR disabled
const Plotly = dynamic(() => import("plotly.js-dist"), { ssr: false });

const PlotViewer = () => {
  const [error, setError] = useState(null); // For handling errors
  const [isLoading, setIsLoading] = useState(true); // For loading state

const data = async () => {
  fetch(`http://209.159.155.110:8000/resposta?query_natural=${query_natural}&banco=${banco}&dominio=${dominio}`)
  .then(response => {
  console.log("here", response)

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // Parse the response as JSON
  })
  .then(data => {
    console.log(data); // Handle the data (e.g., store it in a state or use it)
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  };

  
  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetch("http://209.159.155.110:8000/grafico")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON data
      })
      .then((data) => {
        // Once data is fetched, render the plot
        setIsLoading(false); // Stop loading
        // Use Plotly to render the graph
        Plotly.newPlot("plot", JSON.parse(data));
      })
      .catch((error) => {
        setIsLoading(false); // Stop loading on error
        setError(error.message); // Set the error state
        console.error("There was a problem with the fetch operation:", error);
      });
  }, []); // Empty array means this effect runs only once after the first render

  return (
    <div>
      <h1>Plotly Graph Viewer</h1>

      {/* Display loading message or error */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {/* Div where the plot will be rendered */}
      <div id="plot"></div>
    </div>
  );
};

export default PlotViewer;
