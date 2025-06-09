import express from "express";
import { Token, Cadastrar, Usuarios, UsuariosId, UsuariosEmail, UsuarioRemover, UsuarioAtualizar } from "../controller/usuario.js";
import { AdminVerificar } from "../middlewares/admin.js";
import { TokenVerificar } from "../middlewares/token.js";

const router = express.Router();

router.post("/token",Token);
router.post("/cadastrar", Cadastrar);
router.get("/", Usuarios);
router.get("/:id", UsuariosId);
router.get("/email/:email", TokenVerificar, UsuariosEmail);
router.get("/remover/:id", TokenVerificar, AdminVerificar, UsuarioRemover);
router.put("/atualizar/:id", TokenVerificar, UsuarioAtualizar);

export default router;
