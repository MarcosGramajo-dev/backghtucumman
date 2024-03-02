import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const router = express.Router();

router.get('/', (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>HTML Rendering</title>
        </head>
        <body>
            <h1>Hello, this is rendered HTML!</h1>
        </body>
        </html>
    `;
    
    res.send(htmlContent);
});

app.use('/.netlify/functions/server', router);
export const handler = serverless(app);

// app.listen(8080, () => {
// 	console.log("The server is now running on Port 8080");
// });
