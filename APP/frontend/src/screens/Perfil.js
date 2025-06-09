import { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import Loading from '../components/Loading';

function formatarCelular(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  if (valor.length > 0) valor = "(" + valor;
  if (valor.length > 3) valor = valor.slice(0, 3) + ") " + valor.slice(3);
  if (valor.length > 10) valor = valor.slice(0, 10) + "-" + valor.slice(10);
  return valor;
}

const Perfil = () => {
  const { usuario, setUsuario } = useContext(AppContext);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (usuario?.email) {
          const user = getAuth().currentUser;
          const token = user && (await user.getIdToken(true));
          const res = await axios.get(
            `${process.env.URL_EXPO_API_PUBLICA}/usuarios/email/${usuario.email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (res.data) {
            setNome(res.data.nome || '');
            setEmail(res.data.email || '');
            setCelular(res.data.celular || '');
            setImageUri(res.data.fotoUrl || '');
          }
        }
      } catch (error) {
        console.log('Erro ao buscar dados do usuário:', error?.response?.data || error.message, error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [usuario?.email]);

  const pickImage = async () => {
    if (isPicking) return;
    setIsPicking(true);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Permita o acesso à galeria.');
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
        if (!result.canceled && result.assets?.length > 0) {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao escolher imagem.');
    } finally {
      setIsPicking(false);
    }
  };

  const handleSalvar = async () => {
    setIsSaving(true);
    try {
      const user = getAuth().currentUser;
      const token = user && (await user.getIdToken(true));

      const payload = {
        nome,
        email,
        celular,
        fotoUrl: imageUri,
      };

      const res = await axios.put(
        `${process.env.URL_EXPO_API_PUBLICA}/usuarios/atualizar/${usuario?._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsuario({
        ...usuario,
        ...payload,
        imagem: payload.fotoUrl,
        ...res.data, 
      });

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.log('Erro', 'Erro ao atualizar dados.', error);
      Alert.alert('Erro', 'Erro ao atualizar dados.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setUsuario(null);
    await signOut(getAuth()); 
    navigation.navigate('Main'); 
  };

  if (loading || isPicking || isSaving) {
    return <Loading message="Carregando..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Meu Perfil</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={isPicking}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={{ color: '#888' }}>Selecionar Imagem</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        autoCapitalize="words"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        editable={false}
        selectTextOnFocus={false}
      />

      <Text style={styles.label}>Celular</Text>
      <TextInput
        style={styles.input}
        value={celular}
        onChangeText={valor => setCelular(formatarCelular(valor))}
        autoCapitalize="none"
        keyboardType="phone-pad"
        maxLength={15}
      />

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={isSaving}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#e53e3e', marginTop: 10 }]}
        onPress={handleLogout}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>Deslogar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Perfil;

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
  },
  imagePicker: {
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#3182ce',
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  loading: {
    position: 'absolute',
    top: 40,
    left: 40,
  },
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#3182ce',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});