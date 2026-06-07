import React, { useState,useRef,useEffect  } from "react";
 import url from './Config';
 
interface SalesProps {
  companyid: string | null;
   taxidee: number | null;
   taxarray: Tax[]; 
   stocks: Stock[];

    
}

 interface Tax {
  tax_name: string;
  tax_percent: number;   // ✅ change to number
  tax_id: number | null;
}

interface Stock{

    stocks_id : string,
    stocks_name : string,
    stocks_price : string,
    stocks_total : string,
    stocks_unit : string,
    stocks_image : string

  }



const Sales: React.FC<SalesProps> = ({companyid,taxidee,taxarray,stocks}) => {
  return (
    <div className="contra-container">
      <h1>Sales</h1>
      <p>This is the Sales.</p>
    </div>
  );
}   

export default Sales;
