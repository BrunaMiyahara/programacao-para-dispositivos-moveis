import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUser = () => {
  const { usuario } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!usuario?.email) return;

    const fetchUserData = async () => {
      try {
        const response = await axiosSecure.get(`/usuarios/email/${usuario.email}`);
        setCurrentUser(response.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao buscar dados do usuário");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [usuario]);

  return { currentUser, isLoading, error };
};

export default useUser;
