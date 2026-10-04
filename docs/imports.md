# Importer des données

`importNormeDiff` découpe deux exports texte où chaque rubrique commence en début de ligne (`S21.G00.30.001`). Il détecte ajouts, suppressions et changements, puis les rattache aux règles citant la rubrique. Les rubriques répétées doivent être normalisées avant import. Le cahier technique PDF brut n’est pas parsé automatiquement. Les exemples NEODeS sont **fictifs** : leurs exigences ne sont pas présentées comme des évolutions officielles 2027.

```sh
npm run demo:import
```

[Code complet de l’import](../examples/import.mjs). Ce parcours passe réellement du format source au rapport JSON/HTML. Les fichiers générés ne contiennent que des données synthétiques. Pour des documents réels confidentiels, écrire les rapports dans `reports/private/` (ignoré par Git), contrôler les droits de fichier et informer les personnes concernées avant un envoi externe.
