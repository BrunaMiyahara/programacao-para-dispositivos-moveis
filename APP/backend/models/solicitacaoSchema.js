import mongoose from "mongoose";

const solicitacaoVeterinarioSchema = new mongoose.Schema({
  usuario: { type: String, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  especializacao: { type: String, required: true },
  descricao: { type: String },
  status: { type: String, enum: ["pendente", "aprovado", "recusado"], default: "pendente" },
  dataEnvio: { type: Date, default: Date.now }
});

export const Solicitacoes = mongoose.model("Solicitacoes", solicitacaoVeterinarioSchema);