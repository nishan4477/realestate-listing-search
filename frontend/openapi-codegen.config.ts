import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

export default defineConfig({
  concreteVisionClientApi: {
    from: {
      source: "url",
      url: "http://localhost:7001/swagger.yaml",
    },
    outputDir: "app/_generated/api",
    to: async (context) => {
      const filenamePrefix = "realEstateApi";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
