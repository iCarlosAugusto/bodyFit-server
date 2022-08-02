import { firestore } from "firebase-admin";
import { Request, Response } from "express";
import { HttpUtil } from "../utils/HttpUtil";
import { Comentario, Postagem } from "../model/Postagem";
import { User } from "../model/User";


export class PostagemService {
    private db: firestore.Firestore;

    constructor(db: firestore.Firestore) {
        this.db = db;
    }

    public manterPostagem(request: Request, response: Response ) {

        if(request.body === undefined){
            request.body = {};
        }

        var postagem = Postagem.toPostagem(request.body);

        if(postagem.isValida()){
            if(postagem.id == undefined){
                postagem.id = this.db.collection("x").doc().id;
                postagem.dataDePostagem = new Date();
            }else{
                postagem.dataDePostagem = undefined;

            }
            this.db.doc(`publicacoes/${postagem.id}`).set(postagem.toJson(), { merge: true })
            .then(resultadoSnap => {
                HttpUtil.sucesso(postagem.toJson(), response);
            }).catch(erro => {
                HttpUtil.error("Postagem Invalida", response);
            });
        }else{
            HttpUtil.error("Falha", response);
        }
    }

    public cometaPublicacao(request: Request, response: Response) {
        var idPostagem = request.query.id;
        var comentario = Comentario.toComentario(request.body);
          
        if(idPostagem === undefined || idPostagem === ""){
            HttpUtil.error("O pametro id não pode ser null", response);
        }else if(!comentario.isValido()){
            HttpUtil.error("O comentário deve ser preenchido", response);
        } else{
            this.db.doc(`publicacoes/${idPostagem}`).get()
                .then(postSnap => {
                    var post = Postagem.toPostagem(postSnap.data());
                    comentario.dataDoComentario = new Date();
                    comentario.id = this.db.collection("x").doc().id;
                    if(post.comentarios === undefined) post.comentarios = [];
                    post.comentarios.push(comentario);
                    postSnap.ref.set(post.toJson(), {merge: true});
                    HttpUtil.sucesso(post.toJson(), response);
                }).catch(erro => {
                    HttpUtil.error("Falha ao inserir comentário", response);
                })
        }
    }

    public excluirPostagem(request: Request, response: Response) {
        if (request.query.id === undefined || request.query.id === "") {
            HttpUtil.error("Post invalido", response);
        } else {
            this.db.doc(`publicacoes/${request.query.id}`).delete().then(_=>{
                HttpUtil.sucesso("Post excluído", response);
            }).catch(erro => {
                HttpUtil.error("Tive uma falha" + erro, response);
            });
        }
    }

    public excluirComentario(request: Request, response: Response) {
        var idPostagem = request.query.id;
        var idComentario = request.query.idComentario;

        if (idPostagem === undefined || idPostagem === "" || idComentario === undefined || idComentario === "") {
            HttpUtil.error("POst ou comentário inválido", response);
        } else {
            this.db.doc(`publicacoes/${idPostagem}`).get().then(postSnap => {
               var postagem = Postagem.toPostagem(postSnap.data());
                postagem.comentarios = postagem.comentarios?.filter(c => c.id !== idComentario);
                postSnap.ref.set(postagem.toJson());
                HttpUtil.sucesso(postagem.toJson, response);
            }).catch(erro => {
                HttpUtil.error("Tive uma falha" + erro, response);
            });
        }
    }

    public darLikeNoPost(request: Request, response: Response) {
        var idPostagem = request.query.id;
        var like = User.fromJson(request.body);
        
        if (idPostagem === undefined || idPostagem === "" || like === undefined) {
            HttpUtil.error("Pamatro vazio", response);  
        } else {
            this.db.doc(`publicacoes/${idPostagem}`).get().then(postSnap => {
                var postagem = Postagem.toPostagem(postSnap.data());
                if(postagem.likes === undefined) postagem.likes = [];
                 postagem.likes.push(like);
                 postSnap.ref.set(postagem.toJson());
                 HttpUtil.sucesso(postagem.toJson, response);
             }).catch(erro => {
                 HttpUtil.error("Tive uma falha" + erro, response);
             });
        }
    }

    public removerLike(request: Request, response: Response) {
        var idPostagem = request.query.id;
        var idUsuario  = request.query.idUsuario;

        if (idPostagem === undefined || idPostagem === "" || idUsuario === undefined || idUsuario === "") {
            HttpUtil.error("POst ou comentário inválido", response);
        } else {
            this.db.doc(`publicacoes/${idPostagem}`).get().then(postSnap => {
               var postagem = Postagem.toPostagem(postSnap.data());
                postagem.likes = postagem.likes?.filter(l => l.id !== idUsuario);
                postSnap.ref.set(postagem.toJson());
                HttpUtil.sucesso(postagem.toJson(), response);
            }).catch(erro => {
                HttpUtil.error("Tive uma falha" + erro, response);
            });
        }
        
    }

    public listaPublicacoes(request: Request, response: Response){
        this.db.collection("publicacoes").get().then(postagensSnap => {
            var listPublicacoes: Postagem[] = [];
            postagensSnap.docs.forEach(postSnap => {
                listPublicacoes.push(Postagem.toPostagem(postSnap.data()));
            });
            HttpUtil.sucesso(listPublicacoes,response);

        }).catch(erro => {
            HttpUtil.error("Ops! Erro"+ erro, response);
        });
    }
}