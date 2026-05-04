import React, { useState,useRef  } from "react";
import url from "./Config";

interface FormData {
  stocks_id: string;
  stocks_name: string;
  stocks_price: string;
  stocks_total: string;
  stocks_unit: string;
  stocks_image: string; // preview URL
  file?: File;          // actual file object
}

interface StockProps {
  companyid: string | null;
}

const Stock: React.FC<StockProps> = ({ companyid }) => {


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
    let endpoint = url + "stock";

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

  return (
    <>
      <div className="contra-container">
        <h1>Stock</h1>

        <a onClick={openCamera} >Video</a> <br/>

        
           <a onClick={Record}>Record</a> <br />
      <a onClick={stopRecording}>Stop</a> <br />
      <a onClick={saveVideo}>Save</a> <br />

         <video ref={videoRef} autoPlay style={{ width: "400px", border: "1px solid #ccc" }} /> <br/>

        <a onClick={addStock}>Add Stock</a>
      </div>

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

              <label>Stock Total</label>
              <input
                name="stocks_total"
                value={formData.stocks_total}
                onChange={handleChange}
              />

              <label>Stock Unit</label>
              <input
                name="stocks_unit"
                value={formData.stocks_unit}
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
    </>
  );
};

export default Stock;
