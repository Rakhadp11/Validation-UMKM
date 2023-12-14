const express = require('express');
const { registerUmkm,
        validationUsers,
        getAllUmkm,
        getUmkmById,
        updateUmkm,
        deleteUmkm } = require('../controllers/umkmController');

const router = express.Router();

router.post('/validation/umkm', registerUmkm);
router.get('/validation/user/:userId', validationUsers);
router.get('/umkm', getAllUmkm);
router.get('/umkm/:id', getUmkmById);
router.put('/umkm/update/:id', updateUmkm);
router.delete('/umkm/delete/:id', deleteUmkm);

module.exports = {
    routes: router
}