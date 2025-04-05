const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');

require('dotenv').config();

const app=express();

const PORT=process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Mongo Connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.use('/send-email', require('./routes/Email/emailRoute'));
app.use('/users',require('./routes/UtilisateurRoutes'));
app.use('/login',require('./routes/LoginRoutes'));
app.use('/vehicules',require('./routes/VehiculeRoutes'));
app.use('/rendezvous',require('./routes/RendezVousRoutes'));
app.use('/piece',require('./routes/PieceRoutes'));
app.use('/forgot-password',require('./routes/Email/emailRoute'));
app.use('/reset-password',require('./routes/Email/emailRoute'));


// ---------- Routes layout -----------
app.use('/default-layout', require('./routes/layout-frontend/DefaultLayoutRoutes'));

// ---------- Routes profil client -----------
app.use('/acceuil', require('./routes/client/AcceuilRoutes'));
app.use('/rendez-vous', require('./routes/client/SuivisReparationRoutes'));
app.use('/rendez-vous', require('./routes/client/AvisRoutes'));
app.use('/prestation', require('./routes/client/DetailPrestationRoutes'));
app.use('/devis', require('./routes/client/devisRoutes'));

// ---------- Routes profil mecanicien -----------
app.use('/mecanicien/rendez-vous', require('./routes/mecanicien/ListeRendezVousRoutes'));
app.use('/mecanicien/rendez-vous', require('./routes/mecanicien/SuiviReparationRoutes'));


// ---------- Routes profil manager -----------
app.use('/services-proposes', require('./routes/manager/ServiceProposeRoutes'));
app.use('/dashboard', require('./routes/manager/statsRoutes'));



app.listen(PORT,()=>console.log(`Serveur demarer sur le port ${PORT}`));
