import { ICollection } from '../collection';
import { IFlashcard } from '../flashcard';
import styles from '../styles//Collection.module.css'

export default function ({collection, content, handleClick}: {collection?: ICollection, content: any, handleClick?():void}) {
    return <div className={styles.collection} onClick={()=> handleClick ? handleClick() : console.debug(`${collection?.name}{${collection?.id}} was clicked!`)}>
        <h5> {content} </h5>
        {
            collection && collection.flashcards.length > 0 &&
            <div className={styles.preview} style={{zIndex: -1}}>
                <div className={styles.preview} style={{zIndex: -10}} />
            </div>
        }
        <div className={styles.rear} />
    </div>
}