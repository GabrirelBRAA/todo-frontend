import type { JSX } from "react";
import styles from './style.module.css'

export function FormContainer({form, formName} : {form: JSX.Element, formName: string}){
    return <div className={styles.formcontainer}>
        <h1>{formName}</h1>
        {form}
        </div>
}