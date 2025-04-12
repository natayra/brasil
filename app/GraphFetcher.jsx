'use client';

import React, { useEffect, useState } from 'react';

const GraphFetcher = ({ onDataFetched }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch("http://209.159.155.110:8000/grafico");
        if (response.ok) {
          const data = await response.json();
          onDataFetched(data);  // Pass the fetched data as JSON to the parent
        } else {
          setError(`Error: ${response.status}`);
        }
      } catch (err) {
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false); // Stop loading once the fetch is done
      }
    };

    fetchGraphData(); // Fetch data on component mount
  }, [onDataFetched]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return null; // Do not render anything once data is fetched
};

export default GraphFetcher;
