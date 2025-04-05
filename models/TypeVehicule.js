const mongoose = require('mongoose');

const typeVehiculeSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('TypeVehicule', typeVehiculeSchema);
