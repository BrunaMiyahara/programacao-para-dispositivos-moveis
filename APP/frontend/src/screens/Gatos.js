import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import Loading from '../components/Loading';

const { width } = Dimensions.get('window');

// Custom hook para calcular idade detalhada
function useIdadeDetalhada(nascimento) {
  if (nascimento?.indefinido) return { texto: "Idade indefinida", meses: null, anos: null };
  const hoje = new Date();
  const ano = nascimento.ano || hoje.getFullYear();
  const mes = nascimento.mes ? nascimento.mes - 1 : 0;
  const dia = nascimento.dia || 1;
  const nascimentoDate = new Date(ano, mes, dia);

  let anos = hoje.getFullYear() - nascimentoDate.getFullYear();
  let meses = hoje.getMonth() - nascimentoDate.getMonth();
  if (hoje.getDate() < nascimentoDate.getDate()) meses--;

  if (meses < 0) {
    anos--;
    meses += 12;
  }
  const totalMeses = anos * 12 + meses;
  let texto = "";
  if (nascimento?.indefinido) texto = "Idade indefinida";
  else if (totalMeses < 12) texto = "Filhote";
  else if (anos === 0) texto = `${meses} meses`;
  else if (meses === 0) texto = `${anos} ano${anos > 1 ? "s" : ""}`;
  else texto = `${anos} ano${anos > 1 ? "s" : ""} e ${meses} meses`;
  return { texto, meses: totalMeses, anos };
}

// Carrossel com setas
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
          <Text style={styles.setaTexto}>{'<'}</Text>
        </TouchableOpacity>
      )}
      <Image source={{ uri: fotos[fotoAtiva] }} style={styles.image} />
      {fotos.length > 1 && (
        <TouchableOpacity style={styles.setaDireita} onPress={proximaFoto}>
          <Text style={styles.setaTexto}>{'>'}</Text>
        </TouchableOpacity>
      )}
      <View className="dotsContainer" style={styles.dotsContainer}>
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

const Gatos = () => {
  const navigation = useNavigation();
  const { usuario } = useContext(AppContext);
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [idadeFiltro, setIdadeFiltro] = useState('');
  const [corFiltro, setCorFiltro] = useState('');

  const buscarGatos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/gatos`);
      setGatos(res.data);
    } catch (err) {
      setGatos([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarGatos();
    }, [])
  );

  // Filtro por idade (anos, meses ou filhote) e cor
  const gatosFiltrados = gatos.filter(gato => {
    // Filtro de cor
    if (corFiltro && gato.cor_pelo && !gato.cor_pelo.toLowerCase().includes(corFiltro.toLowerCase())) {
      return false;
    }
    // Filtro de idade
    if (!idadeFiltro) return true;

    // Filtro para idade indefinida
    if (idadeFiltro.toLowerCase() === "indefinida") {
      return gato.nascimento?.indefinido === true;
    }

    const idade = useIdadeDetalhada(gato.nascimento);
    if (idadeFiltro.toLowerCase().includes("filhote")) return idade.texto === "Filhote";
    if (idadeFiltro.toLowerCase().includes("mes")) {
      const num = parseInt(idadeFiltro);
      return idade.texto === `${num} meses`;
    }
    if (idadeFiltro.toLowerCase().includes("ano")) {
      const num = parseInt(idadeFiltro);
      return idade.anos === num;
    }
    // Se for só número, filtra por anos
    const num = parseInt(idadeFiltro);
    return idade.anos === num;
  });

  const renderItem = ({ item }) => {
    const idadeDetalhada = useIdadeDetalhada(item.nascimento);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('InformacoesSobreOGatoEspecifico', { id: item._id })}
        activeOpacity={0.85}
      >
        <CarrosselFotos fotos={item.fotos} />
        <View style={styles.infoContainer}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.cor}>{item.cor_pelo || 'Sem cor'}</Text>
          {idadeDetalhada.texto === "Idade indefinida" ? (
            <View style={styles.idadeIndefinidaBox}>
              <Text style={styles.idadeIndefinidaText}>Idade indefinida</Text>
            </View>
          ) : (
            <Text style={styles.idade}>{idadeDetalhada.texto}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Checagem robusta para admin
  const isAdmin = !!usuario && typeof usuario.role === "string" && usuario.role.trim().toLowerCase() === "admin";

  if (loading) {
    return <Loading message="Carregando gatos..." />;
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho fixo */}
      <View style={styles.headerFixed}>
        <Text style={styles.heading}>NOSSOS GATOS</Text>
        <Text style={styles.subheading}>
          Conheça nossos gatinhos disponíveis para adoção!
        </Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CadastrarGato')}
          >
            <Text style={styles.buttonText}>Cadastrar novo gato</Text>
          </TouchableOpacity>
        )}
        <View style={styles.filtroContainer}>
          <Text style={styles.filtroLabel}>Filtrar por idade:</Text>
          <TextInput
            style={styles.filtroInput}
            placeholder="Ex: 2 anos, 6 meses, filhote"
            value={idadeFiltro}
            onChangeText={setIdadeFiltro}
          />
          <TouchableOpacity
            style={[
              styles.filtroIndefinida,
              idadeFiltro.toLowerCase() === "indefinida" && styles.filtroIndefinidaAtiva
            ]}
            onPress={() => setIdadeFiltro(idadeFiltro.toLowerCase() === "indefinida" ? "" : "indefinida")}
          >
            <Text style={{
              color: idadeFiltro.toLowerCase() === "indefinida" ? "#fff" : "#3182ce",
              fontWeight: 'bold'
            }}>
              Idade indefinida
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.filtroContainer}>
          <Text style={styles.filtroLabel}>Filtrar por cor:</Text>
          <TextInput
            style={styles.filtroInput}
            placeholder="Ex: preto, branco, rajado"
            value={corFiltro}
            onChangeText={setCorFiltro}
          />
        </View>
      </View>

      {/* Lista de gatos */}
      <FlatList
        data={gatosFiltrados}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Nenhum gato encontrado.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerFixed: {
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    zIndex: 2,
  },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 6, color: '#222', textAlign: 'center' },
  subheading: { fontSize: 15, color: '#666', marginBottom: 10, textAlign: 'center' },
  button: {
    backgroundColor: '#1aa152',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    minWidth: 180
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
    flexWrap: 'wrap'
  },
  filtroLabel: {
    fontSize: 14,
    color: '#555',
    marginRight: 4
  },
  filtroInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10, 
    width: 170,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
    fontSize: 12, 
    minHeight: 40 
  },
  filtroIndefinida: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 2,
    borderWidth: 1,
    borderColor: '#3182ce'
  },
  filtroIndefinidaAtiva: {
    backgroundColor: '#3182ce',
    borderColor: '#3182ce'
  },
  listContainer: { paddingBottom: 40, paddingTop: 8, paddingHorizontal: 8 },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 0,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    minWidth: width * 0.42,
    maxWidth: width * 0.46,
  },
  carrosselContainer: {
    width: '100%',
    height: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  setaEsquerda: {
    position: 'absolute',
    left: 8,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    elevation: 2
  },
  setaDireita: {
    position: 'absolute',
    right: 8,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    elevation: 2
  },
  setaTexto: {
    fontSize: 22,
    color: '#3182ce',
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    resizeMode: 'cover',
    backgroundColor: '#e2e8f0'
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#fff'
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3182ce',
    marginBottom: 2,
    textAlign: 'center'
  },
  cor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
    textAlign: 'center'
  },
  idade: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center'
  },
  idadeIndefinidaBox: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
    alignSelf: 'center'
  },
  idadeIndefinidaText: {
    color: '#3182ce',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center'
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 6,
    left: 0,
    right: 0
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2
  },
  dotAtivo: {
    backgroundColor: '#3182ce'
  }
});

export default Gatos;