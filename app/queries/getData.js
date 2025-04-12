export const getData = async () => {
  fetch('http://209.159.155.110:8000/grafico')
  .then(response => {
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
  