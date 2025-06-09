import { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import Inicio from '../screens/Inicio';
import Gatos from '../screens/Gatos';
import Veterinarios from '../screens/Veterinarios';
import Perfil from '../screens/Perfil';
import Sair from '../screens/Sair';

import AdminStack from '../navigation/AdminStack';
import { AppContext } from '../context/AppContext';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const navigation = useNavigation();
  const { usuario } = useContext(AppContext);

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentContainer}>
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => {
          if (usuario) {
            navigation.navigate('👤 PERFIL');
          } else {
            navigation.navigate('Entrar');
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.profileImageWrapper}>
          <Image
            source={
              usuario && (usuario.imagem || usuario.fotoUrl)
                ? { uri: usuario.imagem || usuario.fotoUrl }
                : require('../../assets/sem-usuario.png')
            }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileText}>
          {usuario ? usuario.nome : 'Entrar / Criar Conta'}
        </Text>
      </TouchableOpacity>

      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  const { usuario } = useContext(AppContext);

  const drawerKey = usuario ? `${usuario.nome}-${usuario.imagem || usuario.fotoUrl || ''}` : 'anonimo';
  const isAdmin = !!usuario && typeof usuario.role === "string" && usuario.role.trim().toLowerCase() === "admin";

  return (
    <Drawer.Navigator
      key={drawerKey}
      initialRouteName="🏠 INÍCIO"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="🏠 INÍCIO" component={Inicio} />
      {usuario && <Drawer.Screen name="👤 PERFIL" component={Perfil} />}
      {isAdmin && (
        <Drawer.Screen
          name="🛠️ ADMIN DASHBOARD"
          component={AdminStack}
          options={{ drawerLabel: "🛠️ PAINEL ADMIN" }}
        />
      )}
      <Drawer.Screen name="🐈 NOSSOS GATOS" component={Gatos} />
      <Drawer.Screen name="👨‍⚕️ VETERINARIOS" component={Veterinarios} />
      {usuario && <Drawer.Screen name="🚪 SAIR" component={Sair} />}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContentContainer: {
    paddingTop: 0,
  },
  profileContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 35,
    flexDirection: 'column',
  },
  profileImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40, 
    resizeMode: 'cover', 
    marginTop: 0,   
  },
  profileText: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DrawerNavigator;
