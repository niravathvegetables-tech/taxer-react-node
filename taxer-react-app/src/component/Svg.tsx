import React, { useState,useEffect } from 'react';
interface SVGProps {
  triggerHover: number;
}

function SVG({ triggerHover }: SVGProps) {
  
  const [hover, setHover] = useState(false);


  useEffect(() => {

    if (triggerHover === 0) return;  

    setHover(true);

    const timer = setTimeout(() => {
      setHover(false);
    }, 300);

    return () => clearTimeout(timer);  

  }, [triggerHover]);

  return (
    <div className="svg-envilop" >
      <svg
        width="200"
        height="350"
        viewBox="0 0 200 250"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Head */}
        <rect x="60" y="20" width="80" height="60" fill="silver" stroke="black" strokeWidth="2" rx="10" />
        {/* Eyes */}
        <circle cx="80" cy="50" r={hover ? 12 : 8} fill={hover ? "blue" : "black"} />
        <circle cx="120" cy="50" r={hover ? 12 : 8} fill={hover ? "blue" : "black"} />
        {/* Antenna */}
        <line x1="100" y1="20" x2="100" y2="5" stroke="black" strokeWidth="2" />
        <circle cx="100" cy="5" r={hover ? 8 : 5} fill={hover ? "yellow" : "red"} />
        {/* Body */}
        <rect x="50" y="90" width="100" height="100" fill="lightgray" stroke="black" strokeWidth="2" rx="15" />
        {/* Arms */}
        <rect x="20" y="100" width="30" height="15" fill={hover ? "darkgray" : "gray"} />
        <rect x="150" y="100" width="30" height="15" fill={hover ? "darkgray" : "gray"} />
        {/* Legs */}
        <rect x="65" y="190" width="20" height="50" fill="dimgray" />
        <rect x="115" y="190" width="20" height="50" fill="dimgray" />
      </svg>
    </div>
  );
}

export default SVG;
