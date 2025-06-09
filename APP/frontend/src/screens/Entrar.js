import { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import useAuth from '../hooks/useAuth';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Entrar = () => {                       
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, error, setError, loader, setLoader } = useAuth();
  const [credenciaisInvalidas, setCredenciaisInvalidas] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { setUsuario } = useContext(AppContext);

  const isEmailValid = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const traduzErro = (codigo) => {
    switch (codigo) {
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Email ou senha incorretos.';
      default:
        return 'Erro ao fazer login.';
    }
  };

  const entrar = async () => {
    setError('');
    setCredenciaisInvalidas(false);

    if (!email || !senha) {
      setError('Preencha todos os campos.');
      console.log('[entrar] Campos vazios:', { email, senha });
      return;
    }

    if (!isEmailValid(email)) {
      setError('Por favor, insira um e-mail válido.');
      console.log('[entrar] Email inválido:', email);
      return;
    }

    setLoader(true);
    try {
      console.log('[entrar] Chamando login()');
      await login(email, senha);
      console.log('[entrar] Login Firebase OK');

      const token = await AsyncStorage.getItem('token');
      console.log('[entrar] Token JWT:', token);

      const url = `${process.env.URL_EXPO_API_PUBLICA}/usuarios/email/${email}`;
      console.log('[entrar] Buscando usuário no backend:', url);

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[entrar] Dados do backend:', res.data);

      setUsuario({
        ...res.data,
        imagem: res.data.fotoUrl,
      });

      if (Platform.OS === 'android') {
        ToastAndroid.show('Login realizado com sucesso!', ToastAndroid.SHORT);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
      console.log('[entrar] Navegação para Main');
            } catch (err) {
        console.log('[entrar] Erro no login:', err?.response?.data?.message || err?.message || err);

        let mensagem = '';

        const erroCredenciais =
          err.code === 'auth/user-not-found' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/invalid-credential' ||
          (err.response?.data?.message &&
            err.response.data.message
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes('email ou senha incorretos'));

        if (erroCredenciais) {
          mensagem = 'Email ou senha incorretos.';
          setCredenciaisInvalidas(true);
          setError('');
        } else if (err.code) {
          mensagem = traduzErro(err.code);
          setError(mensagem);
        } else if (err.response?.data?.message) {
          mensagem = err.response.data.message;
          setError(mensagem);
        } else {
          mensagem = 'Erro ao fazer login.';
          setError(mensagem);
        }

        Alert.alert('Erro', mensagem);
      } finally {
        setLoader(false);
        console.log('[entrar] Loader setado para false');
      }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.banner}>
            <Image
              source={require('../../assets/form.png')}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.formBox}>
            <Text style={styles.title}>LOGIN</Text>
            <Text style={styles.subtitle}>Entre na sua conta para publicar ou favoritar adoções de gatos</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              textContentType="emailAddress"
              accessibilityLabel="Campo de Email"
              testID="input-email"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Senha"
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={setSenha}
                textContentType="password"
                accessibilityLabel="Campo de Senha"
                testID="input-senha"
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Icon
                  name={mostrarSenha ? 'eye' : 'eye-off'}
                  size={20}
                  color="#666"
                  style={styles.eyeIcon}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, (!email || !senha) && { opacity: 0.6 }]}
              onPress={entrar}
              disabled={!email || !senha || loader}
            >
              {loader ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  LOGIN <Icon name="arrow-right" size={20} color="#fff" />
                </Text>
              )}
            </TouchableOpacity>

            {credenciaisInvalidas && (
              <Text style={styles.invalidFeedback}>
                Verifique seus dados e tente novamente.
              </Text>
            )}

            <View style={styles.signUpText}>
              <Text>
                Sem conta?{' '}
                <Text
                  style={styles.link}
                  onPress={() => navigation.navigate('Cadastrar')}
                >
                  Cadastrar
                </Text>
              </Text>
            </View>

            {error && !credenciaisInvalidas ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Entrar;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  image: {
    width: 120,
    height: 70,
  },
  formBox: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#666',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eyeIcon: {
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  signUpText: {
    alignItems: 'center',
    marginTop: 10,
  },
  link: {
    color: '#4a90e2',
    fontWeight: '600',
  },
  error: {
    marginTop: 10,
    color: 'red',
    fontWeight: '700',
    textAlign: 'center',
  },
  invalidFeedback: {
    color: '#b00020',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
});