import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const adminActions = [
  {
    label: "GERENCIAR USUÁRIOS",
    emoji: "👥",
    screen: "ListaDeUsuarios",
    color: "#3182ce",
    grad: ["#3182ce", "#6dd5ed"],
  },
  {
    label: "APROVAR SOLICITAÇÕES",
    emoji: "✅",
    screen: "ListaDeSolicitacoes",
    color: "#38b000",
    grad: ["#38b000", "#a8e063"],
  },
  {
    label: "GERENCIAR VETERINÁRIOS",
    emoji: "👨‍⚕️",
    screen: "ListaDeVeterinarios",
    color: "#00b4d8",
    grad: ["#00b4d8", "#48c6ef"],
  },
];

const { width } = Dimensions.get("window");

const AdminDashboard = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Painel do Administrador</Text>
      <Text style={styles.subtitle}>Acesse rapidamente as funções administrativas do sistema:</Text>
      <View style={styles.grid}>
        {adminActions.map((action) => (
          <TouchableOpacity
            key={action.label}
            style={[
              styles.card,
              {
                borderColor: action.color,
                shadowColor: action.color + "99",
                backgroundColor: "#f6fafe",
              },
            ]}
            onPress={() => navigation.navigate(action.screen)}
            activeOpacity={0.85}
          >
            <View
              style={[
                styles.emojiWrapper,
                {
                  backgroundColor: action.grad[0] + "22",
                  borderColor: action.grad[0],
                  shadowColor: action.grad[0] + "55",
                },
              ]}
            >
              <Text style={[styles.emoji, { color: action.grad[0] }]}>{action.emoji}</Text>
            </View>
            <Text style={styles.cardText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#e0e7ef", 
    flexGrow: 1,
    alignItems: "center",
    minHeight: "100%",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "black",
    letterSpacing: 1,
    textShadowColor: "#b8c6ff",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 28,
    textAlign: "center",
    maxWidth: 400,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    backgroundColor: "#f6fafe", 
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    margin: 0,
    width: width > 500 ? 320 : 270, 
    minHeight: 170,
    borderWidth: 2,
    elevation: 7,
    shadowOpacity: 0.16,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    transition: "all 0.2s",
  },
  emojiWrapper: {
    borderRadius: 50,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    elevation: 3,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  emoji: {
    fontSize: 14,
  },
  cardText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.2,
    marginTop: 4,
    textShadowColor: "#f0f4fa",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default AdminDashboard;