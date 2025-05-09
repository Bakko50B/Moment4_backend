# Skal för API med autentisering
Utgångspunkt med ett skal från Mattias Dahlgren  
Hämtat från teori och läsanvisningar    
Det mesta är förändrat, men skalet var en bra start trots det.  
Koden har sitt urrsprung från kurslitteratur (video) och bhar delvis reviderats.  

## Installation  
Kör:   
**npm install**  
Starta sedan applikationen med:   
**npm run serve**  

## Routes  
    
* POST: http://localhost:3000/api/register   			-> Skapa en användare  
* POST: http://localhost:3000/api/login 				-> Inlogg för användare  
* GET:  http://localhost:3000/api/protected 			-> Skyddat område    
  
Om någon annan route än ovan anropas ges ett felmeddelande som svar.  
  
## Av  
Av Mattias Dahlgren, Mittuniversitetet, mattias.dahlgren@miun.se  
### Bearbetat av  
Torbjörn Lundberg, tolu2403@student.miun.se   