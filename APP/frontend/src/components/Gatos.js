import { useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";

function calcularIdadeDetalhada(nascimento) {
  if (!nascimento || nascimento.indefinido) return "Idade indefinida";
  const hoje = new Date();
  const ano = nascimento.ano || hoje.getFullYear();
  const mes = nascimento.mes ? nascimento.mes - 1 : 0;
  const dia = nascimento.dia || 1;
  const nascimentoDate = new Date(ano, mes, dia);

  let anos = hoje.getFullYear() - nascimentoDate.getFullYear();
  let meses = hoje.getMonth() - nascimentoDate.getMonth();
  if (hoje.getDate() < nascimentoDate.getDate()) meses--;

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos < 0 || (anos === 0 && meses < 0)) return "Idade indefinida";
  if (anos === 0 && meses === 0) return "Menos de 1 mês";
  if (anos === 0) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  if (meses === 0) return `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return `${anos} ${anos === 1 ? "ano" : "anos"} e ${meses} ${meses === 1 ? "mês" : "meses"}`;
}

const Gatos = () => {
  const navigation = useNavigation();
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarGatos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.URL_EXPO_API_PUBLICA}/gatos`);
      setGatos(res.data);
    } catch (err) {
      setGatos([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarGatos();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headingSection}>
        <Text style={styles.heading}>NOSSOS GATOS</Text>
        <Text style={styles.description}>
          Cada um dos nossos gatos tem sua própria personalidade, mas todos estão prontos para encontrar um lar cheio de amor. Seja tímido ou aventureiro, cada um traz alegria de um jeito único!
        </Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#3182ce" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.cardsContainer}>
          {gatos.slice(0, 8).map((element) => (
            <TouchableOpacity
              key={element._id}
              style={styles.card}
              onPress={() => navigation.navigate("InformacoesSobreOGatoEspecifico", { id: element._id })}
            >
              <Image
                source={
                  element.fotos && element.fotos.length > 0
                    ? { uri: element.fotos[0] }
                    : require('../../assets/sem-foto-gato.png')
                }
                style={styles.image}
              />
              <Text style={styles.title}>{element.nome}</Text>
              <View style={styles.featureButton}>
                <Text style={styles.featureButtonText}>
                  {calcularIdadeDetalhada(element.nascimento)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.verMaisButton}
        onPress={() => navigation.navigate("Gatos")}
      >
        <Text style={styles.verMaisText}>VER MAIS</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  headingSection: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#555",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  featureButton: {
    backgroundColor: "#243887",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  featureButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  verMaisButton: {
    marginTop: 16,
    backgroundColor: "#28a745",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  verMaisText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Gatos;