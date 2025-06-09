import { View, Text, Linking, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Rodape = () => {
  const handleWhatsappPress = () => {
    const url = "https://wa.me/55912345678?text=Olá!%20Gostaria%20de%20saber%20mais%20informações.";
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.banner}>
        <Text style={styles.left}>GATOS.O.S.</Text>
        <View style={styles.right}>
          <Text>Se preferir, nos chame pelo:</Text>
          <TouchableOpacity onPress={handleWhatsappPress} style={styles.whatsappLink}>
            <Text style={styles.whatsappText}>WhatsApp </Text>
            <FontAwesome name="whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.banner}>
        <Text style={styles.left}>
          CODEWITHZEESHU - GreatStack - Md Al Mamun - Tahmid Ahmed
        </Text>
        <Text style={styles.right}>Desenvolvido através da combinação de 4 vídeos.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  banner: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  left: {
    flex: 1,
    fontWeight: "bold",
  },
  right: {
    flex: 1,
    textAlign: "right",
  },
  whatsappLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsappText: {
    color: "#25D366",
    fontWeight: "bold",
  },
});

export default Rodape;
