import { useCallback, useRef, useState } from "react";
import { PicturesGrid } from "../../widgets/PicturesGrid/PicturesGrid"
import { Stack, TextField } from "@mui/material";
import { Picture } from "../../types/types";

export const SearchPage = () => {

    const timeoutRef = useRef<NodeJS.Timeout>(null);

    const [name, setName] = useState("")

    const [pictures, setPictures] = useState<Picture[]>([])

    const onChangeName = useCallback((value: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
            setName(value)
        }, 300);
    }, []);

    return <Stack width="100%">
        <TextField fullWidth label="Введите имя фотографии" onChange={(event) => {
            if (event.target.value.length >= 3) {
                onChangeName(event.target.value)
            } else {
                onChangeName("")
            }
        }} />
        <PicturesGrid pictures={pictures} setPictures={setPictures} offs={0} name={name} />
    </Stack>
}