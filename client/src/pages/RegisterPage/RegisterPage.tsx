import { JSX, useCallback, useState } from "react";
import {Button, TextField} from "@mui/material"
import './RegisterPage'
import './RegisterPage.css'
import { observer } from "mobx-react-lite";
import { useStores } from "../../store/rootStore";
import { useNavigate } from "react-router-dom";

interface RegisterPageProps {}

const RegisterPage = observer(({}: RegisterPageProps): JSX.Element => {

    const {userStore} = useStores()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')

    const onChangeName = useCallback((value: string) => {
        setName(value)
    }, [])

    const onChangeMail = useCallback((value: string) => {
        setMail(value)
    }, [])

    const onChangePassword = useCallback((value: string) => {
        setPassword(value)
    }, [])

    const onRegister = useCallback(async () => {
        await userStore.register(mail, name, password)
        if (!userStore.registerError) {
            navigate('/')
        }
    }, [mail, name, password, userStore, navigate])

    return (
        <div className="register-page">
            <div className="auth-container">
                {userStore.registerError ? <span style={{color: 'red'}}>{userStore.registerError}</span> : undefined}
                <TextField value={name} onChange={(event) => onChangeName(event.target.value)} fullWidth label="Ваше имя"/>
                <TextField value={mail} onChange={(event) => onChangeMail(event.target.value)} fullWidth label="Ваша почта" />
                <TextField value={password} onChange={(event) => onChangePassword(event.target.value)} fullWidth label="Ваш пароль" />
                <Button disabled={!name || !password || !mail} onClick={onRegister} fullWidth size="large" variant="outlined">Регистрация</Button>
            </div>
        </div>
    );
});

export default RegisterPage;