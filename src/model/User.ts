class User {

    id: string;
    nome: string;
    senha: string;
    email: string;

    constructor(id: string, nome: string, senha: string, email: string ) {
        this.id = id;
        this.nome = nome;
        this.senha = senha;
        this.email = email;
    }

    public isUserValid() {
        return !!this.email || this.senha;
    }

    static fromJson(json: any = {}) {
        return new User(json.id, json.nome, json.senha, json.email);
    }

    public toJson() {
        return JSON.parse(JSON.stringify(this));
    }
}

export { User };