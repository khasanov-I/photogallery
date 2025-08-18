import { createContext, useContext } from "react";
import { UserStore } from "./userStore/userStore";

export class RootStore {
    userStore: UserStore

    constructor() {
        this.userStore = new UserStore()
    }
}

export const rootStore = new RootStore()
export const StoreContext = createContext<RootStore>(rootStore)

export const useStores = () => useContext(StoreContext)