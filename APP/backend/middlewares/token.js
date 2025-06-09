import admin from 'firebase-admin';
import { Usuario } from '../models/usuariosSchema.js';

export const TokenVerificar = async (req, res, next) => {
  const autorizacao = req.headers.authorization;

  if (!autorizacao) {
    return res.status(401).send({ message: "Autorização Inválida" });
  }

  const token = autorizacao.split(" ")[1];

  if (!token) {
    return res.status(400).send({ message: "Token malformado" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    const usuarioBanco = await Usuario.findOne({ uid: decoded.uid });
    if (!usuarioBanco) {
      return res.status(401).send({ message: "Usuário não encontrado no banco" });
    }

    req.decoded = {
      ...decoded,
      _id: usuarioBanco._id,
      email: usuarioBanco.email,
      role: usuarioBanco.role, 
      nome: usuarioBanco.nome
    };

    next();
  } catch (err) {
    console.error('Erro ao verificar token Firebase:', err); 
    return res.status(401).send({ message: "Acesso não autorizado", error: err.message });
  }
};