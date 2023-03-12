import { useState } from 'react';
import DataContext, { FirebaseData, LocalData } from './context/DataContext';
import {BsFolderFill, BsCloudFill} from 'react-icons/bs'

import styles from './styles/App.module.css'
import CollectionSelection from './components/CollectionSelection';

import Auth from './components/Auth';
import { User } from 'firebase/auth';

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

function App() {

	console.debug(getLocalStorageSpace())
	const [user, setUser] = useState<User>();
	const [storageMode, setStorageMode] = useState<StorageMode>(StorageMode.Local);

	const toggleStorageMode = () => {
		storageMode == StorageMode.Local 
			? setStorageMode(StorageMode.Cloud) 
			: setStorageMode(StorageMode.Local);
	}

	return (
		<div>
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
			{
				'user' && 

				<CollectionSelection />
			
				
			}
			</DataContext.Provider>
		</div>
  	)
}

export default App
