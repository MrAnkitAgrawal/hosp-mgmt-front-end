import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetAPI = (url) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const getPatient = useCallback(async () => {
    try {
      const result = await axios.get(url);
      setData(result.data);
    } catch (error) {
      setError(error);
    }
  }, [url]);
  useEffect(() => {
    getPatient();
  }, [getPatient]);

  return { data, error, refetch: getPatient };
};
export default useGetAPI;
