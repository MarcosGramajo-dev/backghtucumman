import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import participants from '../db/participants.json'
import mercadopago from "mercadopago";
import fs from 'fs';

const app = express();

const corsOptions = {
    origin: ['*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Habilita el intercambio de cookies a través de las solicitudes
    optionsSuccessStatus: 204, // Para que las solicitudes OPTIONS resuelvan correctamente
};

app.use(cors(corsOptions));

const router = express.Router();

mercadopago.configure({
	access_token: "TEST-6228624431860766-022718-6803ca6d10fd708ebcc008b0e465b7b7-1243177028",
});

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

router.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
				external_reference: Number(req.body.id)
			}
		],
		back_urls: {
			"success": "http://localhost:8080/feedback",
			"failure": "http://localhost:3000/feedback",
			"pending": "http://localhost:3000/feedback"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

router.get('/participants', function (req, res) {
    const { id } = req.query;

    if (id) {
        const participant = participants.find(participant => participant.id === parseInt(id, 10));

        if (participant) {
            res.json({
                participant
            });
        } else {
            res.status(404).json({
                error: 'Participant not found'
            });
        }
    } else {
        res.json({
            participants
        });
    }
});

app.use('/.netlify/functions/server', router);
export const handler = serverless(app);

// app.listen(8080, () => {
// 	console.log("The server is now running on Port 8080");
// });
