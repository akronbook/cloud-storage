import { WoStorage } from "./woStorage/wo-storage";
import { IStorage } from "./storage-interface";
import { AwsStorage } from "./awsStorage/aws-storage";

const constructors: any = {};
constructors['wo'] = WoStorage;
constructors['aws'] = AwsStorage;
export class StorageManager {
    public static CreateStorage(type: string): IStorage {
        return new constructors[type]();
    }
}
