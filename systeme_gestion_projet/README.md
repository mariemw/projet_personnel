📌 Plateforme de Gestion de Projets Collaboratifs (Full Stack)
🚀 Démo en ligne
Frontend :
👉 Application déployée:https://projet-personnel-6bqj.vercel.app/

🧱 Stack technique
Frontend
Angular
Socket.IO Client
Backend
NestJS
Socket.IO Gateway
MongoDB (Mongoose)
JWT Authentication
Nodemailer (verification email)
Déploiement
Frontend : Vercel
Backend : AWS

✨ Fonctionnalités
🔐 Authentification
Inscription avec email
Vérification par email
Connexion sécurisée JWT

📁 Gestion de projets
Création de projets
Ajout de membres
Gestion des rôles

✅ Gestion des tâches
Création de tâches
Assignation aux membres
Modification du statut
Ajout date limite
Suivi de progression

💬 Communication en temps réel
Chat entre membres via Socket.IO
Mise à jour live des tâches et projet

⚠️ Problème connu (important)
Le projet utilise :
Frontend HTTPS (Vercel)
Backend HTTP (AWS)
👉 Cela cause un problème de Mixed Content
👉 Les WebSockets (Socket.IO) peuvent être bloqués par le navigateur
🧠 Cause
Les connexions ws:// ne sont pas autorisées depuis un site https://

🛠️ Solution prévue
Passage du backend en :
HTTPS
WSS (WebSocket Secure)
ou ajout d’un reverse proxy sécurisé (Nginx + SSL)

📦 Installation locale
Frontend
cd client
npm install
ng serve
Backend
cd server
npm install
npm run start:dev

👩‍💻 Auteur
Projet personnel full stack Angular + NestJS
