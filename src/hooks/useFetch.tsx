// hooks/useFetch.ts
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export const useFetch = (cb: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error?.message ||
        err.message ||
        "Something went wrong";

      setError(msg);
      if (msg === "Token not found" || msg === "Invalid token") {
        navigate("/signin", { replace: true });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fn, error, setData, setError };
};
