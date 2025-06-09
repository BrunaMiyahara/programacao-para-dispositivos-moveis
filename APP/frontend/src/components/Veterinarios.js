import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import Loading from "../components/Loading";

const Veterinarios = () => {
  const [veterinarios, setVeterinarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigation = useNavigation();
  const { usuario } = useContext(AppContext);

  useEffect(() => {
    axios.get(`${process.env.URL_EXPO_API_PUBLICA}/veterinarios`)
      .then(res => {
        setVeterinarios(res.data);
        setCarregando(false);
        console.log("Veterinários recebidos:", res.data); 
      })
      .catch(err => {
        console.error("Erro ao buscar veterinários:", err);
        setCarregando(false);
      });
  }, []);

  if (carregando) return <Loading message="Carregando veterinários..." />;

  const mostrarVeterinarios = veterinarios.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>VETERINARIOS ASSOCIADOS</Text>
      <Text style={styles.subheader}>Conheça nossos profissionais certificados!</Text>
      {mostrarVeterinarios.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 30, color: "#888" }}>
          Nenhum veterinário encontrado.
        </Text>
      ) : (
        mostrarVeterinarios.map((item) => (
          <VeterinarioCard veterinario={item} key={item._id} />
        ))
      )}
      {veterinarios.length > 3 && (
        <TouchableOpacity
          style={styles.verMaisBtn}
          onPress={() => navigation.navigate("Veterinarios")}
        >
          <Text style={styles.verMaisText}>Ver mais</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const VeterinarioCard = ({ veterinario }) => {
  const especializacao = veterinario.especializacao || "Especialização não informada";
  const descricao = veterinario.descricao;
  const celular = veterinario.celular || "Celular não informado";

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image
          source={{ uri: veterinario.fotoUrl || "https://cdn-icons-png.flaticon.com/512/3404/3404932.png" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{veterinario.nome}</Text>
          <Text style={styles.especializacao}>{especializacao}</Text>
        </View>
      </View>
      <Text style={styles.email}>{veterinario.email}</Text>
      <Text style={styles.email}>{celular}</Text>
      {descricao ? (
        <Text style={styles.descricao}>{descricao}</Text>
      ) : null}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Veterinário</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  header: { fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8, },
  subheader: { fontSize: 15, color: "#555", marginBottom: 18, textAlign: "center" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: "#3182ce",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 18,
    alignSelf: "center"
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: "#e0e7ef"
  },
  nome: { fontSize: 18, fontWeight: "bold", color: "#222" },
  especializacao: { fontSize: 15, color: "#3182ce", marginBottom: 2 },
  email: { fontSize: 14, color: "#888", marginBottom: 2, marginLeft: 2 },
  descricao: { fontSize: 14, color: "#444", marginTop: 4 },
  badge: {
    alignSelf: "flex-end",
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8
  },
  badgeText: {
    color: "#3182ce",
    fontWeight: "bold",
    fontSize: 12
  },
  verMaisBtn: {
    backgroundColor: "#3182ce",
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 4,
  },
  verMaisText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  }
});

export default Veterinarios;