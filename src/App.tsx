import { useState } from 'react';
import DataContext, { FirebaseData, ICollections, IDataContext, LocalData } from './context/DataContext';
import {BsFolderFill, BsCloudFill} from 'react-icons/bs'

import styles from './styles/App.module.css'

import { User } from 'firebase/auth';
import Collection from './collection';

import Auth from './components/Auth';
import CardTable from './components/CardTable';
import Collections from './components/CollectionSelect';
import Review from './components/Review';
import { auth } from './util/firebase';

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
	const [storageMode, setStorageMode] = useState<StorageMode>(StorageMode.Local);
	const [mode, setMode] = useState<Mode>(Mode.Browser)
    const [collections, setCollections] = useState<ICollections>()

	const [user, setUser] = useState<User>();
	
	const [activeCollection, setActiveCollection] = useState<Collection>();
	const [active, setActive] = useState<boolean>(false);

	const handleCollectionModification = (collection: Collection, dataContext: IDataContext) => {
        setActiveCollection({...collection})
		setCollections( () => {return {...collections, [collection.id]: collection}} )
		dataContext.saveCollections(collections ?? {}, user?.email ?? "guest")
	}

	const handleDeletion = (collections: ICollections, dataContext: IDataContext) => {
		dataContext.saveCollections({...collections}, user?.email ?? "guest")
		setCollections({...collections})
	}

	const toggleStorageMode = () => {
		storageMode == StorageMode.Local 
			? setStorageMode(StorageMode.Cloud) 
			: setStorageMode(StorageMode.Local);
		setActive(false);
	}

	return (
		<>	
		<header>
			<nav>
				<div>
					<i> flashcard.ts </i>
					<p>{ user?.email ? 'Welcome back ' + user.displayName:''}</p>
				
					<div className={styles.storageToggleContainer} onClick={toggleStorageMode}>
						<h5> {StorageMode[storageMode]} Storage </h5>
						<div className={styles.storageToggleBar}> 
						{ storageMode == StorageMode.Local 
							? <BsFolderFill className={styles.storageFolderIcon}/> 
							: <BsCloudFill className={styles.storageCloudIcon} /> 
						} 
						</div>
					</div>

					{ user && <button onClick={()=> auth.signOut().then( () => setUser(undefined))}> Sign Out </button>}

				</div>
			</nav>
		</header>


			{/* Authentication */}
			{
				storageMode==StorageMode.Cloud &&
				<>
					{ !user && <Auth setUser={ (user: User) => setUser(user) }/>}
				</>
			}		
			
				<DataContext.Provider value={ storageMode == StorageMode.Local ? LocalData : FirebaseData }>
					<section>
						<Collections
							userId={user?.uid ?? "guest"}
							handleDeletion={handleDeletion}
							activeCollection={activeCollection as Collection}
							setActiveCollection={(collection: Collection)=>setActiveCollection(collection)}
							setActive={(b)=>setActive(b)}
							collections={collections ?? {}}
							setCollections={setCollections}
							storageMode={storageMode} />
					</section>
					
					<section>
					
						<span>
							<button onClick={()=>setMode(Mode.Browser)}>Browser</button>
							<button onClick={()=>setMode(Mode.Quiz)}>Review</button>
						</span>

					{
						mode == Mode.Browser 
						? activeCollection?.id && active && <>
							<h1> {activeCollection?.name} </h1> 

							<CardTable 
								collection={activeCollection as Collection}
								collections={collections ?? {}}
								handleCollectionModification={handleCollectionModification} />

						</>
						: activeCollection && activeCollection?.flashcards.length > 0 ?
						<>
						{
							activeCollection && mode == Mode.Quiz &&
							<Review collection={activeCollection} handleCollectionModification={handleCollectionModification}/>
						}
						</> : <h1> No cards to review. </h1>
					}
					</section>

				</DataContext.Provider>

		</>
  	)
}

export default App
