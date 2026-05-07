import axios from "axios";
import { parseStringPromise } from "xml2js";

const F1_XML_URL =
  "https://www.formula1.com/en/latest/all.xml";

export const getF1NewsXML = async () => {
  const response = await axios.get(F1_XML_URL, {
    timeout: 5000,
    responseType: "text"
  });

  const parsed = await parseStringPromise(response.data, {
    explicitArray: false
  });

  return parsed;
};