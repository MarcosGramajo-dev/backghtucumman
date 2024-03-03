import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import participants from '../db/participants.json'
import mercadopago from "mercadopago";
import fs from 'fs';

const app = express();

const corsOptions = {
  origin: 'https://ghtucuman.com.ar',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

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
        quantity: Number(req.body.quantity)
      }
    ],
    back_urls: {
      "success": "https://ghtucuman.com.ar/feedback",
      "failure": "https://ghtucuman.com.ar/feedback",
      "pending": "https://ghtucuman.com.ar/feedback"
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
      res.status(500).json({ error: 'Internal Server Error' });
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


router.get('/feedback', function (req, res) {
    if (req.query.status === 'approved') {
        // Busca el participante por su id
        const participantIndex = participants.findIndex(participant => participant.id === participant_id);

        if (participantIndex !== -1) {
            // Actualiza la cantidad de votos del participante
            participants[participantIndex].quantity_votes += quantity_votes;

            // Escribe los cambios de vuelta al archivo
            fs.writeFile('./db/participants.json', JSON.stringify(participants), 'utf-8', (err) => {
                if (err) {
                    console.error('Error writing participants file:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    // Envía la respuesta con la información del pago y el participante actualizado
                    res.json({
                        Payment: req.query.payment_id,
                        Status: req.query.status,
                        MerchantOrder: req.query.merchant_order_id,
                        UpdatedParticipant: participants[participantIndex]
                    });
                }
            });
        } else {
            res.status(404).json({
                error: 'Participant not found'
            });
        }
    } else {
        res.json({
            Payment: req.query.payment_id,
            Status: req.query.status,
            MerchantOrder: req.query.merchant_order_id,
        });
    }
});


app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
