import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminDashboard from '../screens/AdminDashboard';
import ListaDeUsuarios from '../screens/admin/ListaDeUsuarios';
import ListaDeSolicitacoes from '../screens/admin/ListaDeSolicitacoes';
import ListaDeVeterinarios from '../screens/admin/ListaDeVeterinarios';

const Stack = createNativeStackNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: 10, 
          backgroundColor: '#f9f9f9',
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ListaDeUsuarios"
        component={ListaDeUsuarios}
        options={{ title: '👥 Gerenciar Usuários' }}
      />
      <Stack.Screen
        name="ListaDeSolicitacoes"
        component={ListaDeSolicitacoes}
        options={{ title: '✅ Aprovar Solicitações' }}
      />
      <Stack.Screen
        name="ListaDeVeterinarios"
        component={ListaDeVeterinarios}
        options={{ title: '👨‍⚕️ Gerenciar Veterinários' }}
      />
    </Stack.Navigator>
  );
};

export default AdminStack;