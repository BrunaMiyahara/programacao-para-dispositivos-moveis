import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/Feather";



const SobreNos = () => {
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner}>
        <View style={styles.top}>
          <Text style={styles.heading}>SOBRE NÓS</Text>
          <Text style={styles.paragraph}>Todos nossos gatos são de rua, em sua maioria já adultos,</Text>
        </View>
        <Text style={styles.mid}>
          Sem a intenção inicial de nos tornarmos um "abrigo informal de animais", nossa casa foi se enchendo de novos moradores — 
          fossem gatos que acolhíamos após encontrá-los abandonados na rua, ou aqueles que acabavam sendo deixados dentro do nosso muro. 
          Cuidar de tantos animais tem sido um desafio, e, com as despesas cada vez mais altas, decidimos criar este site na 
          esperança de atrair pessoas interessadas em adotar um de nossos bichanos.
        </Text>
        <Text style={styles.paragraph}>
          Mais do que aliviar um pouco nosso fardo,
          queremos que cada um desses gatos encontre alguém que possa dar a devida atenção que eles merecem.
        </Text>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate("Gatos")} 
        >
          <Text style={styles.linkText}>VEJA NOSSOS GATOS </Text>
          <FontAwesome name="arrow-right" size={16} />
        </TouchableOpacity>
      </View>
      <View style={styles.banner}>
        <Image source={require("../../assets/about.png")} style={styles.image} />
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
  top: {
    marginBottom: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
  },
  paragraph: {
    fontSize: 16,
    marginTop: 8,
    lineHeight: 22,
  },
  mid: {
    fontSize: 16,
    marginVertical: 12,
    lineHeight: 22,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  linkText: {
    fontSize: 16,
    color: "#007bff",
    marginRight: 6,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
});

export default SobreNos;
