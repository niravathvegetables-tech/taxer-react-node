import React, { useState, useRef, useEffect } from "react";
 import App from './App';

  import Woo from './woo';

import CameraSender from './Camerasender';
import CameraViewer from './Cameraviewer';

const SuperApp: React.FC = () => {
  const [click, SetClick] = useState(false);
   const [click2, SetClick2] = useState(false);

   const [click3, SetClick3] = useState(false);

  const SetClicknnow = () => {
    SetClick(prev => !prev);
  };

  const SetClicknnow2 = () => {
    SetClick2(prev => !prev);
  };


   const SetClicknnow3 = () => {
    SetClick3(prev => !prev);
  };

  return (
    <div className="superapp">

      <ul className="outeermenu">
      <li onClick={SetClicknnow2} >Taxer Admin </li>

       <li onClick={SetClicknnow3} >Woo commerce</li>

      <li onClick={SetClicknnow} >cam</li>


     

      </ul>
     {click2 ? <App /> : (click3 ?  <Woo /> :(click ? <CameraViewer /> : <CameraSender />))}
    
     

    </div>
  );
};

export default SuperApp;
