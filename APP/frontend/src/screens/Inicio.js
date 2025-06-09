import { ScrollView, SafeAreaView } from 'react-native';

import Banner from '../components/Banner';
import SobreNos from '../components/SobreNos';
import Informacoes from '../components/Informacoes';
import Gatos from '../components/Gatos';
import Curiosidades from '../components/Curiosidades';
import Time from '../components/Time';
import Rodape from '../components/Rodape';
import Veterinarios from '../components/Veterinarios';

const PaginaInicial = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Banner />
        <SobreNos />
        <Informacoes />
        <Gatos />
        <Veterinarios />
        <Curiosidades />
        <Time />
        <Rodape />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaginaInicial;
