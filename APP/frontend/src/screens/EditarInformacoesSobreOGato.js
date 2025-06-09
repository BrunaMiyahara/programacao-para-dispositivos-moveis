import { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { getAuth } from "firebase/auth";
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';

const opcoesFivFelv = [
  "Ambos positivos",
  "Fiv+/Felv-",
  "Fiv-/Felv+",
  "Ambos negativos",
  "Não testado"
];

const opcoesVacinas = ["V3", "V4", "V5", "raiva"];

const EditarInformacoesSobreOGato = ({ route, navigation }) => {
  const { id } = route.params;
  const [nome, setNome] = useState('');
  const [corPelo, setCorPelo] = useState('');
  const [fotos, setFotos] = useState([]);
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [indefinido, setIndefinido] = useState(false);
  const [fivFelv, setFivFelv] = useState("Não testado");
  const [vacinado, setVacinado] = useState(false);
  const [vacinas, setVacinas] = useState([]);
  const [vermifugado, setVermifugado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { usuario } = useContext(AppContext);

  useEffect(() => {
    const fetchGato = async () => {
      try {
        const res = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/gatos/${id}`);
        const gato = res.data;
        setNome(gato.nome || "");
        setCorPelo(gato.cor_pelo || "");
        setFotos(Array.isArray(gato.fotos) ? gato.fotos : []);
        setFivFelv(gato.fiv_felv || "Não testado");
        setVermifugado(!!gato.vermifugado);
        setVacinado(gato.vacinado?.status || false);
        setVacinas(Array.isArray(gato.vacinado?.tipos) ? gato.vacinado.tipos : []);
        if (gato.nascimento?.indefinido) {
          setIndefinido(true);
          setDia('');
          setMes('');
          setAno('');
        } else {
          setIndefinido(false);
          setDia(gato.nascimento?.dia !== null && gato.nascimento?.dia !== undefined ? String(gato.nascimento.dia) : "");
          setMes(gato.nascimento?.mes !== null && gato.nascimento?.mes !== undefined ? String(gato.nascimento.mes) : "");
          setAno(gato.nascimento?.ano !== null && gato.nascimento?.ano !== undefined ? String(gato.nascimento.ano) : "");
        }
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados do gato.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    fetchGato();
  }, [id]);

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: 5
    });

    if (!result.canceled) {
      const novasFotos = result.assets ? result.assets.map(a => a.uri) : [result.uri];
      setFotos([...fotos, ...novasFotos]);
    }
  };

  const removerFoto = (idx) => {
    setFotos(fotos.filter((_, i) => i !== idx));
  };

  const handleSalvar = async () => {
    try {
      setIsSaving(true);

      const nascimento = indefinido
        ? { indefinido: true }
        : { dia: dia ? Number(dia) : null, mes: mes ? Number(mes) : null, ano: ano ? Number(ano) : null, indefinido: false };

      const user = getAuth().currentUser;
      if (!user || !usuario || !usuario._id) {
        Alert.alert('Erro', 'Você precisa estar logado para editar um gato.');
        setIsSaving(false);
        return;
      }
      const token = await user.getIdToken(true);

      const payload = {
        nome: nome || "Sem nome",
        nascimento,
        cor_pelo: corPelo,
        fotos,
        fiv_felv: fivFelv,
        vacinado: { status: vacinado, tipos: vacinas },
        vermifugado
      };

      await axios.put(
        `${process.env.URL_EXPO_API_PUBLICA}/gatos/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso!');
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
      if (error.response) {
        console.log('Erro response data:', error.response.data);
        console.log('Erro response status:', error.response.status);
        console.log('Erro response headers:', error.response.headers);
      } else if (error.request) {
        console.log('Erro request:', error.request);
      } else {
        console.log('Erro mensagem:', error.message);
      }
      console.error('Erro completo:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || isSaving) {
    return <Loading message="Carregando informações..." />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Gato</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor do pelo"
        value={corPelo}
        onChangeText={setCorPelo}
      />

      <Text style={styles.label}>Fotos</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
        {fotos.map((foto, idx) => (
          <View key={idx} style={{ position: 'relative', marginRight: 8, marginBottom: 8 }}>
            <Image
              source={{ uri: foto }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
            <TouchableOpacity
              onPress={() => removerFoto(idx)}
              style={{
                position: 'absolute',
                top: -8,
                right: -8,
                backgroundColor: '#fff',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#3182ce',
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              <Text style={{ color: '#3182ce', fontWeight: 'bold', fontSize: 14 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addPhoto} onPress={pickImages}>
          <Text style={{ fontSize: 32, color: '#3182ce' }}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Data de nascimento</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Dia"
          value={dia}
          onChangeText={setDia}
          keyboardType="numeric"
          editable={!indefinido}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Mês"
          value={mes}
          onChangeText={setMes}
          keyboardType="numeric"
          editable={!indefinido}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Ano"
          value={ano}
          onChangeText={setAno}
          keyboardType="numeric"
          editable={!indefinido}
        />
        <TouchableOpacity
          onPress={() => {
            if (!indefinido) {
              setDia('');
              setMes('');
              setAno('');
            }
            setIndefinido(!indefinido);
          }}
          style={styles.checkbox}
        >
          <Text>{indefinido ? '☑' : '☐'} Indefinido</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Testado para Fiv/Felv</Text>
      <Picker
        selectedValue={fivFelv}
        onValueChange={setFivFelv}
        style={styles.input}
      >
        {opcoesFivFelv.map(opcao => (
          <Picker.Item key={opcao} label={opcao} value={opcao} />
        ))}
      </Picker>

      <Text style={styles.label}>Vacinado?</Text>
      <TouchableOpacity onPress={() => setVacinado(!vacinado)} style={styles.checkbox}>
        <Text>{vacinado ? '☑' : '☐'} Sim</Text>
      </TouchableOpacity>
      {vacinado && (
        <View>
          <Text style={styles.label}>Vacinas:</Text>
          {opcoesVacinas.map(vacina => (
            <TouchableOpacity
              key={vacina}
              onPress={() => setVacinas(vacinas.includes(vacina)
                ? vacinas.filter(v => v !== vacina)
                : [...vacinas, vacina])}
              style={styles.checkbox}
            >
              <Text>{vacinas.includes(vacina) ? '☑' : '☐'} {vacina}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.label}>Vermifugado?</Text>
      <TouchableOpacity onPress={() => setVermifugado(!vermifugado)} style={styles.checkbox}>
        <Text>{vermifugado ? '☑' : '☐'} Sim</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={isSaving}>
        <Text style={styles.buttonText}>Salvar alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  label: { marginTop: 12, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginVertical: 6 },
  button: { backgroundColor: '#3182ce', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  checkbox: { marginVertical: 4 },
  addPhoto: { width: 60, height: 60, borderWidth: 1, borderColor: '#3182ce', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }
});

export default EditarInformacoesSobreOGato;