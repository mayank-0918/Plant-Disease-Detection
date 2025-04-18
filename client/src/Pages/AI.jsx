import React, { useState } from "react";
import { SlCloudUpload } from "react-icons/sl";
import axios from "axios";

const AI = () => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      if (image) {
        URL.revokeObjectURL(image);
      }

      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImage(imageUrl);
      setResult(null);
    } else {
      alert("Please upload a valid image file (JPG, PNG, etc).");
      setImageFile(null);
      setImage(null);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      console.log("📤 Sending image to backend...");
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: {
          timestamp: new Date().getTime()
        }
      });

      console.log("✅ Response received:", response.data);

      const data = response.data;

      // ✅ Validate proper fields
      if (data && data.disease_name && data.cure && data.precaution) {
        setResult(data);
      } else if (data && data.error) {
        setResult({ error: data.error });
      } else {
        setResult({ error: "Invalid response format from server." });
      }
    } catch (error) {
      console.error("🔥 Error during request:", error);
      setResult({ error: "Unable to connect to the server or process the request." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-auto">
      <img
        className="h-full w-full object-cover fixed"
        src="/bg2.webp"
        alt=""
      />
      <div className="p-2">
        <div className="glassbg h-14 w-40 py-3 px-5 fixed z-50 top-5 left-5 flex items-center justify-between rounded-full bg-white bg-opacity-60 shadow-md backdrop-blur-sm">
          <img className="h-full w-1/2 object-cover" src="./leaf.png" alt="Leaf logo" />
          <h1 className="text-sm font-bold">PlantMEDS</h1>
        </div>

        <div className="glassbg h-full w-full rounded-3xl px-2 py-2 md:flex gap-2 mt-20">
          {/* LEFT SECTION */}
          <div className="bg-[#FFFFFE] rounded-2xl p-5 md:w-1/2 md:flex md:flex-col items-center justify-center">
            <h1 className="text-center text-2xl font-black pt-10">
              KNOW ABOUT YOUR PLANT HEALTH
            </h1>
            <div className="w-full max-w-md mx-auto mt-10">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-upload" className="cursor-pointer block w-full">
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-gray-400 rounded-lg hover:bg-gray-100 transition">
                    <SlCloudUpload className="text-5xl text-green-600" />
                    <span className="mt-2 text-base text-gray-600">
                      Upload Image
                    </span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex flex-col gap-5 items-center mt-10">
              <h1 className="text-center">
                Upload and find what your plant is suffering from
              </h1>
              <button
                className="bg-[#7c9d76] rounded-full py-2 px-6 font-black text-white shadow hover:bg-[#6a865f] transition"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "SUBMIT"}
              </button>

              {result?.error && (
                <p className="text-red-600 font-semibold mt-2">{result.error}</p>
              )}

              {result && !result.error && (
                <p className="text-center mt-2 font-semibold text-green-800">
                  Scanned Successfully ✅
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="h-full md:w-1/2 flex flex-col justify-between gap-3 mt-4 md:mt-0">
            {result && !result.error && (
              <>
                <div className="bg-[#FFFFFE] rounded-2xl p-5 flex-1">
                  <h1 className="text-3xl font-black">• Disease Name:</h1>
                  <p className="text-sm mt-2">{result.disease_name}</p>
                </div>
                <div className="bg-[#FFFFFE] rounded-2xl p-5 flex-1">
                  <h1 className="text-3xl font-black">• Cure:</h1>
                  <p className="text-sm mt-2">{result.cure}</p>
                </div>
                <div className="bg-[#FFFFFE] rounded-2xl p-5 flex-1">
                  <h1 className="text-3xl font-black">• Precaution:</h1>
                  <p className="text-sm mt-2">{result.precaution}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AI;
