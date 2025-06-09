import ErrorHandler from "../middlewares/error.js";
import { Usuario } from "../models/usuariosSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

// DEFINIR TOKEN
export const Token = async (req, res) => {
  const usuario = req.body;
  
  if (!process.env.TOKEN_SECRET) {
    throw new Error("A variável de ambiente TOKEN_SECRET não está definida!");
  }

  const token = jwt.sign(usuario, process.env.TOKEN_SECRET, {
    expiresIn: "24h"
  });
  res.json({ token }); 
};

// CRIAR USUARIO
export const Cadastrar = async (req, res, next) => {
  const { nome, email, fotoUrl, role, celular, uid } = req.body; 
  try {
    await Usuario.create({ nome, fotoUrl, email, role, celular, uid }); 
    res.status(201).json({
      success: true,
      message: "Cadastrado com sucesso!",
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return next(new ErrorHandler(validationErrors.join(', '), 400));
    }
    return next(error);
  }
};

// LISTAR TODOS USUARIOS
export const Usuarios = async (req, res) => {
  const result = await Usuario.find({}).lean();
  res.json(result);
}

// LISTAR USUARIO POR ID
export const UsuariosId = async (req, res) => {
  const id = req.params.id;
  const query = { _id: id };
  const result = await Usuario.findOne({ _id: id }).select('nome email celular').lean();
  if (!result) return res.status(404).json({ message: "Usuário não encontrado" });
  res.json(result);
}

// LISTAR USUARIO POR EMAIL
export const UsuariosEmail = async (req, res) => {
  const email = req.params.email;
  const result = await Usuario.findOne({ email }).lean();
  res.json(result);
}

// REMOVER USUARIO
export const UsuarioRemover = async (req, res) => {
  const id = req.params.id;
  const result = await Usuario.deleteOne({ _id: id });
  res.json(result);
}

// ATUALIZAR USUARIO
export const UsuarioAtualizar = async (req, res) => {
  const id = req.params.id;
  const updatedUser = req.body;
  const filter = { _id: id };
  const opcoes = { upsert: true };
  const updatedDoc = {
    $set: {
      nome: updatedUser.nome,
      email: updatedUser.email,
      cargo: updatedUser.opcao,
      endereco: updatedUser.endereco,
      sobre: updatedUser.sobre,
      fotoUrl: updatedUser.fotoUrl,
      especializacoes: updatedUser.especializacoes ? updatedUser.especializacoes : null,
      celular: updatedUser.celular 
    }
  };
  const result = await Usuario.updateOne(filter, updatedDoc, opcoes);
  res.json(result);
}