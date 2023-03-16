import { useContext, useEffect, useState } from 'react';
import DataContext, { FirebaseData, ICollections, LocalData } from './context/DataContext';
import {BsFolderFill, BsCloudFill} from 'react-icons/bs'

import styles from './styles/App.module.css'

import { User } from 'firebase/auth';
import Collection, { ICollection } from './collection';

import Auth from './components/Auth';
import CardTable from './components/CardTable';
import Collections from './components/CollectionSelect';
import Review from './components/Review';

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
	
	const [activeCollection, setActiveCollection] = useState<ICollection>();
	const [active, setActive] = useState<boolean>(false);

	const handleCollectionModification = (collection: Collection) => {
        setActiveCollection({ ...collection })
	}

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

			<DataContext.Provider value={ storageMode == StorageMode.Local ? LocalData : FirebaseData }>
				<section>
					<Collections
						activeCollection={activeCollection as ICollection}
						setActiveCollection={(collection: Collection)=>setActiveCollection(collection)}
						setActive={(b)=>setActive(b)} 
						storageMode={storageMode} />
				</section>
				
				<section>
				
					<span>
						<button onClick={()=>setMode(Mode.Browser)}>Browser</button>
						<button onClick={()=>setMode(Mode.Quiz)}>Review</button>
					</span>

				{
					mode == Mode.Browser 
					? active && <>
						<h1> {activeCollection?.name} </h1> 

						<CardTable 
							collection={activeCollection as Collection}
							handleCollectionModification={handleCollectionModification} />

					  </>
					: activeCollection && activeCollection?.flashcards.length > 0 ?
					<>
					{
						active && activeCollection && mode == Mode.Quiz && active &&
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
