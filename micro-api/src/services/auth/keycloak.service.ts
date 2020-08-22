import { Injectable, OnModuleInit } from '@nestjs/common';
import KcAdminClient from 'keycloak-admin';
import UserRepresentation from 'keycloak-admin/lib/defs/userRepresentation';
import { redisStore } from 'src/adapters/redis-io.adapter';
import * as Keycloak from 'keycloak-connect';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/models/user.model';

@Injectable()
export class AuthService implements OnModuleInit {
  private keycloakClient = new Keycloak({ store: redisStore });
  private kcAdminClient;
  private keycloakConfig;


  constructor() {
    // this.keycloakConfig = JSON.parse(process.env.KEYCLOAK_JSON);
    // this.kcAdminClient = new KcAdminClient({
    //   baseUrl: this.keycloakConfig['auth-server-url'],
    //   realmName: this.keycloakConfig['realm'],
    // });
  }



  async onModuleInit(): Promise<void> {
    // await this.kcAdminClient.auth({
    //   grantType: 'client_credentials',
    //   clientId: this.keycloakConfig['resource'],
    //   clientSecret: this.keycloakConfig['credentials']['secret'],
    // });
  }

  async createRemoteUser(data: UserDto): Promise<User> {
    const id = await this.kcAdminClient.users.create({
      ...data,
      enabled: true,
    });
    const userRepresentation: UserRepresentation = await this.kcAdminClient.users.findOne(
      id,
    );
    return new User({
      id: userRepresentation.id,
      name: `${userRepresentation.firstName} ${userRepresentation.lastName}`,
      email: userRepresentation.email,
    });
  }

  async validateToken(token: string): Promise<boolean> {
    const result = await this.keycloakClient.grantManager.validateAccessToken(
      token,
    );
    return result ? true : false;
  }
}
