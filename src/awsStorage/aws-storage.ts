import { IStorage, StorageCredential } from "../storage-interface";
import { Subject } from 'rxjs';

export class AwsStorage implements IStorage {
    private _awsClient: any = null;
    public initialize(credential: StorageCredential): void {
        this._awsClient = new (globalThis as any).AWS.S3({
            credentials: {
            accessKeyId: credential.credentials.AccessKeyId,
            secretAccessKey: credential.credentials.SecretAccessKey,
            bucket: credential.credentials.Bucket,
            sessionToken: credential.credentials.SessionToken,
            secure: true
        },
        region: credential.credentials.RegionalId});
    }

    public async uploadFile(credential: StorageCredential, fileBuffer: ArrayBuffer, fileName: string, progress: Subject<number>): Promise<void> {
        const key = `${credential.folder}/${fileName}`;
        let payload: any = null;
        if (typeof window === 'undefined') { // This is node
            payload = Buffer.from(fileBuffer);
        }
        else {
            payload = new Int8Array(fileBuffer);
        }

        const params = {
            Body: payload,
            Bucket: this._awsClient.config.credentials.bucket,
            Key: key
        };

        const options = { partSize: 1000 * 1024 * 1024, queueSize: 4 };
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
            self._awsClient.upload(params, options, function (err: any, data: any): void {
                if (err) {
                    reject(err);
                }
                else {

                    resolve(data);
                }
            });
        });

        return uploadPromise;
    }
}
