import { InjectionToken } from "@angular/core";

export interface ServerConfigI {
    apiPath: string
}

export const SERVER_CONFIG = new InjectionToken<ServerConfigI>('server.config',{
    providedIn: 'root',
    factory: () => SERVER_CONFIG_OBJECT
});

export const SERVER_CONFIG_OBJECT: ServerConfigI = {
    apiPath: 'http://localhost:3000'
}