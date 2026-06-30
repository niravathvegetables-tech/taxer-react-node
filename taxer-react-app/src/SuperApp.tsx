import React, { useState, useRef, useEffect } from "react";
 import App from './App';

const SuperApp: React.FC = () => {

  const [click,SetClick]=useState(false);

 const SetClicknnow = () => {
    SetClick(prev => !prev); // flips true ↔ false
  };


  return (
    <div>
      <h1 onClick={SetClicknnow}>Woo Commerce Python</h1>


      {click&&( 

      <App />

      )}

      

    </div>
  );
};

export default SuperApp;
