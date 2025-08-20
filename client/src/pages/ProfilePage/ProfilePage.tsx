import { Button } from "@mui/material";
import { observer } from "mobx-react-lite";
import { JSX, useState } from "react";
import { useStores } from "../../store/rootStore";
import "./ProfilePage.css"
import { Picture } from "../../types/types";
import { LoadPictureModal } from "../../widgets/Modals/LoadPictureModal";
import { ChangeUserDataModal } from "../../widgets/Modals/ChangeUserDataModal";
import { useParams } from "react-router-dom";
import { PicturesGrid } from "../../widgets/PicturesGrid/PicturesGrid";

const ProfilePage = observer((): JSX.Element => {
    const { userStore } = useStores()

    const { id } = useParams()

    const [edit, setEdit] = useState(false)
    const [addPhoto, setAddPhoto] = useState(false)

    const [pictures, setPictures] = useState<Picture[]>([])

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
        }}>
            {Number(id) === userStore.id ? <div>
                <Button onClick={() => setEdit(true)}>Изменить данные пользователя</Button>
                <Button onClick={() => setAddPhoto(true)}>Добавить фотографию</Button>
            </div> : undefined}
            <ChangeUserDataModal edit={edit} setEdit={setEdit} />
            <LoadPictureModal pictures={pictures} setPictures={setPictures} setAddPhoto={setAddPhoto} addPhoto={addPhoto} />
            <PicturesGrid id={id}/>
        </div>
    );
});

export default ProfilePage;