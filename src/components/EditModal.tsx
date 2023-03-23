
import styles from '../styles/EditModal.module.css'
import { BsXLg } from "react-icons/bs"
import { useState } from 'react'

export default function EditModal ({initialObject, handleSubmit, openState}: {initialObject: any, handleSubmit(e:any):void, openState(open: boolean):void}) {

    const [output, setOuptut] = useState(initialObject)

    const closeModal = () => openState(false)

    const handleOnChange = (e: any, property: string) => {
        const updated: any = output; 
        updated[property] = e.target.value; setOuptut({...updated})
    }

    return initialObject ?  (
        <div className={styles.editModal}>
            <div className={styles.close} onClick={closeModal}> <BsXLg /> </div>
            
            <form onSubmit={(e: any) => {e.preventDefault(); handleSubmit(output); closeModal();}}>
                
                {
                    initialObject && Object.keys(initialObject).map( (property:string) => { return(
                        <>
                            {initialObject[property] && <label htmlFor={`${property}`}>{property[0].toUpperCase()+property.slice(1)}</label>}
                            {initialObject[property] && <input type="text" id={`${property}`} value={output[property]} onChange={(e: any) => handleOnChange(e, property)} />}
                        </>
                    )})
                }
                
                <button type='submit'> Save Changes </button>
            </form>
        </div>
    ) : <></>
}