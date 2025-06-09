import { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/Loading";

export default function ListaDeVeterinarios() {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useContext(AppContext);

  const isAdmin =
    !!usuario &&
    typeof usuario.role === "string" &&
    usuario.role.trim().toLowerCase() === "admin";

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    setLoading(true);
    try {
      const user = getAuth().currentUser;
      const token = user && (await user.getIdToken(true));
      const res = await axios.get(
        `${process.env.URL_EXPO_API_PUBLICA}/veterinarios`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVets(res.data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os veterinários.");
    } finally {
      setLoading(false);
    }
  };

  const removerVeterinario = async (uid, nome) => {
    if (!isAdmin) {
      Alert.alert("Acesso negado", "Você precisa ser administrador para remover veterinários.");
      return;
    }
    Alert.alert(
      "Remover Veterinário",
      `Tem certeza que deseja remover ${nome} da equipe de veterinários?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const user = getAuth().currentUser;
              const token = user && (await user.getIdToken(true));
              await axios.put(
                `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/remover/${uid}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              Alert.alert("Sucesso", "Veterinário removido e solicitação marcada como recusada.");
              fetchVets();
            } catch (e) {
              if (e?.response?.status === 403) {
                Alert.alert("Acesso negado", "Você precisa ser administrador para remover veterinários.");
              } else {
                Alert.alert("Erro", "Não foi possível remover o veterinário.");
              }
              console.error("Erro ao remover veterinário:", e);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image
          source={{ uri: item.fotoUrl || "https://cdn-icons-png.flaticon.com/512/3404/3404932.png" }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.nome}>{item.nome}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => removerVeterinario(item.uid, item.nome)}
          >
            <Text style={styles.removeBtnText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.label}>
        <Text style={styles.labelTitle}>Especialização: </Text>
        <Text style={styles.value}>{item.especializacao || "Não informada"}</Text>
      </Text>
      <Text style={styles.label}>
        <Text style={styles.labelTitle}>Celular: </Text>
        <Text style={styles.value}>{item.celular || "Não informado"}</Text>
      </Text>
      {item.descricao ? (
        <Text style={styles.label}>
          <Text style={styles.labelTitle}>Descrição: </Text>
          <Text style={styles.value}>{item.descricao}</Text>
        </Text>
      ) : null}
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Veterinário</Text>
      </View>
    </View>
  );

  if (loading) {
    return <Loading message="Carregando veterinários..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Veterinários Cadastrados</Text>
      <FlatList
        data={vets}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            Nenhum veterinário encontrado.
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: "#e0e7ef"
  },
  nome: { fontWeight: "bold", fontSize: 18, color: "#222" },
  email: { color: "#555", fontSize: 14, marginBottom: 2 },
  label: { color: "#666", fontSize: 14, marginBottom: 2 },
  labelTitle: { fontWeight: "bold", color: "#3182ce" },
  value: { color: "#222", fontWeight: "bold" },
  statusBadge: {
    alignSelf: "flex-end",
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 10
  },
  statusText: {
    color: "#3182ce",
    fontWeight: "bold",
    fontSize: 13
  },
  removeBtn: {
    backgroundColor: "#e53e3e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8
  },
  removeBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13
  }
});