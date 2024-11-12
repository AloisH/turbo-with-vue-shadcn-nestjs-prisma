import { OpenAPIObject } from "@nestjs/swagger";

export interface ISwaggerGetter {
  getSwagger(): Promise<OpenAPIObject>;
}
