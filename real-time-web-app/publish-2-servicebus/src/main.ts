import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @summary Execute below commands to avoid certificate errors related "Error: self-signed certificate in certificate chain" / "SELF_SIGNED_CERT_IN_CHAIN"
 *
 * $ echo quit | openssl s_client -showcerts -servername server-name.servicebus.windows.net -connect server-name.servicebus.windows.net:443 > ~/cert/server-name-servicebus-ca-certificate.pem
 * $ export NODE_EXTRA_CA_CERTS=~/cert/server-name-servicebus-ca-certificate.pem
 *
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
