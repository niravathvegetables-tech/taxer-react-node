import React from 'react';

interface HeaderProps {
  onTabChange: (tab: string) => void;
}

function Header({ onTabChange }: HeaderProps) {

    const navItems = ["Home", "Stock", "Purchase", "Sales", "Receipt", "Payment", "Contra", "Tax"];
 

  return (
    <div>
     <ul className='header-menu'>
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