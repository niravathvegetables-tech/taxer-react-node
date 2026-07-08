import React, { useState,useEffect } from 'react';
import url from './component/Config';



const pyurl = `http://localhost:5000/`;

interface FormData {
  stocks_id: string;
  stocks_name: string;
  stocks_price: string;
  stocks_total: string;
  stocks_unit: string;
  stocks_image: string; // preview URL
    file?: File;        // actual file object
}


  interface Stock{

    stocks_id : string,
    stocks_name : string,
    stocks_price : string,
    stocks_total : string,
    stocks_unit : string,
    stocks_image : string

  }


const Woo: React.FC = () => {


   const [stock, setStock] = useState<Stock[]>([]);

    const [cart, setCart] = useState<Stock[]>([]);


useEffect(() => {

  fetchStock();  

}, []); 

    function fetchStock() {

  fetch(pyurl + "getstock")
    .then((res) => res.json())
    .then((data: StockItem[]) => {
      setStock(data.length > 0 ? data : []);
      console.log("Stock data:", data);
    })
    .catch(() => {
      // handle error
    });

}

const Buy = (stk:Stock[]) => {

  if (Array.isArray(stk)) {
    stk.map((m: any) => {
      m.stocks_total = 1;
      return m;
    });
  } else {
    // handle single object case
    stk.stocks_total = 1;
  }

  setCart((prev) => {

     const exists = prev.find(item => item.stocks_id === stk.stocks_id);

       if (exists) {


        return prev.map(item =>
        item.stocks_id === stk.stocks_id
          ? { ...item, stocks_total: item.stocks_total + 1 }
          : item
      );


       }else{

    const updated = [...prev, stk];
    console.log(updated); // logs the new array
    return updated;
  }

  
  });

};




const Remove = (stk) => {
  setCart((prev) => {
    const updated = prev.filter(item => item !== stk);
    console.log(updated);
    return updated;
  });
};

const Proceed=async()=>{

  let p= "sales" ;

    let endpoint = pyurl + p;
  
     try{

        const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cart)
        });

      const result = await response.json().then((data) => {
      //setmessage("Success");

        //setCart([]);


      return data;
      });

     }catch(err){


    }
}



    return (

        <div className='woo'>Welcome to Stock




        {stock && (
        <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Stock Amount</th>
              <th>Stock Unit</th>  
              <th>Image</th>    
                    
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>



          {stock.map((stk)=>{


            

            let imgFile = stk.stocks_image?.replace(/^uploads[\\/]/, "");
let urlimg = url+'uploads/' + imgFile;

 

              return(

                   <tr>
                   <td>{stk.stocks_name}</td>
                   <td>{stk.stocks_price}</td>
                   <td>{stk.stocks_total}-{stk.stocks_unit}</td>
                   <td>{imgFile
          ? <img src={urlimg} width="250px" height="150px" alt="stock" />
          : "No image"
        }</td>
                  <td><a onClick={() => Buy(stk)}>Buy</a></td>
                  
                   </tr>

                )





          }


            )}



          </tbody>
          </table>

          </div>
          )}



          {cart.length >=1 && (
        <div className="resulttable">
          <h2>My cart</h2>
         <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Stock Amount</th>
              <th>Stock Unit</th>  
              <th>Image</th>    
                    
              <th>Buy</th>
            </tr>
          </thead>
          <tbody>



          {cart.map((stk)=>{


            

            let imgFile = stk.stocks_image?.replace(/^uploads[\\/]/, "");
let urlimg = url+'uploads/' + imgFile;

 

              return(

                   <tr>
                   <td>{stk.stocks_name}</td>
                   <td>{stk.stocks_price}</td>
                   <td>{stk.stocks_total}-{stk.stocks_unit}</td>
                   <td>{imgFile
          ? <img src={urlimg} width="250px" height="150px" alt="stock" />
          : "No image"
        }</td>
                  <td><a onClick={() => Remove(stk)}>Remove</a></td>
                  
                   </tr>

                )





          }

           


            )}

           {cart.length >= 1 ? <a className="proceed" onClick={Proceed}>Proceed</a> : null}

          </tbody>
          </table>

          </div>
          )}


        </div>



        



    )
}


export default Woo;