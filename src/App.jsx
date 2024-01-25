import { useState } from "react";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import "./App.css";
import axios from "axios";

function App() {
  const [value, setValue] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const generateQRCode = () => {
    if (value !== "") {
      setIsValid(true);
      axios({
        method: "GET",
        url: `https://api.api-ninjas.com/v1/qrcode?format=png&data=${value}`,
        headers: {
          "X-Api-Key": "TyvX7NrvmCbJ9xsiNW6f4A==ioWR7qO7m2TsUYMx",
          "Content-Type": "application/json",
          Accept: "image/png",
        },
        responseType: "arraybuffer",
      }).then((response) => {
        setIsValid(false);
        const blob = new Blob([response.data], { type: "image/png" });
        setQrCodeImage(URL.createObjectURL(blob));
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      generateQRCode();
    }
  };

  const handleSaveClick = () => {
    if (qrCodeImage) {
      const link = document.createElement("a");
      link.href = qrCodeImage;
      link.download = "qr_code.png";
      link.click();
    }
  };

  return (
    <>
      <Panel>
        <h2>QR Code Generator</h2>
        <InputText
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter the Link"
        />
        <Button label="Generate" onClick={generateQRCode} />
        {isValid ? (
          <div>
            <ProgressSpinner
              style={{
                height: "50px",
                marginTop: "60px",
              }}
            />
          </div>
        ) : (
          qrCodeImage && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <img src={qrCodeImage} alt="QR Code" />
              <button onClick={handleSaveClick}>
                Save <i className="bi bi-arrow-down"></i>
              </button>
            </div>
          )
        )}
      </Panel>
    </>
  );
}

export default App;
