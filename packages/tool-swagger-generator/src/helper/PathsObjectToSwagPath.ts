import {
  OperationObject,
  ParameterObject,
  PathItemObject,
  PathsObject,
  ReferenceObject,
  RequestBodyObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export type THttpMethod =
  | `get`
  | `put`
  | `post`
  | `delete`
  | `options`
  | `head`
  | `patch`
  | `trace`;

export type SwagMethod = {
  httpMethod: THttpMethod;
  methodName: string;
  serviceName: string;
  path: string;
  queryParams: Array<ParameterObject> | undefined;
  pathParams: Array<ParameterObject> | undefined;
  requestBody: SchemaObject | ReferenceObject | undefined;
  response: SchemaObject | ReferenceObject | undefined;
};

export type SwagPath = {
  [key: string]: {
    serviceName: string;
    urlPrefix: string;
    swagMethods: Array<SwagMethod>;
  };
};

export class PathsObjectToSwagPath {
  constructor(private readonly pathsObject: PathsObject) {}

  public getSwagPath(): SwagPath {
    const result: SwagPath = {};
    for (const [key, value] of Object.entries(this.pathsObject)) {
      const swagMethodList = this.transformPathItemObjectToSwagMethodArray(
        key,
        value,
      );
      if (swagMethodList.length === 0) {
        continue;
      }

      if (!result[swagMethodList[0].serviceName]) {
        result[swagMethodList[0].serviceName] = {
          serviceName: swagMethodList[0].serviceName,
          urlPrefix: "will-be-set-later",
          swagMethods: [],
        };
      }

      result[swagMethodList[0].serviceName].swagMethods.push(...swagMethodList);
    }

    for (const [key, value] of Object.entries(result)) {
      value.urlPrefix = this.getUrlPrefixFromSwagMethods(value.swagMethods);
      for (const swagMethod of value.swagMethods) {
        swagMethod.path = swagMethod.path.replace(value.urlPrefix, "");
      }
    }

    return result;
  }

  private transformPathItemObjectToSwagMethodArray(
    path: string,
    pathItemObject: PathItemObject,
  ): Array<SwagMethod> {
    const result: Array<SwagMethod> = [];
    for (const [key, value] of Object.entries(pathItemObject)) {
      if (
        key === "$ref" ||
        key === "summary" ||
        key === "description" ||
        key === "parameters" ||
        key === "servers"
      ) {
        console.error(
          `Skipping pathObject: ${value} because of key = ${key} not supported`,
        );
        continue;
      }

      const operationObject = value as OperationObject;

      let methodName = "";
      let serviceName = "";
      try {
        const operationIdResult =
          this.getMethodNameAndServiceNameFromOperationId(
            operationObject.operationId,
          );
        methodName = operationIdResult.methodName;
        serviceName = operationIdResult.serviceName;
      } catch (e) {
        if (!operationObject.tags) {
          throw new Error("Unable to figure out serviceName methodName");
        }

        const splittedPath = path.split("/");
        methodName = `${key}${splittedPath[splittedPath.length - 1].charAt(0).toUpperCase() + splittedPath[splittedPath.length - 1].slice(1)}`;
        serviceName = operationObject.tags[0];
      }

      const response = this.getResponseFromResponseObject(
        operationObject.responses,
      );
      const queryAndParamsObject =
        this.getQueryAndPathParamsFromParameterObject(
          operationObject.parameters,
        );
      const bodyObject = this.getBodyObjectFromRequestBody(
        operationObject.requestBody,
      );
      const currentSwagMethod: SwagMethod = {
        httpMethod: key as THttpMethod,
        path: path,
        methodName,
        serviceName,
        response,
        queryParams: queryAndParamsObject?.queryParams,
        pathParams: queryAndParamsObject?.pathParams,
        requestBody: bodyObject,
      };
      result.push(currentSwagMethod);
    }
    return result;
  }

  private getMethodNameAndServiceNameFromOperationId(
    operationId: string | undefined,
  ) {
    if (!operationId) {
      throw new Error("OperationId not defined");
    }
    const splittedOperationId = operationId.split("_");
    return {
      serviceName: splittedOperationId[0],
      methodName: splittedOperationId[splittedOperationId.length - 1],
    };
  }

  private getResponseFromResponseObject(responsesObject: ResponsesObject) {
    if (
      !responsesObject.default &&
      !responsesObject["200"] &&
      !responsesObject["201"]
    ) {
      console.log(
        `Unable to find result of this responsesObject : ${responsesObject}, returning ANY`,
      );
      return undefined;
    }

    let responseObject = responsesObject.default as ResponseObject;
    if (!responseObject) {
      responseObject = responsesObject["200"] as ResponseObject;
    }
    if (!responseObject) {
      responseObject = responsesObject["201"] as ResponseObject;
    }

    if ((responseObject as unknown as ReferenceObject).$ref) {
      throw new Error("$ref not supported in responseObject");
    }
    if (!responseObject.content) {
      return undefined;
      throw new Error(
        `Content not defined in responseObject: ${responseObject}`,
      );
    }

    if (!responseObject.content["application/json"]) {
      throw new Error(
        `Content only support application/json for now: ${responseObject}`,
      );
    }
    if (!responseObject.content["application/json"].schema) {
      throw new Error(`No schema found!`);
    }
    return responseObject.content["application/json"].schema;
  }

  private getQueryAndPathParamsFromParameterObject(
    parametersObjects: (ParameterObject | ReferenceObject)[] | undefined,
  ) {
    if (!parametersObjects) return undefined;

    const queryParams: ParameterObject[] = [];
    const pathParams: ParameterObject[] = [];

    for (const parameterObject of parametersObjects) {
      if ((parameterObject as ReferenceObject).$ref) {
        console.error(
          `Warning: Found referenceObject in parameterObject, not support: ${parameterObject}`,
        );
      }

      const paramObject = parameterObject as ParameterObject;
      if (paramObject.in === "path") {
        pathParams.push(paramObject);
      }
      if (paramObject.in === "query") {
        queryParams.push(paramObject);
      }
    }

    return { queryParams, pathParams };
  }

  private getBodyObjectFromRequestBody(
    requestBody: ReferenceObject | RequestBodyObject | undefined,
  ) {
    if (!requestBody) return undefined;
    if ((requestBody as ReferenceObject).$ref) {
      throw new Error(`RequestBody as reference is not support ${requestBody}`);
    }

    const reqBody = requestBody as RequestBodyObject;
    if (!reqBody.content || !reqBody.content[`application/json`]) {
      throw new Error(
        `Missing content or application/json on requestBody: ${requestBody}`,
      );
    }

    return reqBody.content[`application/json`].schema;
  }

  private findLongestCommonPrefix(strs: string[]) {
    if (!strs.length) return "";

    let prefix = strs[0];

    for (let i = 1; i < strs.length; i++) {
      while (strs[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
        if (!prefix) return "";
      }
    }

    return prefix;
  }

  private getUrlPrefixFromSwagMethods(swagMethods: SwagMethod[]) {
    const longestPrefix = this.findLongestCommonPrefix(
      swagMethods.map((val) => val.path),
    );
    return longestPrefix.split("{")[0];
  }
}
