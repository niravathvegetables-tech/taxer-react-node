import React, { useState,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './component/Header';
import url from './component/Config';
import Contra from './component/Contra';
import Receipt from './component/Receipt';
import Payment from './component/Payment';
import Purchase from './component/Purchase';
import Sales from './component/Sales';
import Stock from './component/Stock';
import Tax from './component/Tax';

    import SVG from './component/Svg';

// Define the shape of your form data
interface FormData {
  companyName: string;
  companyAddress: string;
  companyTrn: string;
  companyAmount: string;
  companyID: string;
  companyTax:number;
  
}

interface Company {
  company_id: string;
  company_name: string;
  company_address: string;
  company_trn: string;
  company_data: string;
  tax_id: number;
  company_amount: string;
  showinfo: boolean;
    submitval:string;
    activeTab:string;
    showdefaulter:boolean;
}

interface tax{

  tax_id: number; 
   tax_name: string;
   tax_percent: number;
  
}

  interface StockItem{

    stocks_id : string,
    stocks_name : string,
    stocks_price : string,
    stocks_total : string,
    stocks_unit : string,
    stocks_image : string

  }

const App: React.FC = () => {

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyAddress: "",
    companyTrn: "",
    companyAmount: "",
    companyID: "",
    companyTax:0
     
  });

  const [company, setCompany] = useState<Company[]>([]);

const [stock, setStock] = useState<StockItem[]>([]);

  const [hoverTrigger, setHoverTrigger] = useState(0);

   const [taxofthis, settaxofthis] = useState(0);


  const[taxarray,setTax] =useState<tax[]>([]);



  const [activeTab, setActiveTab] = useState("Home");
      const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

      const [companyid, setcompanyid] = useState<string | null>(null);

  const [showinfo, setShowinfo] = useState<boolean>(true);

  const [showdefaulter, setShowdefaulter] = useState<boolean>(true);

  const[submitval,setSubmitbtnval]=useState<string>('Submit');

  function handleTabChange(tab: string) {
    setActiveTab(tab);

    setHoverTrigger(prev => prev + 1);

    if(tab === "Home"){

      setShowdefaulter(true);
    }else{
      setShowdefaulter(false);
    }
    
  }
     

useEffect(() => {
  fetchCompany();

  fetchTax();
fetchStock();
}, []); 


function fetchStock() {
  fetch(url + "getstock")
    .then((res) => res.json())
    .then((data: StockItem[]) => {
      setStock(data.length > 0 ? data : []);
      console.log("Stock data:", data);
    })
    .catch(() => {
      // handle error
    });
}



  function handleEdit(com: Company) {
  
    setFormData({
      companyID:      com.company_id,
      companyName:    com.company_name,
      companyTrn:     com.company_trn,
      companyAmount:  com.company_amount,
      companyAddress: com.company_address,
      companyTax:0

   
    });
     
  }


     function fetchCompany() {
  fetch(url+"getcompany")
    .then((res) => res.json())
    .then((data) => {
      setCompany(data.length > 0 ? data : []);
      console.log('Company data:', data);
      setcompanyid(data[0].company_id);

       settaxofthis( data[0].tax_id );
      setLoading(false);
      setShowinfo(false);
      handleEdit(data[0]);
    })
    .catch(() => {
      setError('Failed to connect to server');
      setLoading(false);
       setShowinfo(true);
    });
}


function fetchTax() {
  fetch(url+"gettax")
    .then((res) => res.json())
    .then((data) => {
      setTax(data.length > 0 ? data : []);
      console.log('Tax data:', data);
       
    })
    .catch(() => {
      setError('Failed to connect to server');
       
    });
}

const setShowEdit=()=>{ 
  if(showinfo){
    setShowinfo(false);
  }else{

     setShowinfo(true);
  setSubmitbtnval('Edit');
  }
 

};

const cancelModal=()=> {

    setShowinfo(false);
};

  // Generic handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};



   const handleSubmit = async () => {
    
try{

 

console.log("logs++>"+formData);
  const response = await fetch(url+"company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

     const result = await response.json().then( () => fetchCompany()  );
  console.log("Server response:", result);

}catch(err){


}
     

  };

  return (
    <div className="taxapp">
      <div className="taxapp-header">

        <SVG triggerHover={hoverTrigger} />


      
   
      <Header onTabChange={handleTabChange} />

        
         

       

      </div>

    {activeTab === "Contra" &&
    
    <Contra companyid={companyid}    />       
      
    }
    
    {activeTab === "Receipt" &&
    <Receipt companyid={companyid} />           
    }


     {activeTab === "Tax" &&
    <Tax />           
    }


    {activeTab === "Stock" &&
    <Stock companyid={companyid} stocks={stock}   />           
    }


  {activeTab === "Purchase" &&
    <Purchase companyid={companyid} stocks={stock}  taxidee={taxofthis} taxarray={taxarray}     />           
    }

  
  {activeTab === "Sales" &&
    <Sales   />           
    }

    {activeTab === "Payment" &&
    <Payment companyid={companyid}  />           
    }


      {showinfo ? (


        <div className="modal-overlay">
            <div className="modal-box modalpos">

    <div className="taxapp-body">
        <h1>Welcome to Taxer here</h1>

        <div className="taxapp-body-inputs">

           <input
            type="text"
            name="companyID"
            className="companyinputs"
            placeholder="Company ID"
            value={formData.companyID}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyName"
            className="companyinputs"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyAddress"
            className="companyinputs"
            placeholder="Company Address"
            value={formData.companyAddress}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyTrn"
            className="companyinputs"
            placeholder="Company TRN"
            value={formData.companyTrn}
            onChange={handleChange}
          />

          <input
            type="text"
            name="companyAmount"
            className="companyinputs"
            placeholder="Company Capital"
            value={formData.companyAmount}
            onChange={handleChange}
          />



            <select className="taxer" name="tax"   onChange={handleSelectChange}  >

            {taxarray.length &&(

               taxarray.map((t) => {
                   

                  return(
                    
                    <option value={t.tax_id}   selected={taxofthis === t.tax_id} >{t.tax_name}- {t.tax_percent}</option>

                    )

                }


              ))

          }

            </select>





          <input
            type="button"
            name="companySubmit"
            className="companyinputs"
            value={submitval}
            onClick={handleSubmit}
          />
        </div>
         <button className="btn-cancel" onClick={cancelModal} >Cancel</button>
      </div> </div></div> ):( <p>   </p> )}



       {showdefaulter ? (

    <div className='contra-container mobwidth'>
        {company.length  && (
          company.map((com) => {



            return(

            <div className='tab-home' key={com.company_name}>
              <h2>
               {com.company_name || ""}  
              </h2>
              <p>
                Address: {com.company_address || ""}  
              </p>
              <p>
                TRN:  {String(com.company_trn || "")}
              </p>
              <p>
                Amount:  {String(com.company_amount || "")} 
              </p>
              
                <a className='btn default-btn'  onClick={setShowEdit} >Edit New Company </a>
               
            </div>

          ) } )
        ) }
      </div>
      

        ):( <p>   </p> )}







    </div>
  );
};

export default App;
