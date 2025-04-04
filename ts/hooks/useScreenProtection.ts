// import { useEffect, useState } from 'react';
 const { ipcRenderer } = window.require('electron');

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



import { useState, useEffect } from "react";

const PreventScreenshot = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  console.log('useScreenProtection 0 -->',)
  useEffect(() => {
     ipcRenderer.on('screenshot-detected', () => {
      setIsBlocked(true); // Show black overlay instantly
});

     ipcRenderer.on('remove-black-overlay', () => {
      setIsBlocked(false);
});
    const handleKeyDown = (event:any) => {
        console.log('useScreenProtection  1 -->',event)
      if (event.key === "PrintScreen") {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 2000); // Remove overlay after 2 seconds
      }
    };

    console.log('useScreenProtection 2 -->',)
    document.addEventListener("keyup", handleKeyDown);
    return () => {document.removeEventListener("keyup", handleKeyDown);
          ipcRenderer.removeAllListeners('screenshot-detected');
        ipcRenderer.removeAllListeners('remove-black-overlay');
    };
  }, []);

  return isBlocked 
};

export default PreventScreenshot;