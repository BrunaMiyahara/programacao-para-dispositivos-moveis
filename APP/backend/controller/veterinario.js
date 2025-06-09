import { Solicitacoes } from "../models/solicitacaoSchema.js";
import { Usuario } from "../models/usuariosSchema.js";

export const SolicitarVeterinario = async (req, res, next) => {
  try {
    const { nome, email, especializacao, descricao } = req.body;
    const usuarioId = req.decoded.uid; 

    const solicitacao = await Solicitacoes.create({
      usuario: usuarioId, 
      nome,
      email,
      especializacao,
      descricao
    });

    res.status(201).json({ message: "Solicitação enviada!", solicitacao });
  } catch (error) {
    next(error);
  }
};

export const AprovarSolicitacaoVeterinario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const solicitacao = await Solicitacoes.findById(id);
    if (!solicitacao) return res.status(404).json({ message: "Solicitação não encontrada." });

    solicitacao.status = "aprovado";
    await solicitacao.save();

    await Usuario.findOneAndUpdate({ uid: solicitacao.usuario }, { role: "veterinario" });

    const solicitacoesAprovadas = await Solicitacoes.find({ status: "aprovado" });
    const usuariosAprovadosUids = solicitacoesAprovadas.map(s => s.usuario);

    await Usuario.updateMany(
      { uid: { $in: usuariosAprovadosUids }, role: { $ne: "veterinario" } },
      { $set: { role: "veterinario" } }
    );

    res.json({ success: true, message: "Solicitação aprovada e todos usuários com solicitações aprovadas agora são veterinários." });
  } catch (error) {
    next(error);
  }
};

export const RecusarSolicitacaoVeterinario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const solicitacao = await Solicitacoes.findById(id);
    if (!solicitacao) return res.status(404).json({ message: "Solicitação não encontrada." });

    solicitacao.status = "recusado";
    await solicitacao.save();

    res.json({ message: "Solicitação recusada com sucesso." });
  } catch (error) {
    next(error);
  }
};

export const ListarSolicitacoesVeterinario = async (req, res) => {
  try {
    const solicitacoes = await Solicitacoes.find()
      .populate("usuario", "nome email role") 
      .lean();
    res.json(solicitacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar solicitações.", error: error.message });
  }
};

export const MinhaSolicitacaoVeterinario = async (req, res) => {
  try {
    const usuarioId = req.decoded.uid;
    const solicitacoes = await Solicitacoes.find({ usuario: usuarioId }).sort({ dataEnvio: -1 });
    if (!solicitacoes || solicitacoes.length === 0) {
      return res.status(404).json({ message: "Nenhuma solicitação encontrada." });
    }
    res.json({ solicitacao: solicitacoes[0] });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar solicitação.", error: error.message });
  }
};

export const Veterinarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({ role: "veterinario" }).lean();

    const usuariosComSolicitacao = await Promise.all(
      usuarios.map(async (u) => {
        const solicitacaoAprovada = await Solicitacoes.findOne({
          usuario: u.uid,
          status: "aprovado"
        })
        .sort({ dataEnvio: -1 })
        .lean();

        console.log(`Usuário: ${u.nome} (${u.uid})`);
        if (solicitacaoAprovada) {
          console.log(`Especialização encontrada: ${solicitacaoAprovada.especializacao}`);
        } else {
          console.log("Nenhuma solicitação aprovada encontrada.");
        }

        return {
          ...u,
          especializacao: solicitacaoAprovada?.especializacao || null,
          descricao: solicitacaoAprovada?.descricao || null
        };
      })
    );

    res.json(usuariosComSolicitacao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar veterinários.", error: error.message });
  }
};

export const RemoverVeterinario = async (req, res) => {
  try {
    if (!req.decoded || req.decoded.role !== "admin") {
      return res.status(403).json({ message: "Apenas administradores podem remover veterinários." });
    }
    const { uid } = req.params;
    const usuario = await Usuario.findOne({ uid });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    usuario.role = "usuario";
    usuario.mensagem = "Seu perfil de veterinário foi removido por um administrador.";

    const solicitacao = await Solicitacoes.findOne({
      usuario: usuario.uid, 
      status: "aprovado"
    });
    if (solicitacao) {
      solicitacao.status = "recusado";
      await solicitacao.save();
    }

    await usuario.save();

    res.json({ message: "Veterinário removido e solicitação marcada como recusada." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover veterinário.", error: error.message });
  }
};