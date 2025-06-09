import { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loading from '../components/Loading';

const { width } = Dimensions.get('window');

const CarrosselFotos = ({ fotos }) => {
  const [fotoAtiva, setFotoAtiva] = useState(0);

  if (!fotos || fotos.length === 0) {
    return (
      <Image source={require('../../assets/sem-foto-gato.png')} style={styles.image} />
    );
  }

  const proximaFoto = () => setFotoAtiva((fotoAtiva + 1) % fotos.length);
  const anteriorFoto = () => setFotoAtiva((fotoAtiva - 1 + fotos.length) % fotos.length);

  return (
    <View style={styles.carrosselContainer}>
      {fotos.length > 1 && (
        <TouchableOpacity style={styles.setaEsquerda} onPress={anteriorFoto}>
          <Text style={styles.setaTexto}>{'<<'}</Text>
        </TouchableOpacity>
      )}
      <Image source={{ uri: fotos[fotoAtiva] }} style={styles.image} />
      {fotos.length > 1 && (
        <TouchableOpacity style={styles.setaDireita} onPress={proximaFoto}>
          <Text style={styles.setaTexto}>{'>>'}</Text>
        </TouchableOpacity>
      )}
      <View style={styles.dotsContainer}>
        {fotos.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              fotoAtiva === idx && styles.dotAtivo
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const InformacoesSobreOGatoEspecifico = ({ route }) => {
  const { id } = route.params;
  const { usuario } = useContext(AppContext);
  const navigation = useNavigation();
  const [gato, setGato] = useState(null);
  const [loading, setLoading] = useState(true);
  const [criador, setCriador] = useState(null);

  useEffect(() => {
    const fetchGato = async () => {
      try {
        const res = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/gatos/${id}`);
        setGato(res.data);

        if (res.data.criadoPor) {
          try {
            const userRes = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/usuarios/${res.data.criadoPor}`);
            setCriador(userRes.data);
          } catch {
            setCriador(null);
          }
        }
      } catch (err) {
        setGato(null);
      } finally {
        setLoading(false);
      }
    };
    fetchGato();
  }, [id]);

  if (loading) {
    return <Loading message="Carregando informações..." />;
  }

  if (!gato) {
    return <Text style={styles.loading}>Gato não encontrado.</Text>;
  }

  const excluirGato = async () => {
    Alert.alert(
      "Excluir gato",
      "Tem certeza que deseja excluir este gato?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${process.env.URL_EXPO_API_PUBLICA}/gatos/${gato._id || gato.id}`, {
                headers: { Authorization: `Bearer ${usuario.token}` }
              });
              Alert.alert("Sucesso", "Gato excluído com sucesso!");
              navigation.goBack();
            } catch (err) {
              Alert.alert("Erro", "Não foi possível excluir o gato.");
            }
          }
        }
      ]
    );
  };

  const editarGato = () => {
    navigation.navigate('EditarInformacoesSobreOGato', { id: gato._id || gato.id });
  };

  const podeEditarOuExcluir = usuario && (usuario.uid === gato.criadoPor || usuario._id === gato.criadoPor);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CarrosselFotos fotos={gato.fotos} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{gato.nome}</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Cor do pelo:</Text>
          <Text style={styles.textInfo}>{gato.cor_pelo || "Não informado"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nascimento:</Text>
          <Text style={styles.textInfo}>
            {gato.nascimento?.indefinida
              ? "Indefinido"
              : `${gato.nascimento?.dia || "--"}/${gato.nascimento?.mes || "--"}/${gato.nascimento?.ano || "--"}`}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>FIV/FELV:</Text>
          <Text style={styles.textInfo}>{gato.fiv_felv || "Não testado"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Vacinado:</Text>
          <Text style={styles.textInfo}>
            {gato.vacinado?.status ? "Sim" : "Não"}
            {gato.vacinado?.tipos && gato.vacinado.tipos.length > 0
              ? ` (${gato.vacinado.tipos.join(", ")})`
              : ""}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Vermifugado:</Text>
          <Text style={styles.textInfo}>{gato.vermifugado ? "Sim" : "Não"}</Text>
        </View>

        <Text style={styles.subtitle}>Contato</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nome:</Text>
          <Text style={styles.textInfo}>{criador?.nome || "Não informado"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.textInfo}>{criador?.email || "Não informado"}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Celular:</Text>
          <Text style={styles.textInfo}>{criador?.celular || "Não informado"}</Text>
        </View>

        {podeEditarOuExcluir && (
          <View style={{ flexDirection: 'row', marginTop: 24, gap: 16, justifyContent: 'center' }}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#3182ce" }]}
              onPress={editarGato}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#b00020" }]}
              onPress={excluirGato}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  container: {
    padding: 0,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    minHeight: '100%',
  },
  carrosselContainer: {
    width: width,
    height: 260,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#e2e8f0',
  },
  setaEsquerda: {
    position: 'absolute',
    left: 16,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2
  },
  setaDireita: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2
  },
  setaTexto: {
    fontSize: 28,
    color: '#3182ce',
    fontWeight: 'bold'
  },
  image: {
    width: width,
    height: 260,
    resizeMode: 'cover',
    backgroundColor: '#e2e8f0'
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 3
  },
  dotAtivo: {
    backgroundColor: '#3182ce'
  },
  infoContainer: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 12,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#3182ce',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
    color: '#222',
    textAlign: 'center'
  },
  label: {
    fontWeight: 'bold',
    color: '#444',
    fontSize: 16,
    marginRight: 6
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#444'
  },
  textInfo: {
    fontSize: 16,
    color: '#555'
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4
  },
  actionButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 2
  }
});

export default InformacoesSobreOGatoEspecifico;