# Exempel-API med Express
Ett skal för ett REST-API som använder NodeJs och Express.
Cors används för att tillåta alla anrop från alla domäner (fungerar ok som expempel, men är inte att rekommendera i en riktig webbplats).

## Installation
Kör: 
**npm install**
Starta sedan applikationen med: 
**npm run serve**

## Routes
Dessa "endpoints" används:
* GET: 	http://localhost:3000/api/ 						-> Returnerar hälsningsfras
* GET: 	http://localhost:3000/api/users 				-> Returnera array med användare
* POST: 	http://localhost:3000/api/users 			-> Lägg till användare
* PUT: 	http://localhost:3000/api/users/:id			-> Uppdatera en befintig användare
* DELETE: http://localhost:3000/api/users/:id	-> Radera en användare
Om någon annan route än ovan anropas ges ett felmeddelande som svar.

## Av
Av Mattias Dahlgren, Mittuniversitetet, mattias.dahlgren@miun.se