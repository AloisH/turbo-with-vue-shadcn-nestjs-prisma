import { OpenAPIObject } from "@nestjs/swagger";
import { ISwaggerServiceGenerator } from "../interface/swagger-service-generator";
import {
  PathsObjectToSwagPath,
  SwagMethod,
} from "../helper/PathsObjectToSwagPath";
import {
  ParameterObject,
  ReferenceObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { SchemaObjectToTypescriptType } from "../helper/SchemaObjectToTypescriptType";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const neededImport = "import { type AxiosInstance } from 'axios';\n";

const functionTemplate = `public {functionName}({functionArgs}) {\n\treturn this.axios.request<{responseType}>({
    method: \`{HttpMethodName}\`,
    url: \`{url}\`,
    {extraParams}
})\n}`;

const classTemplate = `export class {serviceName}\n{\n{serviceContentStatic}\n{serviceContent}\n}`;

export class SwaggerServiceGenerator implements ISwaggerServiceGenerator {
  private externalType: string[] = [];

  constructor(
    private readonly swagger: OpenAPIObject,
    private readonly servicePath: string,
    private readonly dtoPath: string,
  ) {}

  generate(): void {
    // Generate folder
    if (!existsSync(this.servicePath)) {
      mkdirSync(this.servicePath, { recursive: true });
    }

    const swagPathHelper = new PathsObjectToSwagPath(this.swagger.paths);
    const swagPaths = swagPathHelper.getSwagPath();

    for (const [key, value] of Object.entries(swagPaths)) {
      const serviceClass = this.generateServiceClass(value);
      const addImport = neededImport + this.addImport() + "\n";
      const serviceNameWithoutController = key
        .split("Controller")[0]
        .toLowerCase();
      writeFileSync(
        `${this.servicePath}/${serviceNameWithoutController}.service.ts`,
        addImport + serviceClass,
      );
      this.externalType = [];
    }
  }

  private generateServiceClass({
    urlPrefix,
    serviceName,
    swagMethods,
  }: {
    urlPrefix: string;
    serviceName: string;
    swagMethods: SwagMethod[];
  }) {
    const serviceNameWithoutController =
      serviceName.split("Controller")[0] + "Service";
    console.log(serviceName, serviceNameWithoutController);
    const serviceContentStatic = this.generateServiceContentStatic({
      urlPrefix,
      serviceName: serviceNameWithoutController,
      swagMethods,
    });
    const serviceContent =
      this.generateServiceFunctions(swagMethods).join("\n\n");
    return this.replaceTemplateValue(classTemplate, {
      serviceName: serviceNameWithoutController,
      serviceContentStatic,
      serviceContent,
    });
  }

  private generateServiceContentStatic({
    urlPrefix,
  }: {
    urlPrefix: string;
    serviceName: string;
    swagMethods: SwagMethod[];
  }) {
    const defaultUrl = `private readonly baseUrl = \`${urlPrefix}\`;\n`;
    const constructor = `constructor(private readonly axios: AxiosInstance) {}`;
    return `${defaultUrl}\n${constructor}\n`;
  }

  private generateServiceFunctions(swagMethods: SwagMethod[]) {
    const result: string[] = [];
    for (const swagMethod of swagMethods) {
      const responseType = this.getResponseTypeFromRequestBody(
        swagMethod.response,
      );
      const functionArgs: string[] = [];
      const uriParams = this.getUriParams(swagMethod.pathParams);
      const extraParams: string[] = [];
      if (uriParams) {
        functionArgs.push(...uriParams);
      }
      const body = this.getBodyType(swagMethod.requestBody);
      if (body) {
        functionArgs.push(`data: ${body}`);
        extraParams.push("data");
      }
      const queryParams = this.getQueryParams(swagMethod.queryParams);
      if (queryParams) {
        functionArgs.push(queryParams);
        extraParams.push(`params`);
      }

      result.push(
        this.replaceTemplateValue(functionTemplate, {
          functionName: swagMethod.methodName,
          functionArgs: functionArgs.join(", "),
          responseType,
          HttpMethodName: swagMethod.httpMethod,
          url: this.transformUrlIntoUrlWithParams(swagMethod.path),
          extraParams: extraParams.join(",\n\t"),
        }),
      );
    }
    return result;
  }

  public replaceTemplateValue(
    template: string,
    replaceItems: { [key: string]: string },
  ) {
    let result = template;
    for (const [key, value] of Object.entries(replaceItems)) {
      result = result.replace(`{${key}}`, value);
    }
    return result;
  }

  private getResponseTypeFromRequestBody(
    response: SchemaObject | ReferenceObject | undefined,
  ) {
    if (!response) {
      return "void";
    }

    const objectType = new SchemaObjectToTypescriptType(
      response,
    ).convertToObjectType();
    this.externalType.push(
      ...SchemaObjectToTypescriptType.isExternalType(objectType.type),
    );
    return SchemaObjectToTypescriptType.convertToType(objectType.type);
  }

  private addImport() {
    const externalTypeNoDuplicate = this.externalType.filter((item, pos) => {
      return this.externalType.indexOf(item) == pos;
    });
    if (externalTypeNoDuplicate.length === 0) {
      return "";
    }

    return `import type { ${externalTypeNoDuplicate.join(",")} } from '${this.dtoPath}'\n`;
  }

  private transformUrlIntoUrlWithParams(url: string) {
    const splittedUrl = url.split("{");
    let result = "";
    for (let i = 0; i < splittedUrl.length; i++) {
      if (i === splittedUrl.length - 1) {
        result += splittedUrl[i];
        continue;
      }
      result += splittedUrl[i] + "${";
    }
    return `\${this.baseUrl}${result}`;
  }

  private getUriParams(
    uriParams: ParameterObject[] | undefined,
  ): string[] | undefined {
    if (!uriParams) {
      return undefined;
    }

    const result: string[] = [];
    for (const uriParam of uriParams) {
      if (!uriParam.schema) {
        continue;
      }
      const uriType = new SchemaObjectToTypescriptType(
        uriParam.schema,
      ).convertToObjectType();
      this.externalType.push(
        ...SchemaObjectToTypescriptType.isExternalType(uriType.type),
      );
      result.push(
        `${uriParam.name}: ${SchemaObjectToTypescriptType.convertToType(uriType.type)}`,
      );
    }
    return result;
  }

  private getBodyType(
    schemaObject: SchemaObject | ReferenceObject | undefined,
  ): string | undefined {
    if (!schemaObject) {
      return undefined;
    }

    const bodyType = new SchemaObjectToTypescriptType(
      schemaObject,
    ).convertToObjectType();
    this.externalType.push(
      ...SchemaObjectToTypescriptType.isExternalType(bodyType.type),
    );
    return SchemaObjectToTypescriptType.convertToType(bodyType.type);
  }

  private getQueryParams(
    queryParams: ParameterObject[] | undefined,
  ): string | undefined {
    if (!queryParams) {
      return undefined;
    }

    const querys: string[] = [];
    for (const queryParam of queryParams) {
      if (!queryParam.schema) {
        console.log("Query params without schema, skypping...");
        continue;
      }

      const queryParamType = new SchemaObjectToTypescriptType(
        queryParam.schema,
      ).convertToObjectType();
      this.externalType.push(
        ...SchemaObjectToTypescriptType.isExternalType(queryParamType.type),
      );
      querys.push(
        `${queryParam.name}${queryParam.required ? "" : "?"}: ${SchemaObjectToTypescriptType.convertToType(queryParamType.type)}`,
      );
    }

    if (querys.length === 0) {
      return ``;
    }

    return `params: { ${querys.join(", ")} }`;
  }
}
