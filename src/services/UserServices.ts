import { Response, Request } from "express";
import { HttpUtil } from "../utils/HttpUtil";
import { User } from "../model/User";
import { firestore } from "firebase-admin";

class UserServices {

    private db: firestore.Firestore;
    constructor(db: firestore.Firestore) {
        this.db = db;
    }
    
    async criarUsuario(request: Request, response: Response) {
        const user = User.fromJson(request.body);

        if(!user.isUserValid()){
            HttpUtil.error(user, response);
            return;
        };

        await this.db.collection("usuarios").where("email", "==", user.email).get()
            .then(users => {
                if(users.size === 0){
                    var id = this.db.collection("x").doc().id;
                    user.id = id;
                    return this.db.doc(`usuarios/${id}`).create(user.toJson());
                }else{
                    HttpUtil.error("Opps..", response);
                    return null
                }
            })
            .then(responseUserCreated => {
                if(responseUserCreated != null){
                    HttpUtil.sucesso(user, response);
                }
            })
            .catch(erro => {
                HttpUtil.error("Ops...", response)
            })
        HttpUtil.sucesso(user, response);
    }

    logarUsuario(request: Request, response: Response) {

        var email = request.params.email;
        var password = request.params.password;
        console.log(request.params);
        console.log(email);
        console.log(password)

        //if(!email || !password){
        //    HttpUtil.error("Email ou senha não dados", response);
        //    return;
        //}
        //HttpUtil.success("Email dados", response);

    }

    editarUsuario(request: Request, response: Response) {
        var user = User.fromJson(request.body);
        
        if(!user.isUserValid || !user.id){
            HttpUtil.error(user, response);
            return;
        }

        var result = this.db.doc(`usuarios/${user.id}`).set(user.toJson());
        HttpUtil.sucesso(result, response);
    }
}

export { UserServices };