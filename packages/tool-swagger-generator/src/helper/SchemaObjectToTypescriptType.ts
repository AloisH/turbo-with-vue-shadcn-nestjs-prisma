import {
  ReferenceObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export type ObjectType = string;

export type ComplexObjectType = {
  [key in string]: {
    required: boolean;
    type: ObjectType | ComplexObjectType | ArrayObjectType;
  };
};

export type ArrayObjectType = {
  isArray: boolean;
  type: ObjectType | ComplexObjectType | ArrayObjectType;
};

export class SchemaObjectToTypescriptType {
  public static convertToType(
    objectType: ObjectType | ComplexObjectType | ArrayObjectType,
  ): string {
    if (typeof objectType === "string") {
      return objectType;
    }

    if (objectType.isArray) {
      return `${this.convertToType((objectType as ArrayObjectType).type)}[]`;
    } else {
      const res = [];
      for (const [key, value] of Object.entries(
        objectType as ComplexObjectType,
      )) {
        res.push(
          `${key}${value.required ? "" : "?"}: ${this.convertToType(value.type)}`,
        );
      }
      return `{\n${res.join(",\n")}\n}`;
    }
  }

  public static isExternalType(
    objectType: ObjectType | ComplexObjectType | ArrayObjectType,
  ): string[] {
    if (typeof objectType === "string") {
      if (
        objectType === "string" ||
        objectType === "number" ||
        objectType === "boolean" ||
        objectType.includes(" | ")
      ) {
        return [];
      }
      return [objectType];
    }

    if (objectType.isArray) {
      return this.isExternalType((objectType as ArrayObjectType).type);
    } else {
      const res = [];
      for (const [key, value] of Object.entries(
        objectType as ComplexObjectType,
      )) {
        res.push(...this.isExternalType(value.type));
      }
      return res;
    }
  }

  private externalType: ObjectType[] = [];

  constructor(private readonly schemaObject: SchemaObject | ReferenceObject) {}

  public convertToObjectType() {
    return this.convert(this.schemaObject);
  }

  private convert(schema: SchemaObject | ReferenceObject) {
    return {
      type: this.convertSchema(schema),
      externalType: this.externalType.filter(
        (value, index) => this.externalType.indexOf(value) == index,
      ),
    };
  }

  private convertSchema(schema: SchemaObject | ReferenceObject) {
    if ((schema as ReferenceObject).$ref != null) {
      // schema is a referenceObject
      return this.convertReferenceObject(schema as ReferenceObject);
    }

    if ((schema as SchemaObject).type === "array") {
      return this.convertSchemaObjectArrayType(schema as SchemaObject);
    }

    if ((schema as SchemaObject).type === "object") {
      return this.convertSchemaObjectObjectType(schema as SchemaObject);
    }

    return this.convertSchemaObjectSimpleType(schema as SchemaObject);
  }

  private convertSchemaObjectArrayType(schema: SchemaObject): ArrayObjectType {
    if (schema.type !== "array") {
      throw new Error(
        `Impossible to convert type: ${schema.type}. expected type: 'array'`,
      );
    }

    if (!schema.items) {
      console.error(
        `Warning: Array doesn't have a items field. Swagger not proprely configured!`,
      );
      return {
        isArray: true,
        type: "any",
      };
    }

    return {
      isArray: true,
      type: this.convertSchema(schema.items),
    };
  }

  private convertSchemaObjectObjectType(
    schema: SchemaObject,
  ): ComplexObjectType {
    if (schema.type !== "object") {
      throw new Error(
        `Impossible to convert type: ${schema.type}. expected type: 'object'`,
      );
    }

    const result: ComplexObjectType = {};
    for (const [key, value] of Object.entries(schema.properties ?? {})) {
      const isRequired = schema.required?.find((val) => val === key) !== null;
      result[key] = {
        type: this.convertSchema(value),
        required: isRequired,
      };
    }

    return result;
  }

  private convertSchemaObjectSimpleType(schema: SchemaObject): ObjectType {
    if (!schema.type) {
      // if there is no type there should be a ref
      throw new Error(`No type found for object: ${schema}`);
    }
    if (schema.type === "object") {
      throw new Error(`Unable to convert simple type: ${schema.type}`);
    }

    switch (schema.type) {
      case "number":
      case "integer":
        return "number";
      case "boolean":
        return "boolean";
      case "string":
        if (schema.enum) {
          return schema.enum.map((val) => `'${val}'`).join(" | ");
        }
        return "string";
      case "object":
      case "array":
      default:
        throw new Error(`Unsuported type: ${schema.type}`);
    }
  }

  private convertReferenceObject(schema: ReferenceObject): ObjectType {
    if (!schema.$ref) {
      throw new Error(`Should have a ref ${schema}`);
    }

    const refSplitted = schema.$ref.split("/");
    this.externalType.push(refSplitted[refSplitted.length - 1]);
    return refSplitted[refSplitted.length - 1];
  }
}
