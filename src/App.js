import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Webcam from "react-webcam";
import {  CgArrowsExchangeAltV } from "react-icons/cg"; 


function App() {
  const API_KEY = "AQTURm0-GSYiCiHy2Ug"
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [device, setDevice] = useState(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDevice()
  }, []);

  useEffect(() => {
    const {height, width} = windowDimensions;
    if(height > width){
      setIsPortrait(true)
    } else {
      setIsPortrait(false)
    }
  }, [windowDimensions]);

  useEffect(() => {
    console.log("isPortrait ",isPortrait)
  }, [isPortrait]);


  const handleResize = () => {
    setWindowDimensions(getWindowDimensions());
  }

  const handleCameraSwitch = () => {
    if(facingMode === 'user') {
      setFacingMode("environment")
      console.log("ENV")
    } else {
      setFacingMode("user")
      console.log("USER")
    }
  }

  const fetchDevice = async () => {
    try {
      let url = `https://cloud.51degrees.com/api/v4/${API_KEY}.json`
      const response = await fetch(url, {
        method: "GET",
      })
      let res = await response.json()
      setDevice(res.device.hardwarename)
      // console.log(res.device.hardwarename)
    } catch (err) {
      console.log("Error ",err.message)
    }
  }

  const WebcamComponent = () => 
    <Webcam 
      height={isPortrait ? windowDimensions.height/3 : windowDimensions.height/2}
      width={windowDimensions.width}
      videoConstraints={{facingMode:facingMode}}
    />
  ;

  return (
    <div className="app column center">
      <div className='appContainer column'>
        <div className='header column center'>
          AISTETIC CAMERA
        </div>
        <div className='body column'>
          <div className='webContainer column'>
            <WebcamComponent/>
          </div>
          <div className='button column' onClick={()=>handleCameraSwitch()}>
            <CgArrowsExchangeAltV />
          </div>
        </div>
        <div className='footer column center'>
          <div className='model column center'>
            Model : {device ? device : "Detecting..."}
          </div>
        </div>
      </div>
    </div>
  );
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export default App;
