import { Button, Modal, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import { JSX, useCallback, useState } from "react";
import { useStores } from "../../store/rootStore";
import "./ProfilePage.css"

interface ProfilePageProps {}

const ProfilePage = observer(({}: ProfilePageProps): JSX.Element => {
    const {userStore} = useStores()

    const [edit, setEdit] = useState(false)

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

    const handler = useCallback(async () => {
        await userStore.changeUserData(userStore.id, mail, name, password)
        if (!userStore.changeDataError) {
            setEdit(false)
        }
    }, [mail, name, password, userStore])
    
    return (
        <div>
            <Button onClick={() => setEdit(true)}>Изменить данные пользователя</Button>
            <Modal
                style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                open={edit}
                onClose={() => setEdit(false)}
                >
                <div className="modal-container">
                    {userStore.changeDataError ? <span style={{color: 'red'}}>{userStore.changeDataError}</span> : undefined}
                    <TextField className="input" value={name} onChange={(event) => onChangeName(event.target.value)} label="Ваше имя"/>
                    <TextField className="input" value={mail} onChange={(event) => onChangeMail(event.target.value)} label="Ваша почта" />
                    <TextField className="input" value={password} onChange={(event) => onChangePassword(event.target.value)} label="Ваш пароль" />
                    <Button onClick={handler}>Отправить</Button>
                </div>
            </Modal>
        </div>
    );
});

export default ProfilePage;