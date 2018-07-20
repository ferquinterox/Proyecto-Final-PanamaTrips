const multer = require('multer');
//Multer Opciones
const storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, 'uploads');
	},
	filename: function(req, file, cb){
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
//acepta un archivo
    if (file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png'){
        cb(null, true);
    }else{
//rechaza el archivo
    cb(new  Error('El archivo no es compatible con los tipos disponibles'), false);}
    };

const upload = multer({storage: storage, limits: { 
	fileSize: 1024 * 1024 * 10 //Con esto acepta hasta 10mb de fotos
	}, 
    fileFilter: fileFilter });
 module.exports = upload;