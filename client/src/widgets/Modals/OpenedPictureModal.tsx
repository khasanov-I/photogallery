import { Button, ImageListItem, ImageListItemBar, Modal } from "@mui/material"
import { __API__ } from "../../api/api"
import { Picture } from "../../types/types"
import { useCallback } from "react"
import { useStores } from "../../store/rootStore"
import { observer } from "mobx-react-lite"

export const OpenedPictureModal = observer(({ pictureOpened, setPictureOpened, pictures }: {
    pictureOpened: undefined | { idx: number } & Picture,
    setPictureOpened: (pictureOpened: undefined | { idx: number } & Picture) => void,
    pictures: Picture[],

}) => {

    const { pictureStore } = useStores()

    const onChangeOpenedPicture = useCallback((direction: "left" | "right") => () => {
        let nextPic
        let nextIdx
        if (pictureOpened && direction === "left") {
            nextIdx = pictureOpened?.idx - 1
            nextPic = pictures[nextIdx]
            setPictureOpened({ ...nextPic, idx: nextIdx })
        } else if (pictureOpened && direction === "right") {
            nextIdx = pictureOpened?.idx + 1
            nextPic = pictures[nextIdx]
            setPictureOpened({ ...nextPic, idx: nextIdx })
        }
    }, [pictureOpened, pictures, setPictureOpened])

    return <Modal
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        open={pictureOpened !== undefined}
        onClose={() => setPictureOpened(undefined)}
    >
        <ImageListItem>
            <div style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Button onClick={() => setPictureOpened(undefined)}>Закрыть</Button>
                <div>
                    {pictures.findIndex(e => e.id === pictureOpened?.id) !== 0
                        ? <Button onClick={onChangeOpenedPicture("left")}>
                            {"<"}
                        </Button> : undefined}
                    {pictures.findIndex(e => e.id === pictureOpened?.id) !== pictures.length - 1
                        ? <Button onClick={onChangeOpenedPicture("right")}>
                            {">"}
                        </Button> : undefined}
                </div>
            </div>
            <img
                src={`${__API__}/${pictureStore.supportsWebp ? pictureOpened?.webpPath : pictureOpened?.originalPath}`}
                alt={pictureOpened?.name}
                loading="lazy"
                style={{
                    width: "100%",
                    height: "auto",
                }}
            />
            <ImageListItemBar
                title={pictureOpened?.name}
                subtitle={pictureOpened?.author.name}
            />
        </ImageListItem>
    </Modal>
})