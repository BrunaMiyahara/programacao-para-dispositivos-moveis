import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { data } from "../restApi.json";

const imagens = {
  "informacao1.png": require("../../assets/informacao1.png"),
  "informacao2.png": require("../../assets/informacao2.png"),
  "informacao3.png": require("../../assets/informacao3.png"),
};

const Informacoes = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {data[0].gatoInfo.map((element) => (
        <View style={styles.card} key={element.id}>
          <Image
            source={imagens[element.imagem]}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.title}>{element.titulo}</Text>
          <Text style={styles.description}>{element.descricao}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    textAlign: "center",
    color: "#555",
  },
});

export default Informacoes;