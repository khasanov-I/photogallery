import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { JSX, useCallback, useState } from "react";
import { useStores } from "../../store/rootStore";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {}

const LoginPage = observer(({}: LoginPageProps): JSX.Element => {
    const {userStore} = useStores()
    const navigate = useNavigate()

    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')

    const onChangeMail = useCallback((value: string) => {
        setMail(value)
    }, [])

    const onChangePassword = useCallback((value: string) => {
        setPassword(value)
    }, [])

    const onLogin = useCallback(async () => {
        await userStore.login(mail, password)
        if (!userStore.loginError) {
            navigate('/')
        }
    }, [mail, password, userStore, navigate])

    return (
        <div className="register-page">
            <div className="auth-container">
                {userStore.loginError ? <span style={{color: 'red'}}>{userStore.loginError}</span> : undefined}
                <TextField value={mail} onChange={(event) => onChangeMail(event.target.value)} fullWidth label="Ваша почта" />
                <TextField value={password} onChange={(event) => onChangePassword(event.target.value)} fullWidth label="Ваш пароль" />
                <Button onClick={onLogin} fullWidth size="large" variant="outlined">Авторизация</Button>
            </div>
        </div>
    )});

export default LoginPage;