# Guide de démarrage rapide

## Installation en 3 étapes

### 1. Installer les dépendances
```bash
npm install
```

### 2. Configurer l'environnement
Créez un fichier `.env` à la racine du projet :
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_ADMIN_PASSWORD=admin123
```

### 3. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Routes disponibles

- `/` - Classement en temps réel
- `/dashboard` - Tableau de bord avec statistiques
- `/admin` - Panneau d'administration (mot de passe: `admin123` par défaut)

## Prérequis

- Node.js 18+ installé
- API Django REST backend en cours d'exécution sur `http://localhost:8000/api`

## Dépannage

### L'application ne se connecte pas à l'API
- Vérifiez que l'API Django est démarrée
- Vérifiez l'URL dans le fichier `.env`
- Vérifiez la console du navigateur pour les erreurs

### Erreurs de build
- Supprimez `node_modules` et `package-lock.json`
- Réinstallez avec `npm install`

### Problèmes de styles
- Vérifiez que Tailwind CSS est bien configuré
- Redémarrez le serveur de développement

