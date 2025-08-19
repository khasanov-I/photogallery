import { Button, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import { observer } from "mobx-react-lite";
import { JSX, useCallback, useEffect, useState } from "react";
import { useStores } from "../../store/rootStore";
import "./ProfilePage.css"
import { Picture } from "../../types/types";
import { __API__ } from "../../api/api";
import { ChangePictureNameModal } from "../../widgets/Modals/ChangePictureNameModal";
import { OpenedPictureModal } from "../../widgets/Modals/OpenedPictureModal";
import { LoadPictureModal } from "../../widgets/Modals/LoadPictureModal";
import { ChangeUserDataModal } from "../../widgets/Modals/ChangeUserDataModal";

const ProfilePage = observer((): JSX.Element => {
    const {userStore, pictureStore} = useStores()

    const [edit, setEdit] = useState(false)
    const [addPhoto, setAddPhoto] = useState(false)
    const [editPictureName, setEditPictureName] = useState<undefined | number>()
    
    const [pictureOpened, setPictureOpened] = useState<undefined | {idx: number} & Picture>()
    const [canLoadMore, setCanLoadMore] = useState(true)

    const [offset, setOffset] = useState(0)

    const [pictures, setPictures] = useState<Picture[]>([])

    const loadPictures = useCallback(async (offset: number) => {
            const result = await pictureStore.getAll(offset, '');
            if (result.length < 10) {
                setCanLoadMore(false)
            }
            setPictures(prev => [...prev, ...result]);
    }, [pictureStore]);

    const deleteHandler = useCallback((id: number) => async () => {
        await pictureStore.deletePicture(id)
        const newPictures = [...pictures].filter(e => e.id !== id)
        setPictures(newPictures)
    }, [pictureStore, pictures])

    useEffect(() => {
        loadPictures(offset);
    }, [loadPictures, offset, pictureStore, userStore.id]);
    
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
        }}>
            <div>
                <Button onClick={() => setEdit(true)}>Изменить данные пользователя</Button>
                <Button onClick={() => setAddPhoto(true)}>Добавить фотографию</Button>
            </div>
            <ChangeUserDataModal edit={edit} setEdit={setEdit} />
            <LoadPictureModal pictures={pictures} setPictures={setPictures} setAddPhoto={setAddPhoto} addPhoto={addPhoto} />
            {pictureStore.isLoading 
                ? <div style={{display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>Загрузка...</div> :
                <ImageList className="image-list" style={{overflowY: "visible"}} variant="masonry" cols={3} gap={8}>
                    {pictures.map((item, index) => (
                        <ImageListItem key={item.id}>
                            <img
                                style={{cursor: "pointer"}}
                                onClick={() => setPictureOpened({...item, idx: index})}
                                srcSet={`${__API__}/${pictureStore.supportsWebp ? item.webpPath : item.originalPath}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                src={`${__API__}/${pictureStore.supportsWebp ? item.webpPath : item.originalPath}?w=248&fit=crop&auto=format`}
                                alt={item.name}
                                loading="lazy"
                            />
                            <ImageListItemBar
                                title={item.name}
                                subtitle={item.author.name}
                                actionIcon={
                                    <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                        <Button onClick={() => setEditPictureName(item.id)} style={{fontSize: "12px"}}>Ред.</Button>
                                        <Button onClick={deleteHandler(item.id)} style={{fontSize: "12px"}}>Удалить</Button>
                                        <ChangePictureNameModal pictures={pictures} setPictures={setPictures} setEditPictureName={setEditPictureName} editPictureName={editPictureName}/>
                                        <OpenedPictureModal pictureOpened={pictureOpened} setPictureOpened={setPictureOpened} pictures={pictures} />
                                    </div>
                                }
                            />
                        </ImageListItem>
                    ))}
                    </ImageList>
                }
                {!canLoadMore && offset === 0 ? 
                <div style={{display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center"}}>Фотографии не найдены</div>
                : <div style={{paddingBottom: "20px", width: "100%", display: "flex", justifyContent: "center"}}>
                    {canLoadMore ? <Button onClick={async () => {
                        setOffset(prev => prev + 10)
                    }}>Загрузить еще 10</Button> : undefined}
                </div>}
        </div>
    );
});

export default ProfilePage;