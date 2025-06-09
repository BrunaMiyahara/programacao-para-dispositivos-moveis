import mongoose from "mongoose";

const GatoSchema = new mongoose.Schema({
  nome: { type: String, default: "Sem nome" },
  nascimento: {
    dia: { type: Number, default: null },
    mes: { type: Number, default: null },
    ano: { type: Number, default: null },
    indefinido: { type: Boolean, default: false }
  },
  cor_pelo: { type: String, default: "" }, 
  fotos: [{ type: String }], 
  fiv_felv: {
    type: String,
    enum: [
      "Ambos positivos",
      "Fiv+/Felv-",
      "Fiv-/Felv+",
      "Ambos negativos",
      "Não testado"
    ],
    default: "Não testado"
  },
  vacinado: {
    status: { type: Boolean, default: false },
    tipos: [{ type: String, enum: ["V3", "V4", "V5", "raiva"] }]
  },
  vermifugado: { type: Boolean, default: false },
  criadoPor: { type: String }
});

export default mongoose.model("Gato", GatoSchema);