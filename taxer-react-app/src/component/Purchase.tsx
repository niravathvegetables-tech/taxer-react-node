import React, { useState,useRef,useEffect  } from "react";
    import url from './Config';


interface PurchaseProps {
  companyid: string | null;
   taxidee: number | null;
   taxarray: Tax[]; 

    
}


 
interface FormData {
 
  company_id: string;
  tax_id:number | null;
  date:string | null;
}

   interface Tax {
  tax_name: string;
  tax_percent: number;   // ✅ change to number
  tax_id: number | null;
}

  interface purchaseRows{

    stocks_id:number | null;
    purchase_amount:string | null;
    purchase_count:string | null;

    purchase_item_type:string | null;
    purchase_total:string | null;

  }


const Purchase: React.FC<PurchaseProps> = ({ companyid,taxidee,taxarray }) => {

const [pmodal,Setpmodal]=useState<boolean>(false);

const [stock,setStock]=useState([]);

const [date, setDate] = useState<string>(
  new Date().toISOString().split("T")[0]
);


const [formData, setFormData] = useState<FormData>({
  company_id: companyid ?? "",
  tax_id: taxidee,
  date: new Date().toISOString().split("T")[0], // ✅ added
});


const [purchaseRows, setPurchaseRows] = useState<purchaseRows[]>([]);   // ✅ rows state
const [stocks, setStocks] = useState<any[]>([]);                        // ✅ consistent naming

// Add row handler
const addRow = () => {
  setPurchaseRows([
    ...purchaseRows,
    {
      stocks_id: null,
      purchase_amount: "",
      purchase_count: "",
      purchase_item_type: "",
      purchase_total: "",
    },
  ]);
};

// Handle row changes
const handleRowChange = (index: number, field: keyof purchaseRows, value: any) => {
  const updatedRows = [...purchaseRows];
  updatedRows[index][field] = value;
  setPurchaseRows(updatedRows);
};



const showModal=()=>{


    Setpmodal(true);
}


const cancelModal=()=>{


    Setpmodal(false);
}


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



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };




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
                value={date}
                onChange={handleChange}
              />

              <div className="purchase-table-wrapper">
              <table className="purchase-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Stock Item</th>
                      <th>Purchase Price</th>
                      <th>Purchase Count</th>
                      <th>Purchase Unit</th>
                      <th>Purchase Item Total</th>
                      <th>
                        <button
                          type="button"
                          className="btn-icon btn-add-row"
                            onClick={addRow}
                          title="Add row"
                        >
                          +
                        </button>
                      </th>
                    </tr>
                  </thead>
                 <tbody>
  {purchaseRows.map((row, index) => (
    <tr key={index}>
      <td>{index + 1}</td>

      <td>
        <select
          name="stocks_id"
          className="table-input"
          value={row.stocks_id ?? ""}
          onChange={(e) => handleRowChange(index, "stocks_id", Number(e.target.value))}
        >
          <option value="">
            {stocks.length === 0 ? "Loading..." : "Select Stock"}
          </option>
          {stocks.map((stock) => (
            <option key={stock.stocks_id} value={stock.stocks_id}>
              {stock.stocks_name} (Avail: {stock.stocks_total} {stock.stocks_unit} / Price: {stock.stocks_price})
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          type="text"
          value={row.purchase_amount ?? ""}
          onChange={(e) => handleRowChange(index, "purchase_amount", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
          value={row.purchase_count ?? ""}
          onChange={(e) => handleRowChange(index, "purchase_count", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
          value={row.purchase_item_type ?? ""}
          onChange={(e) => handleRowChange(index, "purchase_item_type", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
          value={row.purchase_total ?? ""}
          onChange={(e) => handleRowChange(index, "purchase_total", e.target.value)}
        />
      </td>
    </tr>
  ))}
</tbody>

                  </table>


              </div>



              
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