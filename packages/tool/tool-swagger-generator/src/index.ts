import { CleanUp } from "./swagger/CleanUp";
import { SwaggerGetterByUrl } from "./swagger/SwaggerGetterByUrl";
import { SwaggerServiceGenerator } from "./swagger/SwaggerServiceGenerator";
import { SwaggerTypeGenerator } from "./swagger/SwaggerTypeGenerator";

async function main() {
  const swaggerGetter = new SwaggerGetterByUrl(
    "http://localhost:62002/api-json",
  );
  const swagger = await swaggerGetter.getSwagger();
  const swaggerTypeGenerator = new SwaggerTypeGenerator(
    swagger,
    "./../../frontend/frontend-administration-api/src/dto",
  );
  swaggerTypeGenerator.generate();
  const swaggerServiceGenerator = new SwaggerServiceGenerator(
    swagger,
    "./../../frontend/frontend-administration-api/src/service",
    "../dto",
  );
  swaggerServiceGenerator.generate();

  const cleanUp = new CleanUp([
    "./../../frontend/frontend-administration-api/src",
  ]);
  cleanUp.cleanUp();
}

main();
