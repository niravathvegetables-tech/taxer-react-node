  import React, { useState,useEffect } from "react";
  import url from './Config';




  interface Contra{

    company_id : string,
    contra_name : string,
    contra_amount : string,
    contra_date : string,
    contra_id : string

  }


  interface FormData{

    company_id : string,
    contra_name : string,
    contra_amount : string,
    contra_date : string,
    contra_id : string

  }

  interface ContraProps {
    companyid: string | null;
  }

 const Contra: React.FC<ContraProps> = ({ companyid }) => {

  const[showcontra,setshowcontra]= useState(0);


 const [contra, setContra] = useState<Contra[]>([]);


    const [showbank, setShowbank] = useState<boolean>(false);
const [formData, setFormData] = useState<FormData>({
  company_id: companyid ?? "",
  contra_name: "",
  contra_amount: "",
  contra_date: new Date().toISOString().split("T")[0],
  contra_id: ""
});

const[message,setmessage]= useState<string>(" Do set");

    const [contraDate, setContraDate] = useState<string>(
  new Date().toISOString().split("T")[0]
);


    const addbank = () => {

      setFormData({
         company_id: companyid ?? "",
  contra_name: "",
  contra_amount: "",
  contra_date: new Date().toISOString().split("T")[0],
  contra_id: ""
});


      setShowbank(true);
    };


    const cancelModal=()=> {

      setShowbank(false);
  };


useEffect(() => {
  fetchContra();

  

}, [showcontra]); 


function fetchContra() {
  fetch(url + "getcontra")
    .then((res) => res.json())
    .then((data: Contra[]) => {
      setContra(data.length > 0 ? data : []);
      console.log("Contra data:", data);
    })
    .catch(() => {
      // handle error
    });
}



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    
  };


const delteContra=async(id: string)=>{

   setmessage("Deleting");

   try {
    const response = await fetch(url + "deletecontra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contra_id: id })
    });

    const result = await response.json();
    console.log("Delete result:", result);

    setmessage("Deleted");
    // Refresh table
    setshowcontra(prev => prev + 1);

  } catch (err) {
    console.error("Error deleting contra:", err);
    setmessage("Delete failed");
  }

}


  const AddCOntraData= async ()=>{


console.log("formData==>"+formData.contra_name);

  // const data = new FormData();
  //   data.append("company_id", companyid ?? "");
  //   data.append('contra_name', formData.contra_name);
  //   data.append('contra_amount', formData.contra_amount);
  //   data.append('contra_date', contraDate);

      let endpoint = url + "contra";

    

try{

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

    const result = await response.json().then((data) => {
  setmessage("Success");

   setshowcontra(prev => prev + 1);

  setFormData({
         company_id: companyid ?? "",
  contra_name: "",
  contra_amount: "",
  contra_date: new Date().toISOString().split("T")[0],
  contra_id: ""
});


  return data;
});
console.log("Server response:", result);

  console.log("Server response:", result);

}catch(err){


}






  }


    return (
      <>
        <div className="contra-container">
          <h1>Contra {message}</h1>
          <a className="default-btn" onClick={addbank}>Add bank</a>
        

        {showbank && (

         
          

            <div className="modal-overlay">
              <div className="modal-box modalpos">

              <div className="modalinputs" >
                <h2>AddBank{message}</h2>

                <label>Company ID</label>
                  <input
                  name="company_id"
                  value={companyid ?? ""}
                  readOnly
                  />


                <label>Bank Name</label>
                <input
                  name="contra_name"
                  value={formData.contra_name}
                   onChange={handleChange}
                   
                />

                <label>Moving Amount to Bank </label>
                <input
                  name="contra_amount"
                  value={formData.contra_amount}
                   onChange={handleChange}
                   
                />

                <label>Date</label>
                <input
                  name="contra_date"
                  type="date"
                  className="table-input"
                   value={formData.contra_date}
                   onChange={handleChange}
                  
                />

                <div className="modal-buttons">
                  <button
                    className="btn-update"
                   
                    onClick={AddCOntraData} 
                  >
                    ADD
                  </button>
                  <button className="btn-cancel" onClick={cancelModal} >Cancel</button>
                  </div>
                </div>
              </div>
            </div>

          


          )}


          {contra &&(

        <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Bank Name</th>
              <th>Amount</th>
              <th>Date</th>
              
              <th>Withdraw</th>
            </tr>
          </thead>
          <tbody>


          {contra.map((cont)=> {  

           let messager = "";

if (Number(cont.contra_amount) <= 2000) {
  messager = "cannot withdraw from website";
} else {
  messager = "Withdraw";
}


            return(

            <tr>
              <td>{cont.contra_name}</td>
              <td>{cont.contra_amount}</td>
           <td>
  {new Date(cont.contra_date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })}
</td>


              
              <td><a onClick={() => delteContra(cont.contra_id)} > {messager}</a></td>
            </tr>

              )

              }

            )}

          </tbody>
          </table>


        </div>

      )}

          </div>

      </>
    );
  };

  export default Contra;
