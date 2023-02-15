import { useContext } from "react"
import { BsCheck } from 'react-icons/bs'

import DataContext, { IDataContext } from "../context/DataContext"

import styles from '../styles/FlashCardComposeForm.module.css'

interface IField {
    name: string
    value: string
    type: string
    handleChange(value: string):any
}

interface IProps {
    fields:IField[]
    onSubmit(form: React.FormEvent<HTMLFormElement>, dataContext: IDataContext): any
}

export default function ({fields, onSubmit}: IProps) {
    const dataContext = useContext(DataContext)
    
    const labels = [];
    const values = [];

    fields.forEach(field => {labels.push(field.name); values.push(field.value)})

    return (
        <form className={styles.cardForm} onSubmit={(e) => {if (dataContext) onSubmit(e, dataContext)}}>
            {
                fields.map( (field, index) => (<>
                    <label style={{gridRow: 1}} key={`${index}-label-${field.name}`} htmlFor={field.name}>{field.name}: </label>
                    <input style={{gridRow: 2}} key={`${index}-input-${field.name}`} id={field.name} type={field.type} value={field.value} onChange={(e) => field.handleChange(e.target.value)}/>
                </>))
            }
            <button style={{gridColumn: 3, gridRow: 2}} type="submit"> <BsCheck /> </button>
        </form>
    )

}