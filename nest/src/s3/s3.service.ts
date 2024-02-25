import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
    constructor(private configService: ConfigService) {}

    bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
    s3 = new S3({
        accessKeyId: this.configService.get<string>('ACCESS_ID'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
    });

    async uploadPublicFile(dataBuffer: Buffer, filename: string) {
        try {
            const uploadResult = await this.s3
                .upload({
                    Bucket: this.bucketName,
                    Body: dataBuffer,
                    Key: `${filename}`,
                    ACL: 'public-read',
                    ContentDisposition: 'inline',
                })
                .promise();

            return uploadResult;
        } catch (error) {
            console.log(error);
        }
    }

    async deletePublicFile(fileKey: string) {
        try {
            const deletedFile = await this.s3
                .deleteObject({
                    Bucket: this.bucketName,
                    Key: fileKey,
                })
                .promise();

            return deletedFile;
        } catch (error) {
            console.log(error);
        }
    }

    async downloadPublicFile(fileKey: string): Promise<Buffer> {
        try {
            const file = await this.s3
                .getObject({
                    Bucket: this.bucketName,
                    Key: fileKey,
                })
                .promise();

            return file.Body as Buffer;
        } catch (error) {
            console.log(error);
            throw new Error('File download failed');
        }
    }
}
