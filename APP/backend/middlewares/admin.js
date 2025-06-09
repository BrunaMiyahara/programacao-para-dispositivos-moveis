import { Usuario } from "../models/usuariosSchema.js";

// VERIFICAR SE É ADMIN
export const AdminVerificar = async (req, res, next) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res.status(401).send({ message: "Token inválido ou sem email" });
    }
    const usuario = await Usuario.findOne({ email });
    if (usuario && usuario.role === "admin") {
      next();
    } else {
      return res.status(403).send({ message: "Acesso não autorizado" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Erro ao verificar admin", error: err.message });
  }
};