# BackAdvancedWeb
Back du projet Web Avancé  A4 Info

### BackAdvancedWeb - Système de Livraison de Restaurants
Ce projet constitue le backend pour une application de livraison de repas structurée en microservices.


### Description du Projet
BackAdvancedWeb est une API REST conçue pour gérer les commandes de livraison de repas. 
Le système permet aux clients de parcourir les restaurants à travers leur sélection de menus et d'articles, commander des plats et suivre leurs livraisons.

### Architecture Microservices
Le projet est divisé en trois microservices principaux :
1. Auth-Users : Gère l'authentification des utilisateurs et la gestion de leurs comptes.
2. Restaurants : Gère le catalogue des restaurants, y compris les menus et les articles disponibles.
3. Commandes : Gère le traitement et le suivi des commandes de livraison.

### Technologies Utilisées
1. Node.js : Environnement d'exécution JavaScript côté serveur.
2. Express.js : Framework web pour Node.js, utilisé pour construire l'API REST.
3. PostgreSQL : Base de données relationnelle utilisée pour stocker les données des utilisateurs, des restaurants et des commandes.
4. MongoDB : Base de données NoSQL utilisée pour stocker les données des utilisateurs, des restaurants et des commandes.
5. Swagger : Outil de documentation d'API qui permet de visualiser et tester les endpoints de l'API.
6. Docker : Conteneurisation des microservices pour faciliter le déploiement et la gestion des dépendances.


## Swaggers :

Auth : http://localhost:3001/api-docs/#/

Restaurants : http://localhost:3002/api-docs/#/

Commande: http://localhost:3004/api-docs/#/

Installation et Configuration :

1. Clonez le dépôt

2. Vérifiez que vous avez Docker installé sur votre machine.

3. Exécutez la commande suivante pour démarrer les conteneurs Docker :
    - docker-compose up -d

4. Enjoy