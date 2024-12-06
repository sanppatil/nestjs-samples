import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as openpgp from 'openpgp';
import { BlobServiceClient } from '@azure/storage-blob';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GpgService {
  private publicKey: string;
  private privateKey: string;
  private passphrase: string;
  private blobServiceClient: BlobServiceClient;

  private sourceContainer: string;
  private targetContainer: string;

  constructor(private readonly configService: ConfigService) {
    const publicKeyPath = path.resolve(
      this.configService.get<string>('GPG_PUBLIC_KEY_PATH'),
    );
    const privateKeyPath = path.resolve(
      this.configService.get<string>('GPG_PRIVATE_KEY_PATH'),
    );
    this.passphrase = this.configService.get<string>('GPG_PASSPHRASE');

    // Read keys from files
    this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');

    // Azure Blob Storage Client
    const connectionString = this.configService.get<string>(
      'AZURE_STORAGE_CONNECTION_STRING',
    );
    this.blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

    // Read container names from configuration
    this.sourceContainer = this.configService.get<string>('SOURCE_CONTAINER');
    this.targetContainer = this.configService.get<string>('TARGET_CONTAINER');
  }

  // Helper to download blob content
  private async downloadBlob(
    containerName: string,
    blobName: string,
  ): Promise<string> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (
      await this.streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    return downloaded;
  }

  // Helper to upload blob content
  private async uploadBlob(
    containerName: string,
    blobName: string,
    content: string,
  ): Promise<void> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.upload(content, Buffer.byteLength(content));
  }

  // Stream-to-buffer helper
  private async streamToBuffer(
    readableStream: NodeJS.ReadableStream | null,
  ): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    return new Promise((resolve, reject) => {
      if (!readableStream) {
        reject(new Error('Readable stream is null'));
        return;
      }
      readableStream.on('data', (data) => chunks.push(data));
      readableStream.on('end', () => resolve(Buffer.concat(chunks)));
      readableStream.on('error', reject);
    });
  }

  private getEpochTimeInSeconds() {
    return Math.floor(Date.now() / 1000);
  }

  // Encrypt Blob Content
  async encryptBlob(sourceBlob: string): Promise<string> {
    const targetBlob =
      'encrypted/' +
      sourceBlob +
      '-' +
      this.getEpochTimeInSeconds() +
      '.gpg.enc';

    // Step 1: Download blob content from the source container
    const plainText = await this.downloadBlob(this.sourceContainer, sourceBlob);

    // Step 2: Encrypt content
    const publicKey = await openpgp.readKey({ armoredKey: this.publicKey });
    const encrypted = await openpgp.encrypt({
      message: await openpgp.createMessage({ text: plainText }),
      encryptionKeys: publicKey,
    });

    // Step 3: Upload encrypted content to the target container
    await this.uploadBlob(this.targetContainer, targetBlob, encrypted);

    return targetBlob;
  }

  // Decrypt Blob Content
  async decryptBlob(sourceBlob: string): Promise<string> {
    const targetBlob =
      'decrypted/' +
      sourceBlob +
      '-' +
      this.getEpochTimeInSeconds() +
      '-' +
      'plaintext';

    // Step 1: Download encrypted blob content from the source container
    const encryptedText = await this.downloadBlob(
      this.sourceContainer,
      sourceBlob,
    );

    // Step 2: Decrypt content
    const privateKey = await openpgp.readPrivateKey({
      armoredKey: this.privateKey,
    });
    const decryptedPrivateKey = await openpgp.decryptKey({
      privateKey,
      passphrase: this.passphrase,
    });

    const message = await openpgp.readMessage({
      armoredMessage: encryptedText,
    });
    const { data: decryptedText } = await openpgp.decrypt({
      message,
      decryptionKeys: decryptedPrivateKey,
    });

    // Step 3: Upload decrypted content to the target container
    await this.uploadBlob(this.targetContainer, targetBlob, decryptedText);

    return targetBlob;
  }
}
