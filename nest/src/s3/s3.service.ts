import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        this.bucketName = this.configService.get<string>('AWS_BUCKET_NAME');
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: this.configService.get<string>('ACCESS_ID'),
                secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
            },
            region: this.configService.get<string>('AWS_REGION'),
        });
    }

    async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<{ Key: string }> {
        try {
            await this.s3Client.send(
                new PutObjectCommand({
                    Bucket: this.bucketName,
                    Body: dataBuffer,
                    Key: filename,
                    ACL: 'public-read',
                }),
            );

            return { Key: filename };
        } catch (error) {
            console.log(error);
            throw new Error('File upload failed');
        }
    }

    async deletePublicFile(fileKey: string) {
        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        try {
            const deletedFile = await this.s3Client.send(command);
            return deletedFile;
        } catch (error) {
            console.log(error);
            throw new Error('File deletion failed');
        }
    }

    async downloadPublicFile(fileKey: string): Promise<Buffer> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: fileKey,
        });

        try {
            const { Body } = await this.s3Client.send(command);
            if (Body instanceof Readable) {
                return new Promise((resolve, reject) => {
                    const chunks: Buffer[] = [];
                    Body.on('data', (chunk) => chunks.push(chunk));
                    Body.on('error', reject);
                    Body.on('end', () => resolve(Buffer.concat(chunks)));
                });
            } else {
                throw new Error('Unexpected response body type');
            }
        } catch (error) {
            console.log(error);
            throw new Error('File download failed');
        }
    }
}
