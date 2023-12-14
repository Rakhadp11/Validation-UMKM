const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');

class Umkm {
    constructor(umkmName, industry, targetMarket, city, district, urbanVillage) {
        this.id = uuidv4();
        this.umkmName = umkmName;
        this.industry = industry;
        this.targetMarket = targetMarket;
        this.city = city;
        this.district = district;
        this.urbanVillage = urbanVillage;
        this.created_at = admin.firestore.FieldValue.serverTimestamp();
    }
}

module.exports = Umkm;
