import React, { useState,useRef,useEffect  } from "react";
    import url from './Config';


interface PaymentProps {
  companyid: string | null;
}


 
interface FormData {
 
  company_id: string;
}


const Purchase: React.FC<PaymentProps> = ({ companyid }) => {

const [pmodal,Setpmodal]=useState<boolean>(false);

const [formData, setFormData] = useState<FormData>({
    
    company_id:  companyid ?? "",
  });

const showModal=()=>{


    Setpmodal(true);
}


const cancelModal=()=>{


    Setpmodal(false);
}



  return (
    <div className="contra-container">
      <h1>Purchase</h1>
      <p>This is the Contra Purchase.</p>
        <a className="default-btn" onClick={showModal}>Add Purchase</a>

        {pmodal &&(
        <div className="modal-overlay">
          <div className="modal-box modalpos">
            <div className="modalinputs">
              <h2>Add Purchase</h2>



                <label>Company Id</label>
              <input
                name="company_id"
                value={formData.company_id}
                readOnly
              />

              
              <button className="btn-cancel" onClick={cancelModal}>
                  Cancel
                </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}   

export default Purchase;