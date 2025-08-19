import { createContext, useContext } from "react";
import { UserStore } from "./userStore/userStore";
import { PictureStore } from "./pictureStore/pictureStore";

export class RootStore {
    userStore: UserStore
    pictureStore: PictureStore

    constructor() {
        this.userStore = new UserStore()
        this.pictureStore = new PictureStore()
    }
}

export const rootStore = new RootStore()
export const StoreContext = createContext<RootStore>(rootStore)

export const useStores = () => useContext(StoreContext)