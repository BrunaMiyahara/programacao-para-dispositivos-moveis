import { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";

export default function ListaDeSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useContext(AppContext);

  const fetchSolicitacoes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/solicitacoes`,
        {
          headers: {
            Authorization: `Bearer ${usuario?.token}`
          }
        }
      );
      const ordenadas = res.data.sort(
        (a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio)
      );
      setSolicitacoes(ordenadas);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar as solicitações.");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const aprovar = async (id) => {
    Alert.alert("Aprovar solicitação", "Tem certeza que deseja aprovar este usuário como veterinário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Aprovar",
        style: "default",
        onPress: async () => {
          try {
            setLoading(true);
            await axios.post(
              `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/aprovar/${id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${usuario?.token}`
                }
              }
            );
            Alert.alert("Sucesso", "Solicitação aprovada com sucesso!");
            fetchSolicitacoes();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível aprovar.");
            console.log(e.response?.data);
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const recusar = async (id) => {
    Alert.alert("Recusar solicitação", "Tem certeza que deseja recusar esta solicitação?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Recusar",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await axios.post(
              `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/recusar/${id}`,
              {},
              {
                headers: {
                  Authorization: `Bearer ${usuario?.token}`
                }
              }
            );
            Alert.alert("Sucesso", "Solicitação reprovada com sucesso!");
            fetchSolicitacoes();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível recusar.");
            console.log(e.response?.data);
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const isAdmin = !!usuario && typeof usuario.role === "string" && usuario.role.trim().toLowerCase() === "admin";

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nome}>{item.nome || "Usuário desconhecido"}</Text>
      <Text style={styles.email}>{item.email || "Sem email"}</Text>
      <Text style={styles.status}>
        Status:{" "}
        <Text
          style={{
            color:
              item.status === "aprovado"
                ? "#38b000"
                : item.status === "recusado"
                ? "#e53e3e"
                : "#888",
            fontWeight: "bold",
          }}
        >
          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : "Não informado"}
        </Text>
      </Text>
      <Text style={styles.infoExtra}>ID da Solicitação: {item._id}</Text>
      <Text style={styles.infoExtra}>
        ID do Usuário: {item.usuario?._id || item.usuario || "Não informado"}
      </Text>
      <Text style={styles.infoExtra}>Especialização: {item.especializacao || "Não informado"}</Text>
      <Text style={styles.infoExtra}>Descrição: {item.descricao || "Não informado"}</Text>
      <Text style={styles.infoExtra}>
        Data de Envio: {item.dataEnvio ? new Date(item.dataEnvio).toLocaleString() : "Não informado"}
      </Text>
      {isAdmin && item.status === "pendente" && (
        <View style={styles.botoes}>
          <TouchableOpacity style={styles.btnAprovar} onPress={() => aprovar(item._id)}>
            <Text style={styles.btnAprovarText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnRecusar} onPress={() => recusar(item._id)}>
            <Text style={styles.btnRecusarText}>Recusar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return <Loading message="Carregando solicitações..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Solicitações</Text>
      <FlatList
        data={solicitacoes}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            Nenhuma solicitação encontrada.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#f8fafc" },
  titulo: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 18,
    textAlign: "center",
    color: "#3182ce",
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  nome: { fontWeight: "bold", fontSize: 17, color: "#222" },
  email: { color: "#555", marginBottom: 2, fontSize: 14 },
  status: { color: "#666", fontSize: 14, marginBottom: 2 },
  role: { color: "#3182ce", fontWeight: "bold", fontSize: 13, marginBottom: 8 },
  botoes: { flexDirection: "row", gap: 10, marginTop: 6 },
  infoExtra: {
    color: "#444",
    fontSize: 13,
    marginBottom: 2,
  },
  btnAprovar: {
    backgroundColor: "#38b000",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: "center",
  },
  btnAprovarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  btnRecusar: {
    backgroundColor: "#e53e3e",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
    alignItems: "center",
  },
  btnRecusarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});