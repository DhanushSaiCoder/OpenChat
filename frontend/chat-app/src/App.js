import React, { useEffect, useState } from 'react';

function App() {
   const [data, setData] = useState('');

   useEffect(() => {
      fetch('http://localhost:5000', {
         method: 'GET',
      })
         .then((response) => response.text()) // Assuming the response is plain text
         .then((data) => setData(data))
         .catch((err) => console.error('Error fetching data:', err));
   }, []);

   return (
      <div>
         <p>{data}</p>
      </div>
   );
}

export default App;
