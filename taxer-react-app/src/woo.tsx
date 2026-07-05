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
              <th>Edit</th>        
              <th>Delete</th>
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
                  <td><a onClick={() => Edit(stk)}>Edit</a></td>
                  <td><a onClick={() => Delete(stk)}>Delete</a></td>
                   </tr>

                )





          }


            )}



          </tbody>
          </table>

          </div>
          )}






        </div>



        



    )
}


export default Woo;