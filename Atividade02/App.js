import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function App() {
  return (
    <ScrollView style={estilos.container}>
      <View style={estilos.bloco}>
        <Image source={require('./assets/img1.png')} style={estilos.imagemPrincipal} />
        <Text style={estilos.titulo}>Jogos de Lógica</Text>
        <Text style={estilos.descricao}>Jogos de lógica ajudam a melhorar o raciocínio lógico e a resolução de problemas.</Text>
      </View>
      <Text style={estilos.subtitulo}>Jogos</Text>
      <View style={estilos.miniBloco}>
        <Image source={require('./assets/img2.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>15Puzzle</Text>
          <Text style={estilos.miniDescricao}>Reorganize as peças para formar a imagem correta.</Text>
        </View>
      </View>
      <View style={estilos.miniBloco}>
        <Image source={require('./assets/img3.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Campo Minado</Text>
          <Text style={estilos.miniDescricao}>Descubra todas as minas sem detoná-las.</Text>
        </View>
      </View>
      <View style={estilos.miniBloco}>
        <Image source={require('./assets/img4.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Kurodoko</Text>
          <Text style={estilos.miniDescricao}>Preencha os quadrados de acordo com as regras.</Text>
        </View>
      </View>
      <View style={estilos.miniBloco}>
        <Image source={require('./assets/img5.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Master Mind</Text>
          <Text style={estilos.miniDescricao}>Adivinhe a sequência de cores correta.</Text>
        </View>
      </View>
      <View style={estilos.miniBloco}>
        <Image source={require('./assets/img6.png')} style={estilos.miniatura} />
        <View style={estilos.containerTexto}>
          <Text style={estilos.miniTitulo}>Outro Jogo</Text>
          <Text style={estilos.miniDescricao}>Uma descrição breve.</Text>
        </View>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginTop: 30,
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
  },
  descricao: {
    fontSize: 16,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
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
  },
  miniDescricao: {
    fontSize: 14,
  },
});