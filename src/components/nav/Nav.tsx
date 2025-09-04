import styles from './style.module.css'
import { userService } from '../../services/userService'
import { useNavigate } from '@tanstack/react-router'



export function Nav(){
    const navigate = useNavigate({from: '/dashboard'})

    async function logoffAndGoToLogin(){
        await userService.logoff()
        navigate({to: '/'})
    }

    return <div className={styles.navbar}>
        <button className={styles.logoff} onClick={logoffAndGoToLogin}>Logoff</button>
    </div>
}