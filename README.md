## What problem is cloud-storage aims to solve?
You are building a browser-based or NodeJS application. You need to store some data in the cloud storage. But there are many challenges a developer will soon face when trying to write the code:
- Different cloud storage has different APIs. For example, Azure uses SAS tokens for accessing the Azure Storage. Amazon uses AWS SDK to generate pre-signed URLs for acessing S3 storage. Aliyun uses its own "Object Storage Service" that are subtly different from AWS. As a developer, how to support different storage APIs and to avoid deep learning curve on each different platform?
- Even on the same cloud storage platform (e.g. AWS), there are potentially multiple ways of accessing the cloud storage. For example, AWS offers the ability to connect API Gateway to an AWS S3 bucket (https://www.youtube.com/watch?v=7T5VbMEJStQ&t=57s), thus allowing developers to upload files to AWS S3 bucket via simple REST APIs. But there is a caveat: the maximum payload size is 10M, thus the solution is not feasible for managing common video files, or large files in general.

In short, it is not trivial to write storage-related code that is simple, secure and scalable.

## cloud-storage library to the rescue
This is a javascript library that helps you to simply the development of cloud storage. It aims to support all common cloud storage APIs. Currently, it supports:
- AWS S3
- WO Cloud

The library chooses to use pre-signed URLs (vs. REST APIs) for reading and writing files. The thought is to avoid payload size limit due to REST API restrictions on most cloud storage platforms.

## How to use it?
- Install the SDK
 * npm install @akronbook/cloud-storage --save
 * npm install rxjs --save-dev

- Make sure that globals are properly defined. For example, cloud-storage assumes that AWS global is defined by the caller, thus if you are going to make use cloud-storage in a Node.JS project, make sure to set up the AWS global object like this:
```
import AWS from 'aws-sdk';
(globalThis as any).AWS = AWS;
```

- Write your code to upload files
```
import {StorageManager} from "@akronbook/cloud-storage";
import { Subject } from 'rxjs'; 

const storageCredential: StorageCredential = {
    "storageType": "aws",
    "apiBase": "",
    "folder": "YOUR_FOLDER_IN_THE_BUCKET",
    "credentials": {
        "AccessKeyId": "YOUR_AWS_ACCESS_KEY",
        "SecretAccessKey": "YOUR_AWS_SECRET",
        "SessionToken": "YOUR_SESSION_TOKEN",
        "Expiration": "2023-02-15T06:15:59.000Z",
        "RegionalId": "YOUR_REGION_ID",
        "Bucket": "YOUR_BUCKET_NAME"
    }
};

const storage = StorageManager.CreateStorage('aws');
const subject = new Subject<number>();
subject.subscribe({
    next: (v) => console.log(`bytes uploaded=${v}`),
});
await storage.uploadFile(storageCredential, byteArray, 'myfile.txt', subject);
```

- Write your code to download files
```
const fileUrl = storage.getFileUrl(storageCredential, 'myfile.txt');
// Now you can use the fileUrl to download the file
```

## Notes
Currently, the supported storageTypes are:
- aws
- wo

The token format

## Future development
We will add supports to some other storage types:
- azure
- oss (i.e. aliyun cloud storage)

We will also add supports to:
- delete files
- check whether an file exists or not


