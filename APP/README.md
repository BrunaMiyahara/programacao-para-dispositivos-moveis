Adaptei um projeto de React + Vite da matéria passada, Contrução de Frontend, para um aplicativo mobile React Native com Firebase Authentication (\frontend). MongoDB Atlas para armazenar e recuperar os dados (\backend).

Para funcionar corretamente o servidor (computador - VsCode) e o app (celular - Expo Go) precisam estar rodando na mesma rede Wi-Fi.

BACKEND:

  Adicione uma pasta chamada "config";
  dentro dessa pasta um arquivo "config.env":

    PORT = 4000

    FRONTEND_URL= http://192.168.43.241 (digite 'ipconfig' no terminal e substitua com Endereço IPV4 correto)

    MONGO_URI = mongodb+srv://<db_user>:<db_password>@cluster0.pxevp.mongodb.net/GATOS?retryWrites=true&w=majority&authSource=admin

    TOKEN_SECRET= defina um aletório por enquanto

  1- Acesse: console.firebase.google.com
  2- Selecione seu projeto
  3- Vá em ⚙️ Configurações do projeto
  4- Clique na aba "Contas de serviço"
  5- Clique em "Gerar nova chave privada"
  6- Baixe o .json → salve em backend/serviceAccountKey.json

  Para rodar o servidor:
    npm i
    npm start



FRONTEND:

  Crie um arquivo ".env":

    API_KEY=
    AUTH_DOMAIN=
    PROJECT_ID=
    STORAGE_BUCKET=
    MESSAGING_SENDER_ID=
    APP_ID=1:

    URL_EXPO_API_PUBLICA=http://192.168.43.241:4000 (http://IPV4:PORT do backend)

  Para rodar o aplicativo:
    npm i
    npx expo start -c
