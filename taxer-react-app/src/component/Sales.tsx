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


interface salesRows{

    stocks_id:number | null;
    sales_amount:string | null;
    sales_count:string | null;

    sales_item_type:string | null;
    sales_total:string | null;

  }




const Sales: React.FC<SalesProps> = ({companyid,taxidee,taxarray,stocks}) => {


  const [salesRows, setsalesRows] = useState<salesRows[]>([]); 

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


const addRow = () => {
  setsalesRows([
    ...salesRows,
    {
      stocks_id: null,
      sales_amount: "",
      sales_count: "",
      sales_item_type: "",
      sales_total: "",
    },
  ]);
};


const handleRowChange = (index: number, field: keyof salesRows, value: any) => {
  const updatedRows = [...salesRows];
  updatedRows[index][field] = value;

  if (field === "sales_count") {
    const amount = Number(updatedRows[index]["sales_amount"]) || 0;
    const count = Number(value) || 0;   // use value, not r
    updatedRows[index]["sales_total"] = String(amount * count);
  }

  if (field === "stocks_id" && value != null) {
    const price = stocks.find((item) => Number(item.stocks_id) === Number(value))?.stocks_price ?? "N/A";
    updatedRows[index]["sales_amount"] = String(price);

    const count = Number(updatedRows[index]["sales_count"]) || 0; // use purchase_count
    const amount = Number(price) || 0;
    updatedRows[index]["sales_total"] = String(amount * count);
  }

  setsalesRows(updatedRows);
};





const DeleteRow = (index: number) => {
  setsalesRows(prev => prev.filter((_, i) => i !== index));
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


               <div className="purchase-table-wrapper">
              <table className="purchase-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Stock Item</th>
                      <th>Sales Price</th>
                      <th>Sales Count</th>
                      <th>Sales Unit</th>
                      <th>Sales Item Total</th>
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
  {salesRows.map((row, index) => (
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
            <option key={stock.stocks_id} value={stock.stocks_id}   >
              {stock.stocks_name} (Avail: {stock.stocks_total} {stock.stocks_unit} / Price: {stock.stocks_price})
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          type="text"
          className="table-input"
          placeholder="Enter"
          value={row.sales_amount ?? ""}
          onChange={(e) => handleRowChange(index, "sales_amount", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
           placeholder="Enter"
          className="table-input"
          value={row.sales_count ?? ""}
          onChange={(e) => handleRowChange(index, "sales_count", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
           placeholder="Enter"
          className="table-input"
          value={row.sales_item_type ?? ""}
          onChange={(e) => handleRowChange(index, "sales_item_type", e.target.value)}
        />
      </td>

      <td>
        <input
          type="text"
           placeholder="Enter"
          className="table-input"
          value={row.sales_total ?? ""}
          onChange={(e) => handleRowChange(index, "sales_total", e.target.value)}
        />
      </td>
      <td><a className="m-delete" onClick={(e) =>DeleteRow(index)} >Delete</a></td>

    </tr>
  ))}
</tbody>

                  </table>


              </div>
               

                <button className="btn-submit"  > Submit  </button>
              
              <button className="btn-cancel" onClick={cancelModal} >  Cancel  </button>

            </div>
            </div>

        )}

    </div>
  );
}   

export default Sales;
