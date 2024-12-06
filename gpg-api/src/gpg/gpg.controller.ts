import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { GpgService } from './gpg.service';

@ApiTags('gpg')
@Controller('gpg')
export class GpgController {
  constructor(private readonly gpgService: GpgService) {}

  @ApiOperation({ summary: 'Encrypt a blob in Azure Storage' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceBlob: { type: 'string', example: 'plain-text-blob.txt' },
      },
    },
  })
  @Post('encrypt-blob')
  async encryptBlob(
    @Body()
    body: {
      sourceBlob: string;
    },
  ) {
    const { sourceBlob } = body;
    const targetBlob = await this.gpgService.encryptBlob(sourceBlob);
    return { message: 'Encryption completed successfully.', targetBlob };
  }

  @ApiOperation({ summary: 'Decrypt a blob in Azure Storage' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sourceBlob: { type: 'string', example: 'encrypted-blob.txt' },
      },
    },
  })
  @Post('decrypt-blob')
  async decryptBlob(
    @Body()
    body: {
      sourceBlob: string;
    },
  ) {
    const { sourceBlob } = body;
    const targetBlob = await this.gpgService.decryptBlob(sourceBlob);
    return { message: 'Decryption completed successfully.', targetBlob };
  }
}
