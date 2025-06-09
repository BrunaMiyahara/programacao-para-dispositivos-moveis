import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContextProvider from './src/context/AppContext';
import AuthProvider from './src/utilities/providers/AuthProvider';
import Toast from 'react-native-toast-message';

// TELAS E COMPONENTES
import DrawerNavigator from './src/navigation/DrawerNavigator';
import Entrar from './src/screens/Entrar';
import Cadastrar from './src/screens/Cadastrar';
import Gatos from './src/screens/Gatos';
import InformacoesSobreOGatoEspecifico from './src/screens/InformacoesSobreOGatoEspecifico';
import EditarInformacoesSobreOGato from './src/screens/EditarInformacoesSobreOGato';
import Inicio from './src/screens/Inicio';
import Perfil from './src/screens/Perfil';
import CadastrarGato from '../frontend/src/screens/CadastrarGato';
import SolicitarParaTerCargoDeVeterinario from './src/screens/SolicitarParaTerCargoDeVeterinario';
import AdminDashboard from './src/screens/AdminDashboard';

// ADMIN DASHBOARD
import ListaDeUsuarios from './src/screens/admin/ListaDeUsuarios';
import ListaDeSolicitacoes from './src/screens/admin/ListaDeSolicitacoes';   
import ListaDeVeterinarios from './src/screens/admin/ListaDeVeterinarios';


const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContextProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Main">
              <Stack.Screen
                name="Main"
                component={DrawerNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Perfil" component={Perfil} />
              <Stack.Screen name="Entrar" component={Entrar} />
              <Stack.Screen name="Cadastrar" component={Cadastrar} />
              <Stack.Screen name="Inicio" component={Inicio} />
              <Stack.Screen name="CadastrarGato" component={CadastrarGato} />
              <Stack.Screen name='Gatos' component={Gatos} />
              <Stack.Screen name="InformacoesSobreOGatoEspecifico" component={InformacoesSobreOGatoEspecifico} />
              <Stack.Screen name="EditarInformacoesSobreOGato" component={EditarInformacoesSobreOGato} />
              <Stack.Screen name="SolicitarParaTerCargoDeVeterinario" component={SolicitarParaTerCargoDeVeterinario} />
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen name="ListaDeUsuarios" component={ListaDeUsuarios} />
              <Stack.Screen name="ListaDeSolicitacoes" component={ListaDeSolicitacoes} />
              <Stack.Screen name="ListaDeVeterinarios" component={ListaDeVeterinarios} />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </AppContextProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
