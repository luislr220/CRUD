const express = require('express');
const productModel = require('../models/product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();


const uuid = require('uuid');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function(req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + uuid.v4();
    cb(null, uniqueSuffix + fileExt);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return cb(new Error('Only images are allowed'))
    }
    cb(null, true)
  }
});

// Listado de todos los productos
router.get("/", async function(req, res, next) {

  res.set('Access-Control-Allow-Origin', '*');
  const resultado = await productModel.find();
  res.json(resultado);
  console.log(resultado);
}); 

router.get('/:id/images/:filename', async function(req, res) {


  
  const id = req.params.id;
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../public/images', filename);

  if (fs.existsSync(imagePath)) {
    // Construir la ruta completa de la imagen
    const imageUrl = req.protocol + '://' + req.get('host') + '/images/' + id + '/' + filename;
    res.json({imageUrl: imageUrl});
  } else {
    res.status(404).send("Imagen no encontrada");
  }
});


router.post("/", upload.array('images', 10), async function(req, res, next) {
  const product = new productModel({
    description: req.body.description,
    name: req.body.name,
    price: req.body.price,
    images: []
  });
  
  // Verificar si req.files está definido
  if (req.files && req.files.length > 0) {
    product.images = req.files.map(file => file.path); // obtenemos las rutas de las imágenes subidas
  }

  const result = await product.save();
  
  // Si req.files está definido, esperar a que todas las imágenes se suban antes de enviar la respuesta
  if (req.files && req.files.length > 0) {
    await Promise.all(req.files.map(file => new Promise(resolve => {
      fs.access(file.path, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    })));
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(result);
});


router.put("/:id", async function(req, res, next) {
  const filter = { _id: req.params.id };
  const update = {
    description: req.body.description,
    name: req.body.name,
    price: req.body.price,
    images: req.body.images
  };

  const resultado = await productModel.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true
  });

  res.json(resultado);

  console.log(resultado);
});

router.delete("/:id", async function(req, res, next) {
  try {
    const result = await productModel.findOneAndDelete({ _id: req.params.id });
    if (result) {
      // Eliminar la imagen correspondiente
      result.images.forEach((imagePath) => {
        fs.unlinkSync(imagePath);
      });

      res.json(result);
    } else {
      res.status(404).json({ error: "No se encontró el producto con Id " + req.params.id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

module.exports = router;
