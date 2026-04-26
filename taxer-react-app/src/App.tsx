import React, { useState,useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './component/Header';
import url from './component/Config';

// Define the shape of your form data
interface FormData {
  companyName: string;
  companyAddress: string;
  companyTrn: string;
  companyAmount: string;

}

interface Company {
  company_id: number;
  company_name: string;
  company_address: string;
  company_trn: string;
  company_data: string;
  tax_id: number;
  company_amount: string;
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    companyAddress: "",
    companyTrn: "",
    companyAmount: ""
  });

  const [company, setCompany] = useState<Company[]>([]);

      const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

useEffect(() => {
  fetchCompany();
}, []); 



     function fetchCompany() {
  fetch(url+"getcompany")
    .then((res) => res.json())
    .then((data) => {
      setCompany(data.length > 0 ? data : []);
      console.log('Company data:', data);
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to connect to server');
      setLoading(false);
    });
}

  // Generic handler for input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

   const handleSubmit = async () => {
    

     const response = await fetch(url+"company", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData)
  });

     const result = await response.json();
  console.log("Server response:", result);

  };

  return (
    <div className="taxapp">
      <div className="taxapp-header">
        <Header />
      </div>

     







    <div className='company mobwidth'>
        {company.length > 0 ? (
          company.map((com) => (
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
              

               
            </div>
          ))
        ) : (
           
          


           <div className="taxapp-body">
        <h1>Welcome to Taxer</h1>

        <div className="taxapp-body-inputs">
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

          <input
            type="button"
            name="companySubmit"
            className="companyinputs"
            value="Submit"
            onClick={handleSubmit}
          />
        </div>
      </div>



          
        )}
      </div>
      









    </div>
  );
};

export default App;
