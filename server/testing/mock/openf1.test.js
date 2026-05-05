import axios from "axios";

const test = async () => {
  try {
    const response = await axios.get(
      "https://api.openf1.org/v1/weather?session_key=9158"
    );

    console.log(response.data);
  } catch (error) {
    console.error(error.message);
  }
};

test();