import { useContext, useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { AppContext } from '../context/AppContext';

const Sair = () => {
  const { setUsuario } = useContext(AppContext);
  const navigation = useNavigation();
  const jaDeslogou = useRef(false);

  useEffect(() => {
    const logout = async () => {
      if (jaDeslogou.current) return;
      jaDeslogou.current = true;
      try {
        await AsyncStorage.removeItem('token');
        setUsuario(null);
        await signOut(getAuth());
      } catch (e) {
        // SE JÁ ESTIVER DESLOGADO, IGNORA O ERRO
      }
      navigation.navigate('Main');
    };
    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#3182ce" />
    </View>
  );
};

export default Sair;