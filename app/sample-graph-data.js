// sample-graph-data.js

export const graphData = {
    "file1.py": {
      data: [
        {
          x: [1, 2, 3],
          y: [4, 1, 7],
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "red" },
        },
      ],
      layout: { title: "Graph from file1.py" },
    },
    "file2.py": {
      data: [
        {
          labels: ["A", "B", "C"],
          values: [30, 50, 20],
          type: "pie",
        },
      ],
      layout: { title: "Graph from file2.py" },
    },
  };
  