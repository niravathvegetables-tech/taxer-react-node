import React, { useState,useRef,useEffect  } from "react";
import url from "./Config";

interface FormData {
  stocks_id: string;
  stocks_name: string;
  stocks_price: string;
  stocks_total: string;
  stocks_unit: string;
  stocks_image: string; // preview URL
    file?: File;        // actual file object
}


  interface Stock{

    stocks_id : string,
    stocks_name : string,
    stocks_price : string,
    stocks_total : string,
    stocks_unit : string,
    stocks_image : string

  }


interface StockProps {
  companyid: string | null;
}

const Stock: React.FC<StockProps> = ({ companyid }) => {

const [stock, setStock] = useState<Stock[]>([]);

useEffect(() => {
  fetchStock();

  

}, []); 


function fetchStock() {
  fetch(url + "getstock")
    .then((res) => res.json())
    .then((data: Stock[]) => {
      setStock(data.length > 0 ? data : []);
      console.log("Stock data:", data);
    })
    .catch(() => {
      // handle error
    });
}


   const videoRef = useRef<HTMLVideoElement>(null);

    
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

    const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      // prepare recorder
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      setMediaRecorder(recorder);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };


  // Start recording
  const Record = () => {
    if (mediaRecorder && mediaRecorder.state === "inactive") {
      setRecordedChunks([]); // clear old data
      mediaRecorder.start();
      console.log("Recording started");
    }
  };

  // Stop recording and save
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      console.log("Recording stopped");
    }
  };


   const saveVideo = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [showmodal, Setshowmodal] = useState<boolean>(false);

  const [showdelmodal, Setshowdelmodal] = useState<boolean>(false);

  const [fun, SetFun] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    stocks_id: "",
    stocks_name: "",
    stocks_price: "",
    stocks_total: "",
    stocks_image: "",
    stocks_unit: ""
  });

  const addStock = () => {
    Setshowmodal(true);
    setFormData({
      stocks_id: "",
      stocks_name: "",
      stocks_price: "",
      stocks_total: "",
      stocks_image: "",
      stocks_unit: "",
      file: undefined
    });
  };

  const cancelModal = () => {
    Setshowmodal(false);
  };

  const submitModal = async () => {


 let endpoint = "";

  if (formData.stocks_id) {

    endpoint = url + "stock";   // update if ID exists

  } else {

    endpoint = url + "stock";         // insert if no ID


  }



        

    try {
      const formDataToSend = new FormData();

      // ✅ ensure companyid is a string
      formDataToSend.append("company_id", companyid ?? "");

      formDataToSend.append("stocks_id", formData.stocks_id);
      formDataToSend.append("stocks_name", formData.stocks_name);
      formDataToSend.append("stocks_price", formData.stocks_price);
      formDataToSend.append("stocks_total", formData.stocks_total);
      formDataToSend.append("stocks_unit", formData.stocks_unit);

      if (formData.file) {
        formDataToSend.append("stocks_image", formData.file);
      }


         
      const response = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend
      });

      const data = await response.json();
      console.log("Server response:", data);

       setFormData({
      stocks_id: "",
      stocks_name: "",
      stocks_price: "",
      stocks_total: "",
      stocks_image: "",
      stocks_unit: "",
      file: undefined
    });

       
    } catch (err) {
      console.error("Error submitting stock:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        stocks_image: previewUrl,
        file: file
      }));
    }
  };


  const Edit = (stk: Stock) => {
     Setshowmodal(true);

      setFormData({
    stocks_id: stk.stocks_id,
    stocks_name: stk.stocks_name,
    stocks_price: stk.stocks_price,
    stocks_total: stk.stocks_total,
    stocks_unit: stk.stocks_unit,
    stocks_image: url+'/uploads/'+stk.stocks_image, // existing image path
    file: undefined                 // no new file yet
  });                 // no new file yet
  


  };




const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    const Delete = (stk: Stock) => {
    console.log(stk);
setSelectedStock(stk);

setmessage("Ohh Noo are you going to do really");
    Setshowdelmodal(true);
  };



 const[message,setmessage]= useState<string>(" Do set");



const Deleting = async () => {
  if (!selectedStock) {
    console.error("No stock selected for deletion");
    return;
  }

  setmessage("Deleting");

  const endpoint = url + "deletestock";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stocks_id: selectedStock.stocks_id })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    setmessage("Success");

    // close modal after success
     

    console.log("Server response:", data);

    // refresh table
    fetchStock();
  } catch (err) {
    console.error("Error deleting stock:", err);
    setmessage("Delete failed");
  }
};









  return (
    <>
      <div className="contra-container">
     <h1 onClick={() => SetFun(prev => !prev)}>Stock</h1>

        {fun &&(

        <div className="fun">

        <a onClick={openCamera} >Video</a> <br/>

        
           <a onClick={Record}>Record</a> <br />
      <a onClick={stopRecording}>Stop</a> <br />
      <a onClick={saveVideo}>Save</a> <br />

         <video ref={videoRef} autoPlay style={{ width: "400px", border: "1px solid #ccc" }} /> <br/>

         </div> )}

        <a className="default-btn" onClick={addStock}>Add Stock</a>
      


      {showdelmodal && (
        <div className="modal-overlay">
          <div className="modal-box modalpos">
            <h2>Can we delte this row??</h2>


             <a onClick={() => Deleting()}>Yes</a>

            <a onClick={() => Setshowdelmodal(false)}>No</a>



            <p>{message}</p>

            </div>
            </div>

            )}

      {showmodal && (
        <div className="modal-overlay">
          <div className="modal-box modalpos">
            <h2>Add Stock</h2>
            <div className="modalinputs">
              <label>Company ID</label>
              <input name="company_id" value={companyid ?? ""} readOnly />

              <input type="hidden" name="stocks_id" value={formData.stocks_id} />

              <label>Stock Name</label>
              <input
                name="stocks_name"
                value={formData.stocks_name}
                onChange={handleChange}
              />

              <label>Stock Image</label>
              {formData.stocks_image && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={formData.stocks_image}
                    alt="Stock Preview"
                    style={{ width: "200px", height: "auto", border: "1px solid #ccc" }}
                  />
                </div>
              )}
              <input
                type="file"
                name="stocks_image"
                accept="image/*"
                onChange={handleChangeImage}
              />

              <label>Stock Price</label>
              <input
                name="stocks_price"
                value={formData.stocks_price}
                onChange={handleChange}
              />

              <label>Stock Unit</label>
              <input
                name="stocks_unit"
                value={formData.stocks_unit}
                onChange={handleChange}
              />

              <label>Stock Total</label>
              <input
                name="stocks_total"
                value={formData.stocks_total}
                onChange={handleChange}
              />

              

              <button className="btn-submit" onClick={submitModal}>
                Submit
              </button>
              <button className="btn-cancel" onClick={cancelModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}






  {stock && (
        <div className="resulttable">

         <table>
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Stock Amount</th>
              <th>Stock Unit</th>  
              <th>Image</th>    
              <th>Edit</th>        
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>



          {stock.map((stk)=>{


            

            let imgFile = stk.stocks_image?.replace(/^uploads[\\/]/, "");
let urlimg = url+'uploads/' + imgFile;


              return(

                   <tr>
                   <td>{stk.stocks_name}</td>
                   <td>{stk.stocks_price}</td>
                   <td>{stk.stocks_total}-{stk.stocks_unit}</td>
                   <td><img src={urlimg} width="250px" height="150px"/></td>
                  <td><a onClick={() => Edit(stk)}>Edit</a></td>
                  <td><a onClick={() => Delete(stk)}>Delete</a></td>
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

export default Stock;
