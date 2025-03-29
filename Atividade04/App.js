import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Switch, Button } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { debounce } from 'lodash';

const Stack = createStackNavigator();

const imagens = {
  img1: require('./assets/img1.png'),
  img2: require('./assets/img2.png'),
  img3: require('./assets/img3.png'),
  img4: require('./assets/img4.png'),
  img5: require('./assets/img5.png'),
  img6: require('./assets/img6.png'),
};

function HomeScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    'Cinzel-ExtraBold': require('./assets/fontes/Cinzel-ExtraBold.ttf'),
    'Imbue-Medium': require('./assets/fontes/Imbue_48pt-Medium.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={imagens.img1} style={styles.headerImage} />
        <Text style={styles.title}>Jogos de Lógica</Text>
        <Text style={styles.description}>
          Melhore suas habilidades cognitivas com desafios lógicos envolventes!
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Jogos</Text>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <TouchableOpacity
          key={num}
          style={styles.miniBloco}
          onPress={() => navigation.navigate('Detalhes', {
            imagem: imagens[`img${num}`],
            titulo: `Jogo ${num}`,
            descricao: `Descrição do jogo ${num}`,
          })}
        >
          <Image source={imagens[`img${num}`]} style={styles.miniatura} />
          <View style={styles.containerTexto}>
            <Text style={styles.miniTitulo}>Jogo {num}</Text>
            <Text style={styles.miniDescricao}>Descrição breve do jogo {num}.</Text>
          </View>
        </TouchableOpacity>
      ))}
      <StatusBar style="auto" />
    </ScrollView>
  );
}

function DetalhesScreen({ route }) {
  const { imagem, titulo, descricao } = route.params;
  const [inputValues, setInputValues] = useState({ text1: '', text2: '', text3: '', text4: '' });
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(false);
  const [slider1Value, setSlider1Value] = useState(0);
  const [slider2Value, setSlider2Value] = useState(0);
  const [picker1Value, setPicker1Value] = useState('option1');
  const [picker2Value, setPicker2Value] = useState('optionA');

  const handleInputChange = (name, value) => {
    setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = () => {
    alert('Form Submitted!');
  };

  const debouncedSlider1Change = useCallback(debounce((value) => {
    setSlider1Value(value);
  }, 50), []);

  const debouncedSlider2Change = useCallback(debounce((value) => {
    setSlider2Value(value);
  }, 50), []);

  return (
    <ScrollView style={styles.container}>
      <Image source={imagem} style={styles.imagem} />
      <Text style={styles.title}>{titulo}</Text>
      <Text style={styles.description}>{descricao}</Text>

      {['text1', 'text2', 'text3', 'text4'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={`Digite algo para ${field}`}
          value={inputValues[field]}
          onChangeText={(text) => handleInputChange(field, text)}
        />
      ))}

      <Picker
        selectedValue={picker1Value}
        style={styles.picker}
        onValueChange={(itemValue) => setPicker1Value(itemValue)}
      >
        <Picker.Item label="Opção 1" value="option1" />
        <Picker.Item label="Opção 2" value="option2" />
        <Picker.Item label="Opção 3" value="option3" />
      </Picker>

      <Picker
        selectedValue={picker2Value}
        style={styles.picker}
        onValueChange={(itemValue) => setPicker2Value(itemValue)}
      >
        <Picker.Item label="Opção A" value="optionA" />
        <Picker.Item label="Opção B" value="optionB" />
        <Picker.Item label="Opção C" value="optionC" />
      </Picker>

      <Text>Slider 1: {slider1Value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={slider1Value}
        onValueChange={debouncedSlider1Change}
      />
      
      <Text>Slider 2: {slider2Value}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={slider2Value}
        onValueChange={debouncedSlider2Change}
      />

      <View style={styles.switchContainer}>
        <Text>Ativar opção 1</Text>
        <Switch value={switch1} onValueChange={setSwitch1} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Ativar opção 2</Text>
        <Switch value={switch2} onValueChange={setSwitch2} />
      </View>

      <View style={styles.button}>
        <Button title="Submeter" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={() => alert('Cancelado!')} />
      </View>
      
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Jogos de Lógica' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do Jogo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 20 },
  headerContainer: { alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 15 },
  headerImage: { width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover' },
  title: { fontSize: 26, fontFamily: 'Cinzel-ExtraBold', marginTop: 10 },
  description: { fontSize: 16, fontFamily: 'Imbue-Medium', textAlign: 'center', padding: 10 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 15, fontFamily: 'Cinzel-ExtraBold' },
  miniBloco: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, backgroundColor: 'white', padding: 10, borderRadius: 10 },
  miniatura: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  containerTexto: { flex: 1 },
  miniTitulo: { fontSize: 18, fontWeight: 'bold', fontFamily: 'Cinzel-ExtraBold' },
  miniDescricao: { fontSize: 14, fontFamily: 'Imbue-Medium' },
  imagem: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 10, marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10, paddingLeft: 10 },
  picker: { height: 60, width: '100%', marginVertical: 10},
  slider: { width: '100%', height: 40, marginVertical: 10 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  button: {marginBottom: 40, flexDirection: 'row', justifyContent: 'space-between' },
});