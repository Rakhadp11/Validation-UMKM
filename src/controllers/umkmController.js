'use strict';

const firebase = require('../../db');
const Umkm = require('../models/Umkm');
const admin = require("firebase-admin");
const config = require('../../config');
const credentials = require("../../serviceAccountKey.json");

    admin.initializeApp({
        credential: admin.credential.cert(credentials)
    });

const firestore = admin.firestore();

const registerUmkm = async (req, res, next) => {
    try {
        const { userId, umkmData } = req.body;

        const userSnapshot = await firestore.collection('users').doc(userId).get();
        if (!userSnapshot.exists) {
            return res.status(404).json({ success: false, message: 'User with the given ID not found' });
        }

        const umkmRef = await firestore.collection('umkm').add({
            ...umkmData,
            userId: userId,
        });

        res.json({
            success: true,
            message: 'UMKM data registered successfully',
            umkmId: umkmRef.id, 
        });
    } catch (error) {
        console.error('Error registering UMKM data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const validationUsers = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const umkmQuery = await firestore.collection('umkm').where('userId', '==', userId).get();
        const isUmkmRegistered = !umkmQuery.empty;

        const userSnapshot = await firestore.collection('users').doc(userId).get();
        const userData = userSnapshot.data();

        res.json({
            success: true,
            message: 'UMKM data has been successfully validated',
            isUmkmRegistered: isUmkmRegistered,
            userData: userData || null,
        });
    } catch (error) {
        console.error('Error validating UMKM:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getAllUmkm = async (req, res, next) => {
    try {
        const umkmQuery = await firestore.collection('umkm').get();
        const umkmArray = [];
    
        umkmQuery.forEach((doc) => {
            const umkmData = doc.data();
            const umkm = {
                id: doc.id,
                userId: umkmData.userId,
                umkmName:  umkmData.umkmName,
                industry: umkmData.industry,
                targetMarket: umkmData.targetMarket,
                city: umkmData.city,
                district: umkmData.district,
                urbanVillage: umkmData.urbanVillage,
                created_at: umkmData.created_at
            };
            umkmArray.push(umkm);
            });
        
        res.json({
            success: true,
            message: 'UMKM data has been successfully accepted',
            data: umkmArray,
            });
    } catch (error) {
        console.error('Error fetching UMKM data:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const getUmkmById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const umkm = await firestore.collection('umkm').doc(id);
        const data = await umkm.get();

        if (!data.exists) {
            return res.status(404).json({ success: false, message: 'Umkm with the given ID not found' });
        } else {
            const umkmData = data.data();
            const umkmResponse = {
                id: data.id,
                userId: umkmData.userId,
                umkmName:  umkmData.umkmName,
                industry: umkmData.industry,
                targetMarket: umkmData.targetMarket,
                city: umkmData.city,
                district: umkmData.district,
                urbanVillage: umkmData.urbanVillage,
                created_at: umkmData.created_at
            };

            res.json({
            success: true,
            message: 'UMKM data based on ID has been successfully retrieved',
            data: umkmResponse,
            });
        }
    } catch (error) {
        console.error('Error fetching UMKM data by ID:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const updateUmkm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const umkmRef = firestore.collection('umkm').doc(id);
        const umkm = await umkmRef.get();

        if (!umkm.exists) {
            return res.status(404).json({ success: false, message: 'Umkm with the given ID not found' });
        }

        await umkmRef.update(newData);

        res.json({
            success: true,
            message: 'Umkm data has been successfully updated',
            data: { id, ...newData },
        });
    } catch (error) {
        console.error('Error updating umkm data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUmkm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const umkmRef = firestore.collection('umkm').doc(id);
        const umkm = await umkmRef.get();

        if (!umkm.exists) {
            return res.status(404).json({ success: false, message: 'Umkm with the given ID not found' });
        }

        await umkmRef.delete();

        res.json({
            success: true,
            message: 'Umkm has been successfully deleted',
            data: { id, ...umkm.data() },
        });
    } catch (error) {
        console.error('Error deleting umkm data:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};


module.exports = {
    registerUmkm,
    validationUsers,
    getAllUmkm,
    getUmkmById,
    updateUmkm,
    deleteUmkm
}