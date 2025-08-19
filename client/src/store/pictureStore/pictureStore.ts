import { runInAction, makeAutoObservable } from 'mobx';
import { api } from '../../api/api';
import { AxiosError } from 'axios';

export class PictureStore {
  isLoading = false
  error = ''
  isListEmpty = false
  supportsWebp = false

  constructor() {
    makeAutoObservable(this)
    this.initializeWebpSupport()
  }

  initializeWebpSupport() {
        const canvas = document.createElement('canvas');
        if (!canvas.getContext || !canvas.getContext('2d')) {
            return false;
        }
        
        const supports = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        if (supports) {
            runInAction(() => {
                this.supportsWebp = true
            })
        }
  }

  async withAuthAction<T>(store: PictureStore, action: () => Promise<T>) {
    store.isLoading = true;
    store.error = ''
    store.isListEmpty = false
    return await action()
  }

  async addPicture(file?: File, name?: string, userId?: number) {
    return this.withAuthAction(this, async () => {
      try {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        
        if (name) {
            formData.append('name', name);
        }
        
        if (userId) {
            formData.append('userId', userId.toString());
        }

        const result = await api.post('/pictures/create', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        console.log(result.data)
        return result.data
      } catch (err) {
        if (err instanceof AxiosError) {
            this.error = err?.response?.data.message
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
    })
  }

  async deletePicture(id: number) {
      this.error = ''
      this.isListEmpty = false
      try {
        await api.delete('/pictures/delete/' + id)
      } catch (err) {
        if (err instanceof AxiosError) {
            this.error = err?.response?.data.message
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async changePictureName(id: number, name: string) {
    this.error = ''
    this.isListEmpty = false
      try {
        await api.patch('/pictures/changeName', {
            id, name
        })
      } catch (err) {
        if (err instanceof AxiosError) {
            this.error = err?.response?.data.message
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async getAll(offset: number, search: string) {
      this.error = ''
      this.isListEmpty = false
      if (offset === 0) {
        this.isLoading = true
      }
      try {
        const response = await api.get('/pictures', {params: {
            offset,
            search
        }})
        if (response.data.length === 0) {
            runInAction(() => {
                this.isListEmpty = true
            })
        }
        return response.data
      } catch (err) {
        if (err instanceof AxiosError) {
            this.error = err?.response?.data.message
        }
      } finally {
        runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}