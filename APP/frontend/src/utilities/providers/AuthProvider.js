import { createContext, useEffect, useState } from 'react';
import { app } from '../../config/firebase.init';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState('');

  const auth = getAuth(app);

  // SIGN UP NOVO USUARIO
  const signUp = async (email, password) => {
    try {
      setLoader(true);
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // LOGIN USUARIO
  const login = async (email, password) => {
    try {
      setLoader(true);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // LOGOUT USUARIO
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      return await signOut(auth);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // ATUALIZAR PERFIL DO USUARIO
  const updateUser = async (nome, fotoUrl) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: nome,
        photoURL: fotoUrl,
      });
      setUsuario(auth.currentUser);
    } catch (error) {
      setError(error.code);
      throw error;
    }
  };

  // OBSERVADOR DE AUTENTICAÇÃO DO USUÁRIO (Firebase)
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        await AsyncStorage.setItem('token', token);
        setUsuario({
          ...user,
          token, 
        });
      } catch (error) {
        console.error('Erro ao salvar token do Firebase:', error);
        setUsuario(user); 
      }
    } else {
      await AsyncStorage.removeItem('token');
      setUsuario(null);
    }
    setLoader(false);
  });

  return () => unsubscribe();
}, []);

  const contextValue = {
    usuario,
    signUp,
    login,
    logout,
    updateUser,
    error,
    setError,
    loader,
    setLoader
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
