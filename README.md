# CarAutism 🏎️

**Le quiz automobile ultime** — Supercars, F1, Technique & Culture

PWA jouable directement dans Safari, installable sur l'écran d'accueil iPhone.

---

## Stack

- **Frontend** : React 18 + TypeScript + Vite
- **Style** : Tailwind CSS
- **PWA** : vite-plugin-pwa (service worker, manifest, offline)
- **Backend** : Supabase (PostgreSQL + Auth + Realtime)
- **Hébergement** : Vercel
- **Images** : Cloudflare R2 (à venir)

---

## Setup local

### 1. Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (gratuit)

### 2. Cloner et installer

```bash
git clone https://github.com/MmmLucien/CarAutism.git
cd CarAutism
npm install
```

### 3. Variables d'environnement

```bash
cp .env.example .env.local
```

Remplis `.env.local` avec tes clés Supabase :
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

### 4. Base de données Supabase

1. Crée un projet sur [supabase.com](https://supabase.com)
2. Va dans **SQL Editor**
3. Copie-colle le contenu de `supabase_schema.sql` et exécute

### 5. Lancer en dev

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

---

## Déploiement sur Vercel

```bash
# Installe Vercel CLI
npm i -g vercel

# Déploie
vercel

# Puis configure les variables d'environnement dans le dashboard Vercel
# VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
```

---

## Installer sur iPhone (PWA)

1. Ouvre l'URL de production dans **Safari**
2. Appuie sur le bouton **Partager** (carré avec flèche)
3. Sélectionne **"Sur l'écran d'accueil"**
4. L'app se lance en plein écran comme une app native

---

## Structure du projet

```
CarAutism/
├── src/
│   ├── components/       # Composants réutilisables (à venir)
│   ├── pages/
│   │   ├── Home.tsx      # Écran d'accueil + sélection sujets
│   │   ├── Game.tsx      # Quiz en cours
│   │   ├── Auth.tsx      # Connexion / inscription
│   │   ├── Profile.tsx   # Profil utilisateur
│   │   └── Leaderboard.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx   # Contexte authentification
│   │   └── useGame.ts    # State machine du jeu
│   ├── lib/
│   │   ├── supabase.ts   # Client Supabase + types DB
│   │   ├── constants.ts  # Catégories, trophées, config
│   │   └── gameUtils.ts  # Logique jeu (shuffle, checkAnswer, XP)
│   ├── types/
│   │   └── index.ts      # Types TypeScript partagés
│   └── data/
│       └── questions.ts  # Questions (temp, → Supabase)
├── supabase_schema.sql   # Schéma base de données
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

---

## Roadmap

### Phase 1 — MVP (en cours)
- [x] Structure React + PWA
- [x] Auth Supabase (email + pseudo unique)
- [x] Game state hook complet
- [x] 4 niveaux (QCM 4/6/8 choix + texte libre)
- [x] Trophées, streak, XP
- [x] Contestation
- [x] Leaderboard global
- [ ] Sauvegarde scores Supabase
- [ ] Mode hors-ligne (service worker)
- [ ] Monétisation (AdSense + Stripe)

### Phase 2
- [ ] 500+ questions via Supabase
- [ ] Photos Cloudflare R2
- [ ] Quêtes journalières
- [ ] Mode duel temps réel
- [ ] Partage réseaux sociaux

### Phase 3
- [ ] App Store via Capacitor (optionnel)
