import { Usuario } from "../models/usuariosSchema.js";

// VERIFICAR SE É VETERINARIO
export const VeterinarioVerificar = async (req, res, next) => {
  const email = req.decoded.email;
  const query = { email: email };
  const usuario = await Usuario.findOne(query);
  if (usuario.cargo === "veterinario") {
    next();
  } else {
    return res.status(401).send({ message: "Acesso não autorizado"})
  };
};