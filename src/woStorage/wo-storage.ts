import { IStorage, StorageCredential } from "../storage-interface";
import { Subject } from 'rxjs';
export class WoStorage implements IStorage {
    constructor() {  
    }
    private _awsClient: any = null;
    public initialize(credential: StorageCredential): void {
        this._awsClient = new (globalThis as any).AWS.S3({
            endpoint: credential.apiBase,
            accessKeyId: credential.credentials.accessKeyId,
            secretAccessKey: credential.credentials.accessKeySecret,
            sessionToken: credential.credentials.securityToken,
            s3ForcePathStyle: true,
            signatureVersion: 'v2',
            region: credential.credentials.RegionalId});
    }

    public async uploadFile(credential: StorageCredential, fileBuffer: ArrayBuffer, fileName: string, progress: Subject<number>): Promise<void> {
        const key = `${credential.folder}/${fileName}`;
        let payload: any = null
        if (typeof window === 'undefined') { // This is node
            payload = Buffer.from(fileBuffer);
        }
        else {
            payload = new Int8Array(fileBuffer);
        }

        const params = {
            Body: payload,
            Bucket: credential.credentials.Bucket,
            Key: key
        };

        const options = { partSize: 5 * 1024 * 1024, queueSize: 4 };

        await this.UploadFileToS3(params, options, progress);
    }

    public getFileUrl(credential: StorageCredential, filePath: string): string {
        const params = {
            Bucket: credential.credentials.Bucket,
            Key: filePath
        };

        const result = this._awsClient.getSignedUrl('getObject', params);
        return result;
    }

    private UploadFileToS3(params: any, options: any, progressRef: Subject<number>): Promise<any> {
        const self = this;
        const uploadPromise = new Promise(function (resolve: any, reject: any): void {
            self.uploadImpl(params, options, resolve, reject).on('httpUploadProgress', function(progress: any) {
                progressRef.next(progress.loaded);
            });
        });

        return uploadPromise;
    }

    private uploadImpl(params: any, options: any, resolve: any, reject: any) {
        return this._awsClient.upload(params, options, function (err: any, data: any) {
            if (err) {
                reject(err);
                return false;
              }

              resolve(data);
              return true;
        });
    }
}
