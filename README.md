# flashcard-ts
Creating a CRUD flashcard application which interacts with both Firestore for a persistent repo for user data, but also local storage.

Objective: Create a CRUD application using Firebase as a backend. I've not used firebase before but have heard many good things about it, and so
 being inspired by applications like Memrise and Anki, I decided to create a flashcard application that would levergae the firebase product!

Technologies Used:
- React
- TypeScript
- Vitest (Vite Test)

Milestones:

### User Generated Cards
- [x] be able to create cards
- [x] be able to store cards
- [x] be able to retrieve stored cards
- [x] be able to update cards (so far only prompt / answer)

![update operations](https://user-images.githubusercontent.com/89533155/219385485-a6149af0-d258-40b5-9541-52daff419524.gif)

### Quiz Time
  - honour system (select from 1-5 how well information could be retrieved)
  - input system (allow user input on prompt and determine if user was correct, wrong, or close)
  - multiple choice (Present a range of other card answers and allow user to attempt selecting the matching answer to displayed prompt)
  - update relevant card objects upon finishing review of specific card
  
### decks Functionality
  - Ability to create decks
  - Ability to add / remove cards from a deck
  - Hide card from deck
  
### Data Management Options
- Import CSV: Import a CSV of card data into a collection of cards
- Export CSV: Export a collection of cards to comma delimited CSV
- Migrate to Cloud: Transfer all LocalStorage cards to Firestore
- Make it Rain: Transfer all User Firestore data to LocalStorage
- Sync: keep LocalStorage and Firestore in sync with each other (user-toggle) 
    
### User Authentication
  - Implement fireauth to get auth working with application so that I can open app to users
  - tweaks to data processes to utilise user Id in the CRUD processes.
