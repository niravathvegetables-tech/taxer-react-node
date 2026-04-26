import React from 'react';

function Header() {
  return (
    <div>
     <ul className='header-menu'>
            <li className='active'> Home </li>
            <li>Stocks</li>
            <li>Purchase</li>
            <li>Sales</li>
            <li>Receipt</li>
            <li>Contra</li>
            <li>Tax</li>
     </ul>
    </div>
  );
}

export default Header;