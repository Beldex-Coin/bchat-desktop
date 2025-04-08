// import { useEffect, useState } from 'react';
//  const { ipcRenderer } = window.require('electron');

// /**
//  * This custom hook should be called on the top of the app only once.
//  * It sets up a listener for events from main_node.ts and update the global redux state with the focused state.
//  */
// export function useScreenProtection() {
//   const [showOverlay, setShowOverlay] = useState(false);
//   console.log('useScreenProtection -->',)

//   useEffect(() => {
//     // ipcRenderer.on('screenshot-detected', () => {
//     //   setShowOverlay(true); // Show black overlay instantly
//     // });

//     // ipcRenderer.on('remove-black-overlay', () => {
//     //   setShowOverlay(false);
//     // });

//     const handleKeyDown = (event: any) => {
//         console.log('eventeventevent -->',event)
//       if (event.key === 'PrintScreen') {
//         alert('Screenshot detected! Please do not take screenshots of this page.');
//         event.preventDefault(); // Prevent default save behavior
//         setShowOverlay(true);
//         setTimeout(() => setShowOverlay(true), 3000);
//       }
//     };

//     document.addEventListener('onkeydown', handleKeyDown);
//     return () => {
//     //   ipcRenderer.removeAllListeners('screenshot-detected');
//     //   ipcRenderer.removeAllListeners('remove-black-overlay');
//       document.removeEventListener('onkeydown', handleKeyDown);
//     };
//   }, []);

//   return showOverlay;
// }



// import { useState, useEffect } from "react";

// const ApplyBlackWithMessage = ( ): void => {
//   document.documentElement.classList.add("screenshot-detected");
//   const messageContainer: HTMLDivElement = document.createElement("div");
//   messageContainer.id = "refresh-message";
//   messageContainer.style.position = "fixed";
//   messageContainer.style.top = "50%";
//   messageContainer.style.left = "50%";
//   messageContainer.style.transform="translate(-50%, -50%)";
//   messageContainer.style.backgroundColor = "white";
//   messageContainer.style.color = "black";
//   messageContainer.style.padding = "20px";
//   messageContainer.style.borderRadius = "8px";
//   messageContainer.style.zIndex = "10000";
//   messageContainer.style.textAlign = "center";
//   messageContainer.innerHTML =`<p>screen shot  is enable<p>`
// }

// const PreventScreenshot = () => {
//   const [isBlocked, setIsBlocked] = useState(false);

//   console.log('useScreenProtection 0 -->',)
// //   useEffect(() => {
// //      ipcRenderer.on('screenshot-detected', () => {
// //       setIsBlocked(true); // Show black overlay instantly
// // });

// //      ipcRenderer.on('remove-black-overlay', () => {
// //       setIsBlocked(false);
// // });
// //     const handleKeyDown = (event:any) => {
// //         console.log('useScreenProtection  1 -->',event)
// //       if (event.key === "PrintScreen") {
// //         setIsBlocked(true);
// //         setTimeout(() => setIsBlocked(false), 2000); // Remove overlay after 2 seconds
// //       }
// //     };

// //     console.log('useScreenProtection 2 -->',)
// //     document.addEventListener("keyup", handleKeyDown);
// //     document.addEventListener('keyup',()=>{
// //       navigator.clipboard.writeText('');
// //       alert('Screenshot Disabled');
// //       });
// //     return () => {document.removeEventListener("keyup", handleKeyDown);
// //           ipcRenderer.removeAllListeners('screenshot-detected');
// //         ipcRenderer.removeAllListeners('remove-black-overlay');
// //     };
    
// //   });

// useEffect(()=>{
//   let isScreenshotDetected = false;
// const handleScreenShotDetection = () => {
// if (!isScreenshotDetected) {
// isScreenshotDetected = true;
// // here need set blank screen or any notify msg
// }
// };
// const handleVisiblityChange = () => {
// if (document.visibilityState === "hidden") {
// handleScreenShotDetection();
// } 
// };
// window.addEventListener("blur", handleScreenShotDetection());
// document.addEventListener("visibilityChange", handleVisiblityChange());
// return () => {
// window.removeEventListener("blur", handleScreenShotDetection());
// document.removeEventListener("visibilityChange", handleVisiblityChange()) 
// };
// })
//   return isBlocked 
// };

// export default PreventScreenshot;

import { useEffect } from 'react';

const ApplyBlackWithMessage = () => {
  // Add a black screen
  document.documentElement.classList.add('screenshot-detected');

  // Create and insert the message container
  const messageContainer = document.createElement('div');
  messageContainer.id = 'refresh-message';
  messageContainer.style.position = 'fixed';
  messageContainer.style.top = '50%';
  messageContainer.style.left = '50%';
  messageContainer.style.transform = 'translate(-50%, -50%)';
  messageContainer.style.backgroundColor = 'white';
  messageContainer.style.color = 'black';
  messageContainer.style.padding = '20px';
  messageContainer.style.borderRadius = '8px';
  messageContainer.style.zIndex = '10000';
  messageContainer.style.textAlign = 'center';
  messageContainer.innerHTML = `<p>Screenshot detected and blocked.</p>`;

  document.body.appendChild(messageContainer);

  setTimeout(() => {
    document.documentElement.classList.remove('screenshot-detected');
    const msg = document.getElementById('refresh-message');
    msg?.remove();
  }, 3000);
};

const PreventScreenshot = () => {
  // const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const handleScreenshotDetection = () => {
      // setIsBlocked(true);
      ApplyBlackWithMessage();
      // setTimeout(() => setIsBlocked(false), 3000);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleScreenshotDetection();
      }
    };

    // Detect when app loses focus
    // window.addEventListener('blur', handleScreenshotDetection);

    // Detect when tab visibility changes (user switches apps or tabs)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // window.removeEventListener('blur', handleScreenshotDetection);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // or render an overlay if desired
};

export default PreventScreenshot;
