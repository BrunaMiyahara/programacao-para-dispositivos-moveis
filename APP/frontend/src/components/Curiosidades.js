import { useContext } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { AppContext } from "../context/AppContext";

const Curiosidades = () => {
  const { data } = useContext(AppContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textBanner}>
        {data[0].curiosidades.slice(0, 2).map((element) => (
          <View style={styles.card} key={element.id}>
            <Text style={[styles.heading, { fontWeight: "300" }]}>{element.number}</Text>
            <Text>{element.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.imageBanner}>
        <Image source={require("../../assets/center.png")} style={styles.gradientBg} />
        <Image source={require("../../assets/curiosidades.jpg")} style={styles.mainImage} />
      </View>

      <View style={styles.textBanner}>
        {data[0].curiosidades.slice(2).map((element) => (
          <View style={styles.card} key={element.id}>
            <Text style={[styles.heading, { fontWeight: "300" }]}>{element.number}</Text>
            <Text>{element.title}</Text>
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
  textBanner: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  card: {
    alignItems: "center",
    width: "40%",
  },
  heading: {
    fontSize: 28,
  },
  imageBanner: {
    alignItems: "center",
    marginBottom: 24,
  },
  gradientBg: {
    position: "absolute",
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
  mainImage: {
    width: 300,
    height: 200,
    resizeMode: "contain",
  },
});

export default Curiosidades;
