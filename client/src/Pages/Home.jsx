import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/model");
  };

  return (
    <>
      <div className="w-screen h-screen bg-[#FFFFFE] md:flex items-center justify-between p-5">
        <div className="glassbg h-14 w-40 py-3 px-5 fixed top-5 left-10 flex items-center justify-between rounded-full">
          <img className="h-full w-1/2 object-cover" src="./leaf.png" alt="" />
          <h1>PlantMEDS</h1>
        </div>
        <div className="h-full md:w-1/2 flex items-end mb-20">
          <div className="px-5">
            <h1 className="text-xl md:text-2xl font-black mb-2">Empowering Farmers,</h1>
            <h1 className="text-xl md:text-2xl font-black">PROTECTING CROPS.</h1>
            <p className="lg:pr-46 mt-4 text-sm md:text-md">
            Early disease detection means early action. Our AI-powered model helps you identify plant diseases instantly — ensuring healthier harvests and reducing losses.
            </p>
            <button
              onClick={handleButtonClick}
              className="px-10 py-3 rounded-full border border-black mt-10 flex items-center gap-5 
                        hover:bg-black hover:text-white transition-all duration-300 ease-in-out 
                        transform hover:scale-105 group"
            >
              Start scanning today.
              <FaArrowUp className="rotate-45 transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1" />
            </button>

          </div>
        </div>
        <div className="h-full md:w-1/2">
          <img
            className="h-full w-full object-cover saturate-150 rounded-[2em]"
            src="/bg6.jpg
            "
            alt=""
          />
        </div>
      </div>
    </>
  );
};

export default Home;
