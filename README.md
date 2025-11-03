# VTC - Application de Transport

Une application moderne de transport VTC (Voiture de Transport avec Chauffeur) construite avec React et Stripe pour les paiements.

## 🚀 Technologies Utilisées

- **Frontend**
    - React 19
    - React Router DOM
    - Styled Components
    - Formik & Yup pour la gestion des formulaires
    - React Google Maps API

- **Backend**
    - Node.js avec Express
    - TypeScript
    - Stripe API
    - CORS

## 📦 Installation

1. Clonez le repository

```bash
git clone [URL_DU_REPO]
cd vtc
```

2. Installez les dépendances

```bash
npm install
```

3. Configurez les variables d'environnement
   Créez un fichier `.env` dans le dossier server avec les variables suivantes :

```
STRIPE_SECRET_KEY=votre_clé_secrète_stripe
STRIPE_WEBHOOK_SECRET=votre_clé_webhook_stripe
```

## 🏃‍♂️ Démarrage

1. Lancez le serveur backend

```bash
npm run server
```

2. Dans un autre terminal, lancez le frontend

```bash
npm run dev
```

## 📁 Structure du Projet

```
vtc/
├── server/           # Backend Node.js/Express
│   ├── server.ts     # Point d'entrée du serveur
│   └── ...           # Autres fichiers backend
├── src/             # Frontend React
│   ├── components/  # Composants React
│   ├── pages/       # Pages de l'application
│   └── ...          # Autres dossiers frontend
└── public/          # Assets statiques
```

## 📱 Fonctionnalités Principales

- Système de réservation de courses
- Intégration Stripe pour les paiements sécurisés
- Cartographie avec Google Maps
- Interface utilisateur moderne et responsive
- Gestion des utilisateurs et des courses

## 🔒 Sécurité

- Paiements sécurisés via Stripe
- Validation des données côté serveur
- Protection CSRF
- Webhooks sécurisés avec signature Stripe

## 📝 API Routes

- `/create-payment-intent` - Création d'une intention de paiement Stripe
- Autres routes d'API à documenter selon les besoins

## 📈 Hébergement

- **Frontend** : GitHub Pages ou Vercel
- **Backend** : Render.com

## 🤝 Contributing

Pour contribuer au projet :

1. Fork le repository
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
