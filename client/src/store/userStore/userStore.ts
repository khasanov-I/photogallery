import { runInAction, makeAutoObservable } from 'mobx';
import { api } from '../../api/api';

export class UserStore {
  id: number | undefined
  isLoading = false
  error = ''

  constructor() {
    makeAutoObservable(this)
  }

  async withAuthAction<T>(store: UserStore, action: () => Promise<T>) {
    store.isLoading = true;
    store.error = '';
    try {
        return await action();
    } catch (err) {
        if (err instanceof Error) {
            store.error = err.message
        }
    } finally {
        runInAction(() => {
        store.isLoading = false;
        });
    }
  }

  async login(mail: string, password: string) {
    return this.withAuthAction(this, async () => {
        const response = await api.post('/auth', {mail, password})
        runInAction(() => {
            this.id = response.data
            localStorage.setItem('id', response.data)
        })
    })
  }

  async register(mail: string, name: string, password: string) {
    return this.withAuthAction(this, async () => {
        const response = await api.post('/register', {
            mail, name, password
        })
        runInAction(() => {
            this.id = response.data
            localStorage.setItem('id', response.data)
        })
    })
}

  async changeUserData(mail?: string, name?: string, password?: string) {
    return this.withAuthAction(this, async () => {
        api.patch('/update_user', {
            mail, name, password
        })
    })
  }
}