const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
import 'dotenv/config';

export class DocumentationManager {
    public static serve = swaggerUi.serve;
    public static options = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: process.env.DOC_TITLE,
                version: "1.0.0",
                description: process.env.DOC_DESCRIPTION
            },
            servers: [{
                url: process.env.SERVER_URL_DOCS
            }
            ]
        },
        apis: ["routes/*.ts"]
    };

    static getSwaggerMiddleware() {
        return swaggerUi.setup(swaggerJsDoc(this.options));
    }
}
