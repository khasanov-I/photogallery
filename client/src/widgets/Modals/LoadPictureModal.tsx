import { Button, Modal, TextField } from "@mui/material"
import { ChildModal } from "../../shared/ChildModal"
import { useStores } from "../../store/rootStore"
import { observer } from "mobx-react-lite"
import { ChangeEvent, useCallback, useRef, useState } from "react"
import { Picture } from "../../types/types"

export const LoadPictureModal = observer(({ addPhoto, setAddPhoto, setPictures, pictures}: {
    addPhoto: boolean,
    setAddPhoto: (addPhoto: boolean) => void,
    setPictures: (pictures: Picture[]) => void,
    pictures: Picture[]
}) => {

    const { pictureStore, userStore } = useStores()

    const [showPreview, setShowPreview] = useState(false)
    const [file, setFile] = useState<File>()
    const [fileName, setFileName] = useState<string>('')

    const fileRef = useRef<HTMLInputElement>(null);

    const onChangeFileName = useCallback((value: string) => {
        setFileName(value)
    }, [])

    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files[0].size > 30 * 1024 * 1024) {
                alert("Размер файла не должен быть больше 30 Мб")
                if (fileRef.current) {
                    fileRef.current.value = ""
                }
            } else {
                setFile(e.target.files[0]);
            }
        }
    }

    const addPhotoHandler = useCallback(async () => {
            const result = await pictureStore.addPicture(file, fileName, userStore.id)
            if (!pictureStore.error) {
                setAddPhoto(false)
                setPictures([result, ...pictures])
            }
        }, [file, fileName, pictureStore, pictures, setAddPhoto, setPictures, userStore.id])

    return <Modal
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={addPhoto}
        onClose={() => setAddPhoto(false)}
    >
        <div className="modal-container">
            {pictureStore.error ? <span style={{ color: 'red' }}>{pictureStore.error}</span> : undefined}
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
            >
                Загрузить файл
                <input accept="image/jpeg,image/png"
                    ref={fileRef}
                    style={{ display: 'none' }}
                    type='file'
                    onChange={onChangeFile}
                />
            </Button>
            <Button disabled={!file} onClick={() => setShowPreview(true)}>Открыть предпросмотр</Button>
            <ChildModal open={showPreview} onClose={() => setShowPreview(false)} children={
                <img style={{
                    width: "400px",
                    height: "auto"
                }} alt={file?.name} src={file ? `${URL.createObjectURL(file)}` : ''} />
            } />
            <TextField className="input" value={fileName} onChange={(event) => onChangeFileName(event.target.value)} label="Название фотографии" />
            <Button disabled={!file || !fileName} onClick={addPhotoHandler}>Отправить</Button>
        </div>
    </Modal>
})