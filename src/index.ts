import * as Functions from "firebase-functions";
import * as Admin from "firebase-admin";
import * as Express from "express";
import { UserServices } from "./services/UserServices";
import { PostagemService } from "./services/PostagemServices";

Admin.initializeApp(Functions.config().firebase);
const db = Admin.firestore();

const userExpress = Express();

const userServices = new UserServices(db);

userExpress.get("/criarUsuario", (req, res) => userServices.criarUsuario(req, res));

userExpress.get("/logarUsuario", (req, res) => userServices.logarUsuario(req, res));

userExpress.get("/editarUsuario", (req, res) => userServices.editarUsuario(req, res));

export const user = Functions.https.onRequest(userExpress);


const postagemExpress = Express();

const postagemService = new PostagemService(db);

postagemExpress.get("/manterPublicacao", (req, res) => postagemService.manterPostagem(req, res));

postagemExpress.get("/comentarPost", (req, res) => postagemService.cometaPublicacao(req, res));

postagemExpress.get("/excluirPostagem", (req, res) => postagemService.excluirPostagem(req, res));

postagemExpress.get("/excluirComentario", (req, res) => postagemService.excluirComentario(req, res));

postagemExpress.get("/darLike", (req, res) => postagemService.darLikeNoPost(req, res));

postagemExpress.get("/excluirComentario", (req, res) => postagemService.removerLike(req, res));

postagemExpress.get("/consultarPublicacoes", (req, res) => postagemService.listaPublicacoes(req, res));

export const feed = Functions.https.onRequest(postagemExpress);