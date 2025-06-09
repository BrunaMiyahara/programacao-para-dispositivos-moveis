import express from "express";
import { 
  Veterinarios,
  SolicitarVeterinario, 
  AprovarSolicitacaoVeterinario, 
  RecusarSolicitacaoVeterinario, 
  MinhaSolicitacaoVeterinario, 
  ListarSolicitacoesVeterinario, 
  RemoverVeterinario
 } from "../controller/veterinario.js";
import { TokenVerificar } from "../middlewares/token.js";
import { AdminVerificar } from "../middlewares/admin.js";

const router = express.Router();

router.get("/", Veterinarios);
router.post("/solicitar", TokenVerificar, SolicitarVeterinario);
router.post("/aprovar/:id", TokenVerificar, AdminVerificar, AprovarSolicitacaoVeterinario);
router.post("/recusar/:id", TokenVerificar, AdminVerificar, RecusarSolicitacaoVeterinario);
router.get('/minha-solicitacao', TokenVerificar, MinhaSolicitacaoVeterinario);
router.get('/solicitacoes', TokenVerificar, AdminVerificar, ListarSolicitacoesVeterinario);
router.put('/remover/:uid', TokenVerificar, AdminVerificar, RemoverVeterinario);

export default router;