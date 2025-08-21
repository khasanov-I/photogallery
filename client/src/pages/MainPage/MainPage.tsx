import { useState } from "react"
import { PicturesGrid } from "../../widgets/PicturesGrid/PicturesGrid"
import { Picture } from "../../types/types"

export const MainPage = () => {
    const [pictures, setPictures] = useState<Picture[]>([])
    return <PicturesGrid pictures={pictures} setPictures={setPictures} />
}