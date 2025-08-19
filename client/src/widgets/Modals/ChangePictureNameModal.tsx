import { Button, Modal, TextField } from "@mui/material"
import { useCallback, useState } from "react"
import { Picture } from "../../types/types"
import { useStores } from "../../store/rootStore"
import { observer } from "mobx-react-lite"
import "./styles.css"

export const ChangePictureNameModal = observer(({editPictureName, setEditPictureName, pictures, setPictures}: {
    editPictureName: undefined | number,
    setEditPictureName: (arg: undefined | number) => void,
    pictures: Picture[],
    setPictures: (pictures: Picture[]) => void
}) => {

    const [pictureName, setPictureName] = useState('')

    const {pictureStore} = useStores()

    const onChangePictureName = useCallback((value: string) => {
        setPictureName(value)
    }, [])

    const sendPictureNameHandler = useCallback((id: number) => async () => {
            await pictureStore.changePictureName(id, pictureName)
            setEditPictureName(undefined)
            setPictures([...pictures.map(e => {
                if (e.id === id) {
                    e.name = pictureName
                }
                return e
            })])
            setPictureName('')
    }, [pictureName, pictureStore, pictures, setEditPictureName, setPictures])

    return <Modal
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={editPictureName !== undefined}
        onClose={() => setEditPictureName(undefined)}
    >
        <div className="modal-container">
            <TextField className="input" value={pictureName} onChange={(event) => onChangePictureName(event.target.value)} label="Название картинки" />
            <Button onClick={sendPictureNameHandler(editPictureName!)}>Отправить</Button>
        </div>
    </Modal>
})