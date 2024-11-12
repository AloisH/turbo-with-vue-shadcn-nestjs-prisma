import { OpenAPIObject } from "@nestjs/swagger";
import { ISwaggerTypeGenerator } from "../interface/swagger-type-generator.interface";
import { SchemaObjectToTypescriptType } from "../helper/SchemaObjectToTypescriptType";
import { mkdirSync, existsSync, writeFileSync } from "fs";

export class SwaggerTypeGenerator implements ISwaggerTypeGenerator {
  constructor(
    private readonly swagger: OpenAPIObject,
    private readonly dtoPath: string,
  ) {}

  generate(): void {
    // Generate folder
    if (!existsSync(this.dtoPath)) {
      mkdirSync(this.dtoPath, { recursive: true });
    }

    const fileGenerated = [];
    for (const [key, value] of Object.entries(
      this.swagger.components?.schemas ?? {},
    )) {
      const schema = new SchemaObjectToTypescriptType(value);
      const objectType = schema.convertToObjectType();
      const type = SchemaObjectToTypescriptType.convertToType(objectType.type);

      const exportedType = `export type ${key} = ${type}`;
      const importType = objectType.externalType.map(
        (val) => `import type { ${val} } from './${val}.dto.ts';`,
      );
      const result = `${importType.join("\n")}\n\n${exportedType}`;

      fileGenerated.push(`${key}`);
      writeFileSync(`${this.dtoPath}/${key}.dto.ts`, result);
    }

    let indexFileContent = "";
    for (const file of fileGenerated) {
      indexFileContent += `export * from './${file}.dto';\n`;
    }
    writeFileSync(`${this.dtoPath}/index.ts`, indexFileContent);
  }
}
