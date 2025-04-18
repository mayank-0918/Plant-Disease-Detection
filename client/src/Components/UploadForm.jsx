import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', image);

    const res = await axios.post('http://localhost:5000/predict', formData);
    setResult(res.data.result);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Predict</button>
      {result && <h2>Prediction: {result}</h2>}
    </div>
  );
}

export default UploadForm;
