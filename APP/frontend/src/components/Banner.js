import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const Banner = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <View style={styles.largeBox}>
          <Text style={styles.title}>Encontre</Text>
        </View>
        <View style={styles.combinedBoxes}>
          <View style={styles.imageBox}>
            <Image source={require("../../assets/banner1.png")} style={styles.image} />
          </View>
          <View style={styles.textAndLogo}>
            <View style={styles.textWithSvg}>
              <Text style={styles.title}>Abrace</Text>
              <Text style={[styles.title, styles.subtitle]}>Ame</Text>
              <Image source={require("../../assets/linhas.png")} style={styles.svgImage} />
            </View>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
          </View>
        </View>
      </View>
      <View style={styles.banner}>
        <View style={styles.imageBox}>
          <Image source={require("../../assets/banner2.png")} style={styles.image} />
        </View>
        <Text style={[styles.title, styles.subtitle]}>Adote</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  banner: {
    marginBottom: 24,
  },
  largeBox: {
    marginBottom: 5,
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#f44336",
  },
  combinedBoxes: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageBox: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
  },
  textAndLogo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textWithSvg: {
    alignItems: "center",
  },
  svgImage: {
    width: 50,
    height: 15,
    resizeMode: "contain",
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: "contain",
  },
});

export default Banner;
