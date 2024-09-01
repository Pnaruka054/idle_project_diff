import './display_ads.css';
import AdComponent1 from '../adComponent1/adComponent1';
import Native_Ads from '../native_ads/native_ads';
import React, { useState, useEffect, useCallback } from 'react';
import AdComponent2 from '../adComponent2/adComponent2';

const Display_Ads = () => {
  const [timer, setTimer] = useState(null); // Initialize timer as null
  const [visible, setVisible] = useState(false); // Control the visibility of the component
  const [adsLoaded, setAdsLoaded] = useState(false); // Track if ads have loaded

  // This callback will be called when ads are successfully loaded
  const handleAdsLoaded = useCallback(() => {
    setAdsLoaded(true);
  }, []);

  useEffect(() => {
    // Start the timer after a 3-second delay
    const timeoutId = setTimeout(() => {
      setTimer(10); // Start the timer with 10 seconds
    }, 3000);

    // Clean up the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    // If the timer is not set, do nothing
    if (timer === null) return;

    if (timer === 0) return;

    const intervalId = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);

    // Clean up the interval on component unmount or timer change
    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    if (adsLoaded) {
      setVisible(true); // Show the ad-container once ads are loaded
    }
  }, [adsLoaded]);

  const handleClose = () => {
    setVisible(false);
  };

  // This function could be called from within the ad components
  // or when you are sure ads have finished loading.
  const simulateAdLoading = () => {
    // Simulate ad loading completion
    setTimeout(handleAdsLoaded, 1000); // Simulate ad loading delay
  };

  useEffect(() => {
    simulateAdLoading();
  }, []);

  if (!visible) return null; // Do not render anything if the component is not visible

  return (
    <div className="ad-container">
      <div className="ad-container-child">
        <div id='ads_text'>Advertisement</div>
        <div className={`timer ${timer === null ? 'd-none' : ''}`}>
          {timer === 0 ? (
            <button className="close-button" onClick={handleClose}>
              &times;
            </button>
          ) : (
            <span>{timer}</span>
          )}
        </div>
        <div className="ad-content">
          <div id="find_ads_01">
            <AdComponent1
              adKey="a85524027f4c2f4e159e7aed7a1abb41"
              height="250"
              width="300"
            />
          </div>
          <div id="find_ads_02">
            <Native_Ads
              scriptSrc="//pl24230593.cpmrevenuegate.com/f2e76b1a9af84306102d9f8675c030e8/invoke.js"
              containerId="container-f2e76b1a9af84306102d9f8675c030e8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display_Ads;
