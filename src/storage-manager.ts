import { WoStorage } from "./woStorage/wo-storage";
import { AwsStorage } from "./awsStorage/aws-storage";
import { IStorage } from "./storage-interface";

const constructors: any = {};
constructors['wo'] = WoStorage;
constructors['aws'] = AwsStorage;
export class StorageManager {
    public static CreateStorage(type: string): IStorage {
        return new constructors[type]();
    }
}
