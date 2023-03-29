export class User{
    _id : string | undefined;
    nom : string  | undefined;
    prenom : string | undefined;
    email : string | undefined;
    pwd : string | undefined;

    constructor({_id,nom, prenom,email,pwd}: {
        _id? : string,
        nom?: string,
        prenom?: string,
        email? : string,
        pwd? : string
    }) {
        this._id = _id;
        this.nom = nom;
        this.prenom = prenom,
        this.email = email,
        this.pwd = pwd
    }
}