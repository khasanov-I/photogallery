export type Picture = {
    id: number;
    name: string;
    originalPath: string;
    webpPath: string;
    userId: number;
    author: {
        name: string
    }
}