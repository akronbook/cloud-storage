
import { Subject } from 'rxjs';

export interface StorageCredential {
    storageType: string; // Storage type (wo, aws, etc)
    apiBase: string; // Storage URL base
    folder: string; // Storage folder base for the resource
    credentials: any; // Token
}

export interface IStorage {
    initialize(credential: StorageCredential):void;
    uploadFile(credential: StorageCredential, fileBuffer: ArrayBuffer, fileName: string, progress: Subject<number>): Promise<void>;
    getFileUrl(credential: StorageCredential, filePath: string): string;
}