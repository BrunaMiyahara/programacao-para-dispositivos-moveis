import { StyleSheet, Image, View, Text, ScrollView } from 'react-native';
import { useFonts } from 'expo-font';
import image1 from './assets/image1.png';
import image2 from './assets/image2.png';

export default function App() {
  const [fontes] = useFonts({
    'Cinzel-ExtraBold': require('./assets/fontes/Cinzel-ExtraBold.ttf'),
    'Imbue_48pt-Medium': require('./assets/fontes/Imbue_48pt-Medium.ttf'),
  });

  if (!fontes) {
    return null; 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Objeto</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Image source={image1} style={styles.image} />
          <Text style={styles.text}>VW - Fusca</Text>
          <Text style={styles.text}>Ano: 1978</Text>
          <Text style={styles.text}>Cor: Preto</Text>
        </View>
        <View style={styles.card}>
          <Image source={image2} style={styles.image} />
          <Text style={styles.text}>VW - Gol</Text>
          <Text style={styles.text}>Ano: 2010</Text>
          <Text style={styles.text}>Cor: Vermelho</Text>
        </View>
        <View style={styles.card}>
          <Image source={image1} style={styles.image} />
          <Text style={styles.text}>VW - Fusca</Text>
          <Text style={styles.text}>Ano: 1978</Text>
          <Text style={styles.text}>Cor: Preto</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    paddingTop: 0,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 10,
  },
  card: {
    paddingBottom: 15,
    marginBottom: 15,
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: -1, height: 1 },
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: '#edebed',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  titulo: {
    backgroundColor: '#fff',
    textAlign: 'left',
    padding: 15,
    fontSize: 14,
    fontWeight: '500',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 5,
    fontFamily: 'Cinzel-ExtraBold',
  },
  text: {
    marginLeft: 15,
    fontSize: 10,
    fontFamily: 'Imbue_48pt-Medium',
  },
});