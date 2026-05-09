import React, { useState,useRef,useEffect  } from "react";
    import url from './Config';
 

interface ReceiptProps {
  companyid: string | null;
}


interface FormData {
  receipt_id : number | null;
  receipt_name: string;
  receipt_amount: string;
  receipt_date: string;
  company_id: string;
}

  interface Receipts{

   receipt_id : number | null;
  receipt_name: string;
  receipt_amount: string;
  receipt_date: string;
   

  }


const Receipt: React.FC<ReceiptProps> = ({ companyid }) => {


  const [Receipts, setReceipts] = useState<Receipts[]>([]);



    useEffect(() => {



  fetchReceipt();

  

}, []); 


function fetchReceipt() {

  fetch(url + "getreciept")
    .then((res) => res.json())
    .then((data: Receipts[]) => {
      setReceipts(data.length > 0 ? data : []);
      console.log("setReceipts data:", data);
    })
    .catch(() => {
      // handle error
    });
}


const [showreceipt, setshowreceipt] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    receipt_id: null,
    receipt_name: "",
    receipt_amount: "",
    receipt_date: new Date().toISOString().split("T")[0],
    company_id:  companyid ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showModal = () => {
    setFormData({
       receipt_id: null,
    receipt_name: "",
    receipt_amount: "",
    receipt_date: new Date().toISOString().split("T")[0],
    company_id:  companyid ?? "",
    });
    setshowreceipt(true);
  };

  const cancelModal = () => {
    setFormData({
      receipt_id: null,
    receipt_name: "",
    receipt_amount: "",
    receipt_date: new Date().toISOString().split("T")[0],
    company_id:  companyid ?? "",
    });
    setshowreceipt(false);

      fetchReceipt();
  };





  const AddReceipt = async () => {

     let p= formData.receipt_id ? "updatereciept" : "recieptinsert" ;

    let endpoint = url + p;




    try{

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

    const result = await response.json().then((data) => {
  //setmessage("Success");

  

  return data;
});
console.log("Server response:", result);

  console.log("Server response:", result);


  setFormData({
       receipt_id: null,
    receipt_name: "",
    receipt_amount: "",
    receipt_date: new Date().toISOString().split("T")[0],
    company_id:  companyid ?? "",
    });

}catch(err){


}


  };


const Delete = async (re: Receipts) => {



  const endpoint = url + "deletereciept";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ receipt_id: re.receipt_id })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    //setmessage("Success");

    // close modal after success
     

    console.log("Server response:", data);

    // refresh table
      fetchReceipt();
  } catch (err) {
    console.error("Error deleting stock:", err);
   // setmessage("Delete failed");
  }




}



const Edit = (re: Receipts) => {

 

    setFormData({
     receipt_id: re.receipt_id,
    receipt_name: re.receipt_name,
    receipt_amount:re.receipt_amount,
    receipt_date: re.receipt_date,
    company_id:  companyid ?? "",
    });


   setshowreceipt(true)

}




  return (
     <div className="contra-container">
      <h1>Receipts</h1>
      <a className="default-btn" onClick={showModal}>Add Receipts</a>

      {showreceipt && (
        <div className="modal-overlay">
          <div className="modal-box modalpos">
            <div className="modalinputs">
              <h2>Add Receipts</h2>

              <input
                type="hidden"
                name="receipt_id "
                value={formData.receipt_id  ?? ""}
                readOnly
              />

                <label>Company Id</label>
              <input
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
              />

              <label>Receipts Name</label>
              <input
                name="receipt_name"
                value={formData.receipt_name}
                onChange={handleChange}
              />

              <label>Receipts Amount</label>
              <input
                name="receipt_amount"
                value={formData.receipt_amount}
                onChange={handleChange}
              />

              <label>Date</label>
              <input
                name="receipt_date"
                type="date"
                className="table-input"
                value={formData.receipt_date}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button className="btn-update" onClick={AddReceipt}>
                  {formData.receipt_id ? "Edit" : "Add"}
                </button>
                <button className="btn-cancel" onClick={cancelModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  


     {Receipts && (
        <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Receipts Name</th>
              <th>Receipts Amount</th>
              <th>Receipts Unit</th>  
              <th>Receipts Date</th> 
              <th>Edit</th>        
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>



          {Receipts.map((re)=>{


            

            


              return(

                   <tr>
                   <td>{re.receipt_name}</td>
                   <td>{re.receipt_amount}</td>
                    <td>{re.receipt_date.split("T")[0]}</td>
                  <td><a onClick={() => Edit(re)}>Edit</a></td>
                  <td><a onClick={() => Delete(re)}>Delete</a></td>
                   </tr>

                )





          }


            )}



          </tbody>
          </table>

          </div>
          )}

       </div>
  );
}   

export default Receipt;
