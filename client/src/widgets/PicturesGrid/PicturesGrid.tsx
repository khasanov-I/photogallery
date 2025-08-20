import { Button, ImageList, ImageListItem, ImageListItemBar, Link } from "@mui/material"
import { ChangePictureNameModal } from "../Modals/ChangePictureNameModal"
import { OpenedPictureModal } from "../Modals/OpenedPictureModal"
import { observer } from "mobx-react-lite"
import { useCallback, useEffect, useState } from "react"
import { useStores } from "../../store/rootStore"
import { Picture } from "../../types/types"
import { __API__ } from "../../api/api"
import "./styles.css"

export const PicturesGrid = observer(({id}: {id?: string}) => {

    const { userStore, pictureStore } = useStores()

    const [editPictureName, setEditPictureName] = useState<undefined | number>()

    const [pictureOpened, setPictureOpened] = useState<undefined | { idx: number } & Picture>()
    const [canLoadMore, setCanLoadMore] = useState(true)

    const [offset, setOffset] = useState(10)

    const [pictures, setPictures] = useState<Picture[]>([])

    const deleteHandler = useCallback((id: number) => async () => {
        await pictureStore.deletePicture(id)
        const newPictures = [...pictures].filter(e => e.id !== id)
        setPictures(newPictures)
    }, [pictureStore, pictures])

    const loadMorePictures = useCallback(async (offset: number, id?: string) => {
        const result = await pictureStore.getAll(offset, '', id);
        if (result.length < 10) {
            setCanLoadMore(false)
        }
        setPictures(prev => [...prev, ...result]);
    }, [pictureStore])

    useEffect(() => {
        const loadPictures = async (id?: string) => {
            const result = await pictureStore.getAll(0, '', id);
            if (result.length < 10) {
                setCanLoadMore(false)
            }
            setPictures(result);
        };
        loadPictures(id);
    }, [id, pictureStore, userStore.id]);

    return <div style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
    }}>
        {pictureStore.isLoading
            ? <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>Загрузка...</div> :
            <ImageList className="image-list" style={{ overflowY: "visible" }} variant="masonry" cols={3} gap={8}>
                {pictures.map((item, index) => (
                    <ImageListItem key={item.id}>
                        <img
                            style={{ cursor: "pointer" }}
                            onClick={() => setPictureOpened({ ...item, idx: index })}
                            srcSet={`${__API__}/${pictureStore.supportsWebp ? item.webpPath : item.originalPath}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${__API__}/${pictureStore.supportsWebp ? item.webpPath : item.originalPath}?w=248&fit=crop&auto=format`}
                            alt={item.name}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.name}
                            subtitle={<Link href={`/profile/${item.author.id}`}>{`@${item.author.name}`}</Link>}
                            actionIcon={
                                <>
                                    {Number(id) === userStore.id ? <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                                        <Button onClick={() => setEditPictureName(item.id)} style={{ fontSize: "12px" }}>Ред.</Button>
                                        <Button onClick={deleteHandler(item.id)} style={{ fontSize: "12px" }}>Удалить</Button>
                                    </div> : undefined}
                                    <ChangePictureNameModal pictures={pictures} setPictures={setPictures} setEditPictureName={setEditPictureName} editPictureName={editPictureName} />
                                    <OpenedPictureModal pictureOpened={pictureOpened} setPictureOpened={setPictureOpened} pictures={pictures} />
                                </>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        }
        {!canLoadMore && offset === 0 && pictures.length === 0 ?
            <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center" }}>Фотографии не найдены</div>
            : <div style={{ paddingBottom: "20px", width: "100%", display: "flex", justifyContent: "center" }}>
                {canLoadMore ? <Button onClick={async () => {
                    setOffset(prev => prev + 10)
                    await loadMorePictures(offset, id)
                }}>Загрузить еще 10</Button> : undefined}
            </div>}
    </div>
})