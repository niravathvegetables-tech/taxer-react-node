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


  interface FormData {
 
  company_id: string;
  tax_id:number | null;
  date:string;
}




const Sales: React.FC<SalesProps> = ({companyid,taxidee,taxarray,stocks}) => {

  const [formData, setFormData] = useState<FormData>({
  company_id: companyid ?? "",
  tax_id: taxidee,
  date: new Date().toISOString().split("T")[0], // ✅ added
});

const [date, setDate] = useState<string>(
  new Date().toISOString().split("T")[0]
);
const [showModal, SetshowModal]=useState<boolean>(false);

const handleShowModal = () => {
  SetshowModal(true);
};


const cancelModal = () =>{

   SetshowModal(false);
};



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

 const [tax, setTax] = useState<Tax[]>([]);

  useEffect(() => {
  fetchTax(); 

}, []);


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

  return (
    <div className="contra-container">
      <h1>Sales</h1>
      <p>This is the Sales.</p>
       <a className="default-btn" onClick={handleShowModal}>Add Sales</a>

       {showModal &&(


        <div className="modal-overlay">
          <div className="modal-box modalpos">
               <label>Company Id</label>
              <input
                name="company_id"
                value={formData.company_id}
                readOnly
              />

               <label>Tax</label>


               <select className="taxer" name="tax" >

            {tax.length &&(

               tax.map((t) => {


                  return(
                    
                    <option value={t.tax_id ?? ""}  selected={taxidee === t.tax_id} >{t.tax_name}- {t.tax_percent}</option>

                    )}
              ))}

            </select>

             <label>Date</label>
              <input
                name="date"
                type="date"
                className="table-input"
                value={formData.date}
                onChange={handleChange}
              />
               

                <button className="btn-submit"  > Submit  </button>
              
              <button className="btn-cancel" onClick={cancelModal} >  Cancel  </button>

            </div>
            </div>

        )}

    </div>
  );
}   

export default Sales;
