import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {UserModule} from './user/user.module';
import {ConfigModule} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import { GeoModule } from './geo/geo.module';


@Module({
  imports: [UserModule,
    ConfigModule.forRoot({}),
    GeoModule,
    MongooseModule.forRoot(process.env.DB_URI)
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
