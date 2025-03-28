#!/bin/bash

set -euo pipefail

echo "🚀 Déploiement du frontend Lean Charts"

# Aller dans le dossier frontend
cd "$(dirname "$0")"

# 1. Compilation du frontend
echo "📦 Installation des dépendances (si nécessaire)"
npm install

echo "⚙️  Compilation du frontend (npm run build)"
npm run build

# 2. Chemin de destination
DEST_DIR="../leancharts-backend/frontend"

echo "🧹 Nettoyage du dossier cible : $DEST_DIR"
rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

# 3. Copie du build
echo "📁 Copie du build dans $DEST_DIR"
cp -r dist/* "$DEST_DIR"

echo "✅ Frontend copié avec succès dans $DEST_DIR"