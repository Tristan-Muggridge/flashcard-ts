import { useEffect, useState } from 'react';
import DataContext, { FirebaseData, ICollections, LocalData } from './context/DataContext';
import {BsFolderFill, BsCloudFill} from 'react-icons/bs'

import styles from './styles/App.module.css'
import Collections from './components/CollectionSelection';

import Auth from './components/Auth';
import { User } from 'firebase/auth';
import CardTable from './components/CardTable';
import Collection, { ICollection } from './collection';
import Flashcard from './flashcard';
import QuizSelector from './components/QuizSelector';
import MultipleChoice from './components/MultipleChoice';

function getLocalStorageSpace(){
	var allStrings: string | any[] = [];
	for(var key in window.localStorage){
		if(window.localStorage.hasOwnProperty(key)){
			allStrings.push(window.localStorage[key]);
		}
	}
	return allStrings ? 3 + ((allStrings.join('').length*16)/(8*1024)) + ' KB' : 'Empty (0 KB)';
};

enum StorageMode  {
	"Local" = "Local",
	"Cloud" = "Cloud"
}

enum Mode {
	"Browser" = "Browser",
	"Quiz" = "Quiz"
}

function App() {
	console.debug(getLocalStorageSpace())
	
	const [storageMode, setStorageMode] = useState<StorageMode>(StorageMode.Local);
	const [mode, setMode] = useState<Mode>(Mode.Browser)

	const [user, setUser] = useState<User>();
	
	const [collections, setCollections] = useState<ICollections>({});
	const [activeCollection, setActiveCollection] = useState<ICollection>();

	const handleCollectionModification = (collection: Collection) => {
        const updated = collections ?? {};
		updated[collection.id] = collection

        setCollections({ ...updated })
	}

	useEffect(()=> {
		console.debug(collections)
		if (!collections || !activeCollection) return;
		setActiveCollection({...collections[activeCollection.id]})

	}, [collections])

	useEffect(()=> {
		console.debug(activeCollection)
	}, [activeCollection])

	const toggleStorageMode = () => {
		storageMode == StorageMode.Local 
			? setStorageMode(StorageMode.Cloud) 
			: setStorageMode(StorageMode.Local);
	}

	return (
		<>
			<nav>
				<div>
					<i> flashcard.ts </i>
					<p>{'user' ? 'Welcome back User!':''}</p>
				</div>
			</nav>

			{/* Authentication */}
			{/* {user ? <p> Welcome, {user?.email}! </p> : <Auth setUser={ (user: User) => setUser(user) }/>} */}

			<div className={styles.storageToggleContainer} onClick={toggleStorageMode}>
				<h5> {StorageMode[storageMode]} Storage </h5>
				<div className={styles.storageToggleBar}> 
				{ storageMode == StorageMode.Local 
					? <BsFolderFill className={styles.storageFolderIcon}/> 
					: <BsCloudFill className={styles.storageCloudIcon} /> 
				} 
				</div>
			</div>

			<DataContext.Provider value={ LocalData }>
				
				<section>
					<Collections
						setCollections={setCollections}
						setActiveCollection={setActiveCollection}  />
				</section>

				
				<section>
				
					<span>
						<button onClick={()=>setMode(Mode.Browser)}>Browser</button>
						<button onClick={()=>setMode(Mode.Quiz)}>Review</button>
					</span>

				{
					mode == Mode.Browser 
					? <>
						<h1> {activeCollection?.name} </h1> 
 
						{ 
							activeCollection?.flashcards && 
							<CardTable 
								collection={activeCollection as Collection}
								setCollections={setCollections}
								handleCardModification={handleCollectionModification} />
						}

					  </>
					: 
					<>
					<h1> Quiz </h1>
					{
						activeCollection && 
						<QuizSelector cards={activeCollection?.flashcards as Flashcard[]}/>
					}
					{
						collections && activeCollection && mode == Mode.Quiz && 
						<MultipleChoice 
							collections={collections ? collections: {}}
							collection={activeCollection} 
							handleCollectionModification={handleCollectionModification} />
					}
					</>
				}
				</section>

			</DataContext.Provider>

		</>
  	)
}

export default App
