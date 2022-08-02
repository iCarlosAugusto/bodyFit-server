import { User } from "./User";

export class Postagem {
    id?: string;
    conteudo?: string;
    dataDePostagem?: Date;
    criador?: User;
    likes?: User[];
    comentarios?: Comentario[];

    constructor(
        conteudo?: string,
        dataDePostagem?: Date,
        criador?: User,
        likes?: User[],
        comentarios?: Comentario[],
        id?: string, 
    ) {
        this.conteudo = conteudo,
        this.dataDePostagem = dataDePostagem;
        this.criador = criador;
        this.likes = likes
        this.comentarios = comentarios
        this.id = id;
    }

    public isValida() : boolean {
        return this.conteudo !== undefined && this.criador !== undefined;
    }

    static toPostagem(json: any) {
        return new Postagem(
            json.conteudo,
            json.dataDePostagem,
            User.fromJson(json.criador),
            json.likes,
            json.comentarios,
            json.id,
        )
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }
}


export class Comentario {
    id?: string;
    dataDoComentario?: Date;
    comentario?: string;
    criador?: User;

    constructor(criador?: User, comentario?: string, dataDeComentario?: Date, id?: string){
        this.comentario = comentario;
        this.criador = criador;
        this.dataDoComentario = dataDeComentario;
        this.id = id;
    }

    public isValido() {
        return this.criador !== undefined && this.comentario !== undefined && this.comentario !== "";
    }

    static toComentario(json: any): Comentario {
        return new Comentario(User.fromJson(json.criador), json.comentario, json.dataDeComentario);
    }

    public toJson(): any {
        return JSON.parse(JSON.stringify(this));
    }
}