import { OpenAPIObject } from "@nestjs/swagger";
import { ISwaggerGetter } from "../interface/swagger-getter.interface";

export class SwaggerGetterByUrl implements ISwaggerGetter {
  constructor(private readonly urlPath: string) {}

  async getSwagger(): Promise<OpenAPIObject> {
    const response = await fetch(`${this.urlPath}`);
    return response.json();
  }
}
