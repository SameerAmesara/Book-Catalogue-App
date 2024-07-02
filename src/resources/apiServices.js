import axios from "axios";

export const uploadImage = async (request) => {
  try {
    const response = await axios.post(
      "https://k7qm4jenl3.execute-api.us-east-1.amazonaws.com/prod/upload",
      { ...request }
    );

    const data = JSON.parse(response.data?.body ?? null);
    return data;
  } catch {
    return null;
  }
};

export const deleteBook = async (request) => {
  console.log(request);
  try {
    const response = await axios.delete(
      "https://cbxp77o39h.execute-api.us-east-1.amazonaws.com/prod/deletebook",
      { data: { ...request } }
    );

    const data = JSON.parse(response.data?.body ?? null);
    console.log(data);
    return data;
  } catch {
    return null;
  }
};

export const getBooks = async () => {
  try {
    const response = await axios.get(
      "https://8kbhaf2y18.execute-api.us-east-1.amazonaws.com/prod/fetch-all"
    );

    const data = JSON.parse(response.data?.body ?? null);
    return data;
  } catch {
    return null;
  }
};

export const addBook = async (request) => {
  try {
    const response = await axios.post(
      "https://ehg4aypev0.execute-api.us-east-1.amazonaws.com/prod/addbook",
      { ...request }
    );

    const data = JSON.parse(response.data?.body ?? null);
    return data;
  } catch {
    return null;
  }
};
