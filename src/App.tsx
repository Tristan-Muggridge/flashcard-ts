import { useState } from 'react';
import DataContext, { FirebaseData, LocalData, IDataContext } from './context/DataContext';
import CardTable from './components/CardTable';
import FlashCardComposeForm from './components/FlashCardComposeForm';
import Flashcard from './flashcard';
import './styles/App.css'


function App() {

	const [localCards, setLocalCards] = useState<Flashcard[]>([]);
	const [dbCards, setdbCards] = useState<Flashcard[]>([]);
	const [newLocalCardPrompt, setNewLocalCardPrompt] = useState("");
	const [newDbCardPrompt, setDbNewCardPrompt] = useState("");
	const [newLocalCardAnswer, setLocalNewCardAnswer] = useState("");
	const [newDbCardAnswer, setDbNewCardAnswer] = useState("");
	
	return (
		<div className="App">
			<DataContext.Provider value={ LocalData }>
				<h1> From LocalData </h1>
				<CardTable flashcards={localCards} setFlashCards={setLocalCards}/>
				<FlashCardComposeForm 
				fields={[
					{name: "Prompt", value: newLocalCardPrompt, type:"text", handleChange:(value:string)=>{setNewLocalCardPrompt(value)}},
					{name: "Answer", value: newLocalCardAnswer, type:"text", handleChange:(value:string)=>{setLocalNewCardAnswer(value)}}
				]}
				onSubmit={(e: React.FormEvent<HTMLFormElement>, dataContext: IDataContext) => {
					e.preventDefault(); 
					const formElements = e.currentTarget.elements as any;
					const card = new Flashcard(formElements.Prompt.value, formElements.Answer.value);
					dataContext?.create(card).then(card => setLocalCards([card, ...localCards]));
					
					setNewLocalCardPrompt('');
					setLocalNewCardAnswer('');

					formElements.Prompt.focus();
				}}
				/>
			</DataContext.Provider>
			<DataContext.Provider value={ FirebaseData }>
				<h1> From Firebase </h1>
				<CardTable flashcards={dbCards} setFlashCards={setdbCards}/>
				<FlashCardComposeForm 
				fields={[
					{name: "Prompt", value: newDbCardPrompt, type:"text", handleChange:(value:string)=>{setDbNewCardPrompt(value)}},
					{name: "Answer", value: newDbCardAnswer, type:"text", handleChange:(value:string)=>{setDbNewCardAnswer(value)}}
				]}
				onSubmit={(e: React.FormEvent<HTMLFormElement>, dataContext: IDataContext) => {
					e.preventDefault(); 
					const formElements = e.currentTarget.elements as any;
					const card = new Flashcard(formElements.Prompt.value, formElements.Answer.value);
					dataContext?.create(card).then(card => setdbCards([card, ...dbCards]));
					
					setDbNewCardPrompt('');
					setDbNewCardAnswer('');
					formElements.Prompt.focus();
				}}
				/>
			</DataContext.Provider>
		</div>
  	)
}

export default App
