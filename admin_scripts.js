//
use panamatrips;
db.createCollection('user');
db.users.insertOne({
    "_id" : ObjectId(),
    "rol" : "admin",
    "email" : "adminroot@gmail.com",
    "nombre" : "Admin",
    "apellido" : "Admin",
    "provincia" : "-",
    "passConfirm" : "$2b$10$YdwUYTbI/qGNgddMlh4sr.gy.Q6sRAwUzMa201R4/TrMzemEiPoJO",
    "password" : "$2b$10$YdwUYTbI/qGNgddMlh4sr.gy.Q6sRAwUzMa201R4/TrMzemEiPoJO",
    "imagenperfil" : "uploads/2018-07-25T19:37:14.581Zpersonaf.png",
    "__v" : 0
 });