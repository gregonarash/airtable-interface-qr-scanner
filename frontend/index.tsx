import { initializeBlock } from "@airtable/blocks/interface/ui";
import "./style.css";
import Html5QrcodePlugin from "./components/Html5QrcodePlugin";

function App() {
  // YOUR CODE GOES HERE
  return (
    <Html5QrcodePlugin
      fps={10}
      qrCodeSuccessCallback={(decodedText, decodedResult) => {
        console.log(decodedText, decodedResult);
      }}
      qrCodeErrorCallback={(errorMessage) => {
        console.error(errorMessage);
      }}
    />
  );
}

initializeBlock({ interface: () => <App /> });
