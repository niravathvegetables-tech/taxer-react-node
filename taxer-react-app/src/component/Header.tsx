  import React, { useState,useEffect } from "react";

interface HeaderProps {
  onTabChange: (tab: string) => void;
}

function Header({ onTabChange }: HeaderProps) {


  const [menuOpen, setMenuOpen] = useState(false);

  const mobmenu = () => {
    setMenuOpen(!menuOpen);
  }

    const navItems = ["Home", "Stock", "Purchase", "Sales", "Receipt", "Payment", "Contra", "Tax"];
 


  return (
    <div  className={`head ${menuOpen ? 'openactive' : ''}`}  >
    <a className="mob-menu" onClick={mobmenu} >Menu</a>
     <ul className={`header-menu ${menuOpen ? 'active' : ''}`} >
           {navItems.map((item) => (
              <li
                key={item}
                onClick={() => onTabChange(item)}
              >
                {item}
              </li>
            ))}
     </ul>
    </div>
  );
}

export default Header;