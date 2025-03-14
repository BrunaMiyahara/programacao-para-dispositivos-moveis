import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [fontes] = useFonts({
    'Cinzel-ExtraBold': require('./assets/fontes/Cinzel-ExtraBold.ttf'),
    'Imbue_48pt-Medium': require('./assets/fontes/Imbue_48pt-Medium.ttf'),
  });

  if (!fontes) {
    return null; 
  }

  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.bloco}>
        <Image source={require('./assets/img1.png')} style={estilos.imagemPrincipal} />
        <Text style={estilos.titulo}>Jogos de Lógica</Text>
        <Text style={estilos.descricao}>
          Jogos de lógica são uma excelente maneira de estimular o cérebro e melhorar habilidades cognitivas. Eles ajudam a desenvolver o raciocínio lógico, a resolução de problemas e a capacidade de pensar de forma estratégica. Além disso, são uma ótima forma de entretenimento e podem ser jogados por pessoas de todas as idades. Jogar esses jogos regularmente pode trazer benefícios significativos para a saúde mental e bem-estar geral.
        </Text>
      </View>
      <Text style={estilos.subtitulo}>Jogos</Text>
      <TouchableOpacity style={estilos.miniBloco} onPress={() => navigation.navigate('Detalhes', { imagem: require('./assets/img2.png'), titulo: '15Puzzle', descricao: 'Reorganize as peças para formar a imagem correta. Este jogo desafia sua capacidade de resolver problemas e pensar de forma estratégica. É uma ótima maneira de passar o tempo e melhorar suas habilidades cognitivas. Jogar 15Puzzle regularmente pode ajudar a melhorar sua memória e habilidades de planejamento.' })}>
        <Image source={require('./assets/img2.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>15Puzzle</Text>
          <Text style={estilos.miniDescricao}>Reorganize as peças para formar a imagem correta.</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.miniBloco} onPress={() => navigation.navigate('Detalhes', { imagem: require('./assets/img3.png'), titulo: 'Campo Minado', descricao: 'Descubra todas as minas sem detoná-las. Este jogo clássico testa sua capacidade de dedução e raciocínio lógico. É um desafio emocionante que mantém você alerta e engajado enquanto tenta evitar as minas escondidas. Jogar Campo Minado pode ajudar a melhorar suas habilidades de análise e tomada de decisão.' })}>
        <Image source={require('./assets/img3.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Campo Minado</Text>
          <Text style={estilos.miniDescricao}>Descubra todas as minas sem detoná-las.</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.miniBloco} onPress={() => navigation.navigate('Detalhes', { imagem: require('./assets/img4.png'), titulo: 'Kurodoko', descricao: 'Preencha os quadrados de acordo com as regras. Este jogo de lógica desafia você a pensar de forma estratégica e a resolver problemas complexos. É uma ótima maneira de melhorar suas habilidades cognitivas e se divertir ao mesmo tempo. Jogar Kurodoko pode ajudar a melhorar sua concentração e habilidades de resolução de problemas.' })}>
        <Image source={require('./assets/img4.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Kurodoko</Text>
          <Text style={estilos.miniDescricao}>Preencha os quadrados de acordo com as regras.</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.miniBloco} onPress={() => navigation.navigate('Detalhes', { imagem: require('./assets/img5.png'), titulo: 'Master Mind', descricao: 'Adivinhe a sequência de cores correta. Este jogo desafia sua capacidade de dedução e raciocínio lógico. É um desafio emocionante que mantém você alerta e engajado enquanto tenta descobrir a sequência correta. Jogar Master Mind pode ajudar a melhorar suas habilidades de lógica e dedução.' })}>
        <Image source={require('./assets/img5.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Master Mind</Text>
          <Text style={estilos.miniDescricao}>Adivinhe a sequência de cores correta.</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={estilos.miniBloco} onPress={() => navigation.navigate('Detalhes', { imagem: require('./assets/img6.png'), titulo: 'Outro Jogo', descricao: 'Uma descrição breve. Este jogo é uma ótima maneira de passar o tempo e melhorar suas habilidades cognitivas. É um desafio emocionante que mantém você alerta e engajado enquanto tenta resolver os problemas apresentados. Jogar este jogo pode ajudar a melhorar sua criatividade e habilidades de pensamento crítico.' })}>
        <Image source={require('./assets/img6.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Outro Jogo</Text>
          <Text style={estilos.miniDescricao}>Uma descrição breve.</Text>
        </View>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

function DetalhesScreen({ route }) {
  const { imagem, titulo, descricao } = route.params;

  return (
    <View style={estilos.container}>
      <Image source={imagem} style={estilos.imagem} />
      <Text style={estilos.titulo}>{titulo}</Text>
      <Text style={estilos.descricao}>{descricao}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Jogos de Lógica' }} />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} options={{ title: 'Detalhes do Jogo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 0,
  },
  bloco: {
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'white',
    paddingBottom: 10,
    borderRadius: 20,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  imagemPrincipal: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    fontFamily: 'Cinzel-ExtraBold',
  },
  descricao: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Imbue_48pt-Medium',
    padding: 10,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
    fontFamily: 'Cinzel-ExtraBold',
  },
  miniBloco: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.6)',
  },
  miniatura: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  containerTexto: {
    flex: 1,
  },
  miniTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cinzel-ExtraBold',
  },
  miniDescricao: {
    fontSize: 14,
    fontFamily: 'Imbue_48pt-Medium',
  },
  imagem: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
});