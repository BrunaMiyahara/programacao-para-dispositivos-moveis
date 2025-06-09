import express from "express";
import { cadastrarGato, listarGatos, buscarGatoPorId, editarGato, excluirGato } from "../controller/gato.js";
import { TokenVerificar } from "../middlewares/token.js"; 
import { AdminVerificar } from "../middlewares/admin.js";

const router = express.Router();

router.post("/cadastrar", TokenVerificar, AdminVerificar, cadastrarGato);
router.get("/", listarGatos);
router.get("/:id", buscarGatoPorId);
router.put("/:id", TokenVerificar, editarGato);
router.delete("/:id", TokenVerificar, excluirGato);

export default router;