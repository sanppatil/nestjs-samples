import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'chat_db',
      synchronize: true, // Use only during development
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    ChatModule,
    AuthModule,
  ],
})
export class AppModule {}
