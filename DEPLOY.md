# Déploiement Vercel — CréaActif

## Variables d'environnement à configurer dans Vercel

| Variable | Valeur |
|---|---|
| VITE_SUPABASE_URL | https://dfoaumjleqtxjeaplnna.supabase.co |
| VITE_SUPABASE_ANON_KEY | (clé anon du projet Supabase) |
| ANTHROPIC_API_KEY | (clé API Anthropic) |

## Étapes

1. Aller sur vercel.com → Add New Project → Import Git Repository
2. Sélectionner `jfb4plai/CreaActif`
3. Framework preset : Vite
4. Ajouter les 3 variables d'environnement ci-dessus
5. Cliquer Deploy
6. Dans Settings → Domains → ajouter `creaactif.jfb4plai.com`
7. Configurer le CNAME dans le gestionnaire DNS (Vercel fournit la valeur)

## Supabase — exécuter setup.sql

Dans le SQL Editor du projet dfoaumjleqtxjeaplnna :
- Copier le contenu de `supabase/setup.sql`
- Cliquer Run
- Vérifier que les tables `creaactif_activities` et `creaactif_results` sont créées avec RLS activé
