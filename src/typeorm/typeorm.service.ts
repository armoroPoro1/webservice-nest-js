import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import entities from '.';

@Injectable()
export class TypeOrmConfigService
  implements OnModuleInit, TypeOrmOptionsFactory
{
  async onModuleInit(): Promise<any> {
    await this.databaseSetup();
  }

  private async databaseSetup() {
    this.createTypeOrmOptions;
  }

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const regex = new RegExp(
      'postgres:(?=.)(?:(?:/$)|//(?:(?<user>[^:\\n\\r]+)(?::(?<pass>[^@\\n\\r]+))@)?(?<host>[^:/\\r\\n]+)(?::(?<port>\\d+))?/)?(?<db>.+)?',
      'gm',
    );
    const str = process.env.DATABASE_URL;
    const matchDatabase = regex.exec(str);
    const username = matchDatabase[1];
    const password = matchDatabase[2];
    const host = matchDatabase[3];
    const port = Number(matchDatabase[4]);
    const database = matchDatabase[5];
    return {
      type: 'postgres',
      host: host,
      port: port,
      database: database,
      username: username,
      password: password,
      entities: entities,
      keepConnectionAlive: false,
      synchronize: true,
    };
  }
}
