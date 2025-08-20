import { createContext, useContext } from "react";
import { UserStore } from "./userStore/userStore";
import { PictureStore } from "./pictureStore/pictureStore";
import { SearchUserStore } from "./searchUserStore/searchUserStore";

export class RootStore {
    userStore: UserStore
    pictureStore: PictureStore
    searchUserStore: SearchUserStore

    constructor() {
        this.userStore = new UserStore()
        this.pictureStore = new PictureStore()
        this.searchUserStore = new SearchUserStore()
    }
}

export const rootStore = new RootStore()
export const StoreContext = createContext<RootStore>(rootStore)

export const useStores = () => useContext(StoreContext)