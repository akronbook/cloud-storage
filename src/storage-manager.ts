import { WoStorage } from "./woStorage/wo-storage";
import { IStorage } from "./storage-interface";

const constructors: any = {};
constructors['wo'] = WoStorage;
export class StorageManager {
    public static CreateStorage(type: string): IStorage {
        return new constructors[type]();
    }
}
