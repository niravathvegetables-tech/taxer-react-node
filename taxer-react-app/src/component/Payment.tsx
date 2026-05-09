import React, { useState,useRef,useEffect  } from "react";
    import url from './Config';

interface FormData {
  payment_id: number | null;
  payment_name: string;
  payment_amount: string;
  payment_date: string;
  company_id: string;
}

  interface Payments{

   payment_id: number | null;
  payment_name: string;
  payment_amount: string;
  payment_date: string;
   

  }


interface PaymentProps {
  companyid: string | null;
}

const Payment: React.FC<PaymentProps> = ({ companyid }) => {

  const [Payments, setPayment] = useState<Payments[]>([]);


  useEffect(() => {



  fetchPayment();

  

}, []); 


function fetchPayment() {
  fetch(url + "getpayment")
    .then((res) => res.json())
    .then((data: Payments[]) => {
      setPayment(data.length > 0 ? data : []);
      console.log("Payment data:", data);
    })
    .catch(() => {
      // handle error
    });
}


  const [showpayment, setshowpayment] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    payment_id: null,
    payment_name: "",
    payment_amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    company_id:  companyid ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showModal = () => {
    setFormData({
      payment_id: null,
      payment_name: "",
      payment_amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      company_id: companyid ?? "",
    });
    setshowpayment(true);
  };

  const cancelModal = () => {
    setFormData({
      payment_id: null,
      payment_name: "",
      payment_amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      company_id:  companyid ?? "",
    });
    setshowpayment(false);

      fetchPayment();
  };

  const AddPayment = async () => {

     let p= formData.payment_id ? "updatepayment" : "paymentinsert" ;

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
      payment_id: null,
      payment_name: "",
      payment_amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      company_id: companyid ?? "",
    });

}catch(err){


}


  };


const Delete = async (py: Payments) => {



  const endpoint = url + "deletepayment";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_id: py.payment_id })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    //setmessage("Success");

    // close modal after success
     

    console.log("Server response:", data);

    // refresh table
      fetchPayment();
  } catch (err) {
    console.error("Error deleting stock:", err);
   // setmessage("Delete failed");
  }




}



const Edit = (py: Payments) => {

 

    setFormData({
      payment_id: py.payment_id,
      payment_name: py.payment_name,
       payment_amount: py.payment_amount,
     payment_date: py.payment_date.split("T")[0],
      company_id: companyid ?? "",
    });


   setshowpayment(true)

}

  return (
    <div className="contra-container">
      <h1>Payment</h1>
      <a className="default-btn" onClick={showModal}>Add Payment</a>

      {showpayment && (
        <div className="modal-overlay">
          <div className="modal-box modalpos">
            <div className="modalinputs">
              <h2>Add Payment</h2>

              <input
                type="hidden"
                name="payment_id"
                value={formData.payment_id ?? ""}
                readOnly
              />

                <label>Company Id</label>
              <input
                name="company_id"
                value={formData.company_id}
                onChange={handleChange}
              />

              <label>Payment Name</label>
              <input
                name="payment_name"
                value={formData.payment_name}
                onChange={handleChange}
              />

              <label>Payment Amount</label>
              <input
                name="payment_amount"
                value={formData.payment_amount}
                onChange={handleChange}
              />

              <label>Date</label>
              <input
                name="payment_date"
                type="date"
                className="table-input"
                value={formData.payment_date}
                onChange={handleChange}
              />

              <div className="modal-buttons">
                <button className="btn-update" onClick={AddPayment}>
                  {formData.payment_id ? "Edit" : "Add"}
                </button>
                <button className="btn-cancel" onClick={cancelModal}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  


     {Payments && (
        <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Payment Name</th>
              <th>PaymentPayment Amount</th>
              <th>Payment Unit</th>  
              <th>Payment Date</th> 
              <th>Edit</th>        
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>



          {Payments.map((py)=>{


            

            


              return(

                   <tr>
                   <td>{py.payment_name}</td>
                   <td>{py.payment_amount}</td>
                    <td>{py.payment_date.split("T")[0]}</td>
                  <td><a onClick={() => Edit(py)}>Edit</a></td>
                  <td><a onClick={() => Delete(py)}>Delete</a></td>
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
};

export default Payment;