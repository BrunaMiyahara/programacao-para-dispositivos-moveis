import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import axios from "axios";
import { auth } from "../config/firebase.init";
import Loading from "../components/Loading";

const SolicitarParaTerCargoDeVeterinario = ({ navigation }) => {
  const { usuario } = useContext(AppContext);
  const [especializacao, setEspecializacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [jaEnviou, setJaEnviou] = useState(false);
  const [statusSolicitacao, setStatusSolicitacao] = useState(null);
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);

  useEffect(() => {
    const verificarSolicitacao = async () => {
      if (!usuario) {
        setCarregandoUsuario(false);
        return;
      }
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/minha-solicitacao`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Resposta da API (minha-solicitacao):", res.data);

        let solicitacao = null;
        if (Array.isArray(res.data.solicitacao)) {
          solicitacao = res.data.solicitacao[res.data.solicitacao.length - 1];
          console.log("Última solicitação do array:", solicitacao);
        } else {
          solicitacao = res.data.solicitacao;
          console.log("Solicitação recebida (objeto):", solicitacao);
        }
        if (solicitacao) {
          setJaEnviou(true);
          setStatusSolicitacao(solicitacao.status);
          console.log("Status da solicitação definida:", solicitacao.status);
        } else {
          setJaEnviou(false);
          setStatusSolicitacao(null);
          console.log("Nenhuma solicitação encontrada.");
        }
      } catch (err) {
        setJaEnviou(false);
        setStatusSolicitacao(null);
        console.log("Erro ao buscar solicitação:", err);
      } finally {
        setCarregandoUsuario(false);
      }
    };
    verificarSolicitacao();
  }, [usuario]);

  const podeEnviarNovamente = jaEnviou && statusSolicitacao === "recusado";

  if (carregandoUsuario) {
    console.log("Carregando dados do usuário...");
    return <Loading message="Carregando dados do usuário..." />;
  }

  if (!usuario) {
    console.log("Usuário não encontrado.");
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Carregando dados do usuário...</Text>
      </View>
    );
  }

  const enviarSolicitacao = async () => {
    if (!especializacao) {
      Alert.alert("Preencha o campo de especialização!");
      return;
    }
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      console.log("Enviando solicitação com dados:", {
        especializacao,
        descricao,
        nome: usuario.nome,
        email: usuario.email
      });

      const res = await axios.post(
        `${process.env.URL_EXPO_API_PUBLICA}/veterinarios/solicitar`,
        {
          especializacao,
          descricao,
          nome: usuario.nome,
          email: usuario.email
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Resposta ao enviar solicitação:", res.data);
      Alert.alert("Solicitação enviada!", "Aguarde a aprovação do administrador.");
      setJaEnviou(true);
      setStatusSolicitacao("pendente");
    } catch (err) {
      console.error("Erro ao enviar solicitação de veterinário:", err.response?.data || err);
      Alert.alert("Erro", err.response?.data?.message || "Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f8fafc" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.header}>Solicitar Cadastro como <Text style={{ color: "#3182ce" }}>Veterinário</Text></Text>
          <Text style={styles.subheader}>
            Preencha os campos abaixo para solicitar seu cadastro como veterinário na plataforma.
          </Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="Nome completo*"
            value={usuario.nome}
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            placeholder="E-mail*"
            value={usuario.email}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Especialização*"
            value={especializacao}
            onChangeText={setEspecializacao}
            editable={!jaEnviou || podeEnviarNovamente}
          />
          <TextInput
            style={[styles.input, styles.inputDescricao]}
            placeholder="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            editable={!jaEnviou || podeEnviarNovamente}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.button,
              (jaEnviou && !podeEnviarNovamente) && { backgroundColor: "#ccc" }
            ]}
            onPress={enviarSolicitacao}
            disabled={loading || (jaEnviou && !podeEnviarNovamente)}
            activeOpacity={0.85}
          >
            {loading ? (
              <Loading message="Enviando solicitação..." color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>
                {(jaEnviou && !podeEnviarNovamente)
                  ? "Solicitação já enviada"
                  : "Enviar Solicitação"}
              </Text>
            )}
          </TouchableOpacity>
          {jaEnviou && (
            <View style={styles.statusBox}>
              <Text style={styles.statusTitle}>Status da solicitação:</Text>
              <Text style={[
                styles.statusText,
                statusSolicitacao === "pendente" && { color: "#e6b800" },
                statusSolicitacao === "aprovado" && { color: "#2ecc40" },
                statusSolicitacao === "recusado" && { color: "#e53e3e" }
              ]}>
                {statusSolicitacao}
              </Text>
              {statusSolicitacao === "pendente" && (
                <Text style={styles.statusMsg}>Aguarde a análise do administrador.</Text>
              )}
              {statusSolicitacao === "aprovado" && (
                <Text style={styles.statusMsg}>Parabéns! Você foi aprovado como veterinário.</Text>
              )}
              {statusSolicitacao === "recusado" && (
                <Text style={styles.statusMsg}>Sua solicitação foi recusada. Você pode enviar uma nova solicitação.</Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc"
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#222"
  },
  subheader: {
    fontSize: 15,
    color: "#555",
    marginBottom: 18,
    textAlign: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9"
  },
  inputDisabled: {
    backgroundColor: "#eee",
    color: "#888"
  },
  inputDescricao: {
    height: 80,
    textAlignVertical: "top"
  },
  button: {
    backgroundColor: "#3182ce",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  statusBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    marginTop: 18,
    alignItems: "center"
  },
  statusTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 2,
    color: "#222"
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    textTransform: "capitalize"
  },
  statusMsg: {
    fontSize: 14,
    color: "#555",
    textAlign: "center"
  }
});

export default SolicitarParaTerCargoDeVeterinario;