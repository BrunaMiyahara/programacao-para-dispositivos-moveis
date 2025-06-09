import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { data } from "../restApi.json";

const imagens = {
  "membro_grupo_1.png": require("../../assets/membro_grupo_1.png"),
  "membro_grupo_2.png": require("../../assets/membro_grupo_2.png"),
  "membro_grupo_3.png": require("../../assets/membro_grupo_3.png"),
  "membro_grupo_4.png": require("../../assets/membro_grupo_4.png"),
};

const Time = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headingSection}>
        <Text style={styles.heading}>NOSSO TIME</Text>
        <Text style={styles.paragraph}>
          Cada membro contribuiu com suas habilidades para desenvolver uma experiência de usuário funcional,
          garantindo a integração eficiente de componentes e o cumprimento dos requisitos da Construção de Frontend.
        </Text>
      </View>
      <View style={styles.timeContainer}>
        {data[0].time.map((element) => (
          <View style={styles.card} key={element.id}>
            <Image source={imagens[element.image]} style={styles.image} />
            <Text style={styles.name}>{element.name}</Text>
            <Text style={styles.designation}>{element.designation}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headingSection: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontWeight: "bold",
    fontSize: 18,
  },
  designation: {
    fontSize: 14,
    color: "#666",
  },
});

export default Time;