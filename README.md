# flashcard-ts
Creating a CRUD flashcard application which interacts with both Firestore for a persistent repo for user data, but also local storage.

Objective: Create a CRUD application using Firebase as a backend. I've not used firebase before but have heard many good things about it, and so
 being inspired by applications like Memrise and Anki, I decided to create a flashcard application that would levergae the firebase product!

Technologies Used:
- React
- TypeScript
- Vitest (Vite Test)

# Goals:

### User Generated Cards
<ul>
  <input disabled type="checkbox" checked /> be able to create cards <br />
  <input disabled type="checkbox" checked /> be able to store cards <br />
  <input disabled type="checkbox" checked /> be able to retrieve stored cards <br />
  <input disabled type="checkbox" checked /> be able to update cards (so far only prompt / answer) <br />
</ul>

### Quiz Time
<ul>
  <input disabled type="checkbox"/> honour system (select from 1-5 how well information could be retrieved) <br />
  <input disabled type="checkbox"/> input system (allow user input on prompt and determine if user was correct, wrong, or close) <br />
  <input disabled type="checkbox" checked/> multiple choice (Present a range of other card answers and allow user to attempt selecting the matching answer to displayed prompt) <br />
  <input disabled type="checkbox" checked/> update relevant card objects upon finishing review of specific card <br />  
</ul>


### decks Functionality
<ul>
  <input disabled type="checkbox" checked/> Ability to create decks <br />
  <input disabled type="checkbox" checked/> Ability to edit decks <br />
  <input disabled type="checkbox" checked/> Ability to add / remove cards from a deck <br />
  <input disabled type="checkbox"/> Hide card from deck <br />
</ul>

### Data Management Options
<ul>
  <input disabled type="checkbox" checked/> Import CSV: Import a CSV of card data into a collection of cards  <br />
  <input disabled type="checkbox" checked/> Export CSV: Export a collection of cards to comma delimited CSV   <br />
  <input disabled type="checkbox"/> Migrate to Cloud: Transfer all LocalStorage cards to Firestore  <br />
  <input disabled type="checkbox"/> Make it Rain: Transfer all User Firestore data to LocalStorage  <br />
  <input disabled type="checkbox"/> Sync: keep LocalStorage and Firestore in sync with each other (user-toggle)   <br />
</ul>   

### User Authentication
<ul>
  <input disabled type="checkbox" checked/> Implement fireauth to get auth working with application so that I can open app to users   <br />
  <input disabled type="checkbox"/> tweaks to data processes to utilise user Id in the CRUD processes.  <br />
</ul>   