import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import Loading from "../../components/Loading";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaDeUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), 1700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/usuarios`);
      setUsuarios(res.data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os usuários.");
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(u => {
    if (!busca.trim()) return true;
    const termo = busca.trim().toLowerCase();
    return (
      (u.email && u.email.toLowerCase().includes(termo)) ||
      (u.nome && u.nome.toLowerCase().includes(termo)) ||
      (u._id && u._id.toLowerCase().includes(termo))
    );
  });

  const removerUsuario = async (id) => {
    Alert.alert("Remover", "Deseja remover este usuário?", [
      { text: "Cancelar" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Erro", "Token não encontrado. Faça login novamente.");
              return;
            }

            await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/usuarios/remover/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            fetchUsuarios();
          } catch (e) {
            Alert.alert("Erro", "Não foi possível remover o usuário.");
            console.error("Erro ao remover usuário:", e);
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.usuarioItem}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>
          {item.nome ? item.nome[0].toUpperCase() : "?"}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.usuarioNome}>{item.nome}</Text>
        <Text style={styles.usuarioEmail}>{item.email}</Text>
        <Text style={styles.usuarioId}>ID: {item._id}</Text>
        <Text style={styles.usuarioRole}>
          {item.role ? `Perfil: ${item.role.charAt(0).toUpperCase() + item.role.slice(1)}` : "Perfil: Usuário"}
        </Text>
      </View>
      <TouchableOpacity onPress={() => removerUsuario(item._id)} style={styles.removerBtn}>
        <Text style={styles.removerBtnText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  if (showLoading || loading) {
    return <Loading message="Carregando usuários..." />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Usuários</Text>
      <TextInput
        placeholder="Buscar por nome, email ou ID"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="default"
        placeholderTextColor="#aaa"
      />
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            Nenhum usuário encontrado.
          </Text>
        }
        style={{ marginTop: 10 }}
      />
      <TouchableOpacity onPress={fetchUsuarios} style={styles.mostrarTodosBtn}>
        <Text style={styles.mostrarTodosBtnText}>Mostrar Todos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18, backgroundColor: "#f8fafc" },
  titulo: {
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 18,
    textAlign: "center",
    color: "#3182ce",
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3182ce",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#222"
  },
  usuarioItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    padding: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3182ce",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  usuarioNome: { fontWeight: "bold", fontSize: 17, color: "#222" },
  usuarioEmail: { color: "#555", marginBottom: 2, fontSize: 14 },
  usuarioId: { color: "#aaa", fontSize: 12, marginBottom: 2 },
  usuarioRole: {
    color: "#3182ce",
    fontWeight: "bold",
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  removerBtn: {
    backgroundColor: "#e53e3e",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  removerBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  mostrarTodosBtn: {
    backgroundColor: "#e2e8f0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  mostrarTodosBtnText: {
    color: "#222",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});