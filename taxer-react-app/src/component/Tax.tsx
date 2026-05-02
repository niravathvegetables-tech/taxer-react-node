  import React, { useState,useEffect } from "react";

  interface FormData{

    tax_name : string,
    tax_percent : string,
    tax_id : string

  }


const Tax: React.FC = () => {

  const[showtax,setshowtax]=useState<boolean>(false);


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

      setshowtax(true);
  }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    
  };


  const AddTax=()=>{

    let endpoint = url + "contra";

    try{

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

    const result = await response.json().then((data) => {
  setmessage("Success");

  return data;
});
console.log("Server response:", result);

  console.log("Server response:", result);

}catch(err){


}




  }


  return (
    <div className="contra-container">
      <h1>Tax {message} </h1>
     
      <a className="default-btn" onClick={showModal}>Add Tax</a>


         {showtax && (

         
          

            <div className="modal-overlay">
              <div className="modal-box modalpos">
                <h2>AddTax {message}</h2>

                <label>Company ID</label>
                  


                <label>Tax Name</label>
                <input
                  name="contra_name"
                  value={formData.tax_name}
                   onChange={handleChange}
                   
                />

                <label>Percent</label>
                <input
                  name="contra_amount"
                  value={formData.tax_percent}
                   onChange={handleChange}
                   
                />

                

                <div className="modal-buttons">
                  <button
                    className="btn-update"
                   
                    onClick={AddTax} 
                  >
                    ADD
                  </button>
                  <button className="btn-cancel" onClick={cancelModal} >Cancel</button>
                </div>
              </div>
            </div>

          


          )}



    </div>
  );
}   

export default Tax;