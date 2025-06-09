import { useContext, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { AuthContext } from '../utilities/providers/AuthProvider';
import { useNavigation } from '@react-navigation/native';
import { getAuth, deleteUser } from 'firebase/auth';

function formatarCelular(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length > 0) value = '(' + value;
  if (value.length > 3) value = value.slice(0, 3) + ') ' + value.slice(3);
  if (value.length > 10) value = value.slice(0, 10) + '-' + value.slice(10);
  return value;
}

const Cadastrar = () => {
  const { signUp, updateUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);
  const [isPicking, setIsPicking] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors }
  } = useForm();

  const senha = watch('senha', '');

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
          aspect: [4, 3],
          quality: 1
        });

        if (!result.canceled && result.assets?.length > 0) {
          setImageUri(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Erro ao escolher imagem:', error);
    } finally {
      setIsPicking(false);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { user } = await signUp(data.email, data.senha);
      await updateUser(data.nome, imageUri || '');

      const usuarioImp = {
        uid: user.uid,
        nome: user.displayName,
        email: user.email,
        fotoUrl: imageUri || '',
        role: 'usuario',
        celular: data.celular
      };

      console.log('Enviando para backend:', usuarioImp);

      await axios.post(`${process.env.URL_EXPO_API_PUBLICA}/usuarios/cadastrar`, usuarioImp);
      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Main');
    } catch (err) {
      console.error('Erro detalhado no cadastro:', err);

      if (err.code === 'auth/email-already-in-use') {
        setError('email', {
          type: 'manual',
          message: 'Este e-mail já está em uso.'
        });
        setLoading(false);
        return;
      } else if (err.code === 'auth/weak-password') {
        setError('senha', {
          type: 'manual',
          message: 'A senha deve ter pelo menos 6 caracteres.'
        });
        setLoading(false);
        return;
      }

      if (err.response && err.response.status === 400) {
        Alert.alert('Erro', err.response.data?.message || 'Erro ao criar conta. Tente novamente.');
        setLoading(false);
        return;
      }

      if (!err.code || err.code !== 'auth/email-already-in-use') {
        try {
          const auth = getAuth();
          if (auth.currentUser) {
            await deleteUser(auth.currentUser);
          }
        } catch (deleteErr) {
          if (
            deleteErr.code === 'auth/user-token-expired' ||
            deleteErr.message?.includes('auth/user-token-expired')
          ) {
            console.warn('Token expirado ao tentar remover usuário do Auth. O usuário será removido automaticamente pelo Firebase em breve.');
          } else {
            console.warn('Erro ao remover usuário do Auth:', deleteErr);
          }
        }
      }

      Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CADASTRAR</Text>
      <Text style={styles.subtitle}>Crie uma conta</Text>

      <Controller
        control={control}
        name="nome"
        rules={{ required: 'Nome é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Nome"
            style={styles.input}
            value={value}
            onChangeText={onChange}
            autoCapitalize="words"
          />
        )}
      />
      {errors.nome && <Text style={styles.error}>{errors.nome.message}</Text>}

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            style={styles.input}
            keyboardType="email-address"
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="senha"
        rules={{
          required: 'Senha é obrigatória',
          minLength: {
            value: 6,
            message: 'A senha deve ter pelo menos 6 caracteres'
          }
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Senha"
            secureTextEntry
            style={styles.input}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />
      {errors.senha && <Text style={styles.error}>{errors.senha.message}</Text>}

      <Controller
        control={control}
        name="confirmarSenha"
        rules={{
          required: 'Confirmação de senha obrigatória',
          validate: (value) =>
            value === senha || 'As senhas não coincidem'
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirme a senha"
            secureTextEntry
            style={styles.input}
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
          />
        )}
      />
      {errors.confirmarSenha && <Text style={styles.error}>{errors.confirmarSenha.message}</Text>}

      <Controller
        control={control}
        name="celular"
        rules={{ required: 'N° de celular é obrigatório' }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Celular"
            keyboardType="phone-pad"
            style={styles.input}
            value={value}
            onChangeText={text => onChange(formatarCelular(text))}
            maxLength={15}
            autoCapitalize="none"
          />
        )}
      />
      {errors.celular && <Text style={styles.error}>{errors.celular.message}</Text>}

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={isPicking}>
        <Text style={styles.imagePickerText}>
          {imageUri ? 'Imagem Selecionada' : 'Selecionar Imagem'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{ width: 100, height: 100, borderRadius: 10, marginVertical: 10 }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>CRIAR CONTA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Cadastrar;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#5A67D8',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  imagePicker: {
    backgroundColor: '#3182ce',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  },
  imagePickerText: {
    color: '#fff',
    fontWeight: '600'
  },
  error: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8
  }
});