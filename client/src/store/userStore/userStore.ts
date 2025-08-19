import { runInAction, makeAutoObservable } from 'mobx';
import { api } from '../../api/api';
import { AxiosError } from 'axios';

export class UserStore {
  id: number | undefined
  isLoading = false
  registerError = ''
  loginError = ''
  changeDataError = ''

  constructor() {
    makeAutoObservable(this)
    this.initializeAuth()
  }

  async withAuthAction<T>(store: UserStore, action: () => Promise<T>) {
    store.isLoading = true;
    store.loginError = '';
    store.registerError = ''
    store.changeDataError = ''
    return await action()
  }

  async login(mail: string, password: string) {
    return this.withAuthAction(this, async () => {
      try {
        const response = await api.post('/users/auth', {mail, password})
        runInAction(() => {
            this.id = response.data
            localStorage.setItem('id', response.data)
        })
      } catch (err) {
        if (err instanceof AxiosError) {
            this.loginError = err?.response?.data.message
        } else {
            this.loginError = "Неизвестная ошибка"
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
    })
  }

  async register(mail: string, name: string, password: string) {
    return this.withAuthAction(this, async () => {
      try {
        const response = await api.post('/users/register', {
            mail, name, password
        })
        runInAction(() => {
            this.id = response.data
            localStorage.setItem('id', response.data)
        })
      } catch (err) {
        if (err instanceof AxiosError) {
            this.registerError = err?.response?.data.message
        } else {
            this.registerError = "Неизвестная ошибка"
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
    })
  }

  initializeAuth() {
    const id = localStorage.getItem('id')
    if (id) {
      runInAction(() => {
        this.id = Number(id)
      })
    }  
  }

  logout() {
    runInAction(() => {
      this.id = undefined
    })
    localStorage.removeItem('id')
  }

  async changeUserData(id?: number, mail?: string, name?: string, password?: string) {
    return this.withAuthAction(this, async () => {
      try {
        await api.patch('/users/update_user', {
            mail, name, password, id
        })
      } catch (err) {
        if (err instanceof AxiosError) {
            this.changeDataError = err?.response?.data.message
        } else {
            this.changeDataError = "Неизвестная ошибка"
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
    })
  }
}