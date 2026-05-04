  import React, { useState,useEffect } from "react";
    import url from './Config';

  interface FormData{

    tax_name : string,
    tax_percent : string,
    tax_id : string

  }

   interface Tax{

    tax_name : string,
    tax_percent : string,
    tax_id : string

  }


const Tax: React.FC = () => {

  const[showtax,setshowtax]=useState<boolean>(false);

const [stat, setStat] = useState(0);

 const [tax, setTax] = useState<Tax[]>([]);

  const [formData, setFormData] = useState<FormData>({
  
  tax_name: "",
  tax_percent: "",
  tax_id: ""
});

  const[message,setmessage]= useState<string>(" Do set");

      const cancelModal=()=> {

      setshowtax(false);



  };

  const showModal=()=>{

    setFormData({


    tax_name: "",
  tax_percent: "",
  tax_id:""

  });

      setshowtax(true);

  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    
  };


  const AddTax= async ()=>{


  let p= formData.tax_id ? "updatetax" : "tax" ;

    let endpoint = url + p;




    try{

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

    const result = await response.json().then((data) => {
  setmessage("Success");

  setStat(prev => prev + 1);

  return data;
});
console.log("Server response:", result);

  console.log("Server response:", result);

}catch(err){


}




  }


  useEffect(() => {
  fetchTax(); 

}, [stat]); 


function fetchTax() {
  fetch(url + "gettax")
    .then((res) => res.json())
    .then((data: Tax[]) => {
      setTax(data.length > 0 ? data : []);
      console.log("fetchTax data:", data);
    })
    .catch(() => {
      // handle error
    });
}



const Edittax=(tx : Tax)=>{

  

  setFormData({


    tax_name: tx.tax_name,
  tax_percent: tx.tax_percent,
  tax_id: tx.tax_id

  });

  setshowtax(true);

}


const Delete = async (tx: Tax) => {

  setmessage("Deleting");

  let endpoint = url + "deletetax";

  try {

    const response = await fetch(endpoint, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tax_id: tx.tax_id })
    });


    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    setmessage("Success");

    setStat(prev => prev + 1);

    console.log("Server response:", data);

  } catch (err) {

    console.error("Error deleting tax:", err);

    setmessage("Delete failed");

  }

};



  return (
    <div className="contra-container">
      <h1>Tax {message}- {stat} </h1>
     
      <a className="default-btn" onClick={showModal}>Add Tax</a>


         {showtax && (

         
          

            <div className="modal-overlay">
              <div className="modal-box modalpos">


              <div className="modalinputs" >

                <h2>AddTax {message}  </h2>

                <label>Tax ID {message} </label>
                  
                <input type="hidden"
                  name="tax_id"
                  value={formData.tax_id}
                    readOnly
                   
                />

                <label>Tax Name</label>
                <input
                  name="tax_name"
                  value={formData.tax_name}
                   onChange={handleChange}
                   
                />

                <label>Percent</label>
                <input
                  name="tax_percent"
                  value={formData.tax_percent}
                   onChange={handleChange}
                   
                />

                

                <div className="modal-buttons">
                  <button
                    className="btn-update"
                   
                    onClick={AddTax} 
                  >
                   {formData.tax_id ? "Edit" : "Add"}

                  </button>
                  <button className="btn-cancel" onClick={cancelModal} >Cancel</button>

                  </div>
                </div>
              </div>
            </div>

          


          )}


         {tax && (

          <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Tax Name</th>
              <th>Tax Percent</th>   
              <th>Edit</th>
              <th>Delete</th>       
            </tr>
          </thead>
          <tbody>
          </tbody>


          {tax.map( (tx)=>{



              return(



                  <tr>
              <td>{tx.tax_name}</td>
              <td>{tx.tax_percent}</td> 
              <td><a onClick={() => Edittax(tx)}>Edit</a></td>
              <td><a onClick={() => Delete(tx)}>Delete</a></td>          
               </tr>





                )




          }





            )}




          </table>

          </div>

          )}

    </div>
  );
}   

export default Tax;