import { createContext, useState, useEffect } from "react";
import { data } from "../restApi.json";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.init";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken(true);

          const res = await axios.get(
            `${process.env.URL_EXPO_API_PUBLICA}/usuarios/email/${user.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUsuario({
            ...res.data,
            imagem: res.data.fotoUrl,
            uid: user.uid,
            token,
          });
          console.log("Usuario salvo no contexto:", {
            ...res.data,
            imagem: res.data.fotoUrl,
            uid: user.uid,
            token,
          });
        } catch (e) {
          const token = await user.getIdToken(true);
          setUsuario({
            nome: user.displayName || "Usuário",
            email: user.email,
            imagem: user.photoURL,
            uid: user.uid,
            token,
          });
        }
      } else {
        setUsuario(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    data,
    usuario,
    setUsuario,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;