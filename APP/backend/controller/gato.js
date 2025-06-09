import Gato from "../models/gatoSchema.js";

export const cadastrarGato = async (req, res) => {
  try {
    console.log('Payload recebido:', req.body);
    console.log('Usuário autenticado:', req.decoded);

    const {
      nome,
      nascimento,
      cor_pelo,
      fotos,
      fiv_felv,
      vacinado,
      vermifugado,
      criadoPor 
    } = req.body;

    const novoGato = new Gato({
      nome: nome || "Sem nome",
      nascimento: nascimento || { indefinido: true },
      cor_pelo: cor_pelo || "",
      fotos: fotos || [],
      fiv_felv: fiv_felv || "Não testado",
      vacinado: vacinado || { status: false, tipos: [] },
      vermifugado: vermifugado ?? false,
      criadoPor 
    });

    await novoGato.save();
    res.status(201).json(novoGato);
  } catch (error) {
    console.error('Erro ao cadastrar gato:', error);
    res.status(500).json({ message: "Erro ao cadastrar gato", error: error.message });
  }
};

export const listarGatos = async (req, res) => {
  try {
    const gatos = await Gato.find().sort({ _id: -1 }); 
    res.json(gatos);
  } catch (error) {
    console.error('Erro ao listar gatos:', error);
    res.status(500).json({ message: "Erro ao listar gatos", error: error.message });
  }
};

export const buscarGatoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const gato = await Gato.findById(id);

    if (!gato) {
      return res.status(404).json({ message: "Gato não encontrado." });
    }

    res.json(gato);
  } catch (error) {
    console.error('Erro ao buscar gato:', error);
    res.status(500).json({ message: "Erro ao buscar gato", error: error.message });
  }
};

export const editarGato = async (req, res) => {
  try {
    const { id } = req.params;
    const gato = await Gato.findById(id);

    if (!gato) {
      return res.status(404).json({ message: "Gato não encontrado." });
    }

    console.log(gato.criadoPor, req.decoded._id);

    if (String(gato.criadoPor) !== String(req.decoded._id)) {
      return res.status(403).json({ message: "Você não tem permissão para editar este gato." });
    }

    Object.assign(gato, req.body);

    await gato.save();
    res.json({ message: "Gato atualizado com sucesso.", gato });
  } catch (error) {
    console.error('Erro ao editar gato:', error);
    res.status(500).json({ message: "Erro ao editar gato", error: error.message });
  }
};

export const excluirGato = async (req, res) => {
  try {
    const { id } = req.params;
    const gato = await Gato.findById(id);

    if (!gato) {
      return res.status(404).json({ message: "Gato não encontrado." });
    }

    if (String(gato.criadoPor) !== String(req.decoded._id)) {
      return res.status(403).json({ message: "Você não tem permissão para excluir este gato." });
    }

    await Gato.findByIdAndDelete(id);

    res.json({ message: "Gato excluído com sucesso." });
  } catch (error) {
    console.error('Erro ao excluir gato:', error);
    res.status(500).json({ message: "Erro ao excluir gato", error: error.message });
  }
};
