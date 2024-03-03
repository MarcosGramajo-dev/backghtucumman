import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import participants from '../db/participants.json'
import mercadopago from "mercadopago";
import fs from 'fs';
import mongoose from 'mongoose';

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
  access_token: "APP_USR-4653160923834908-022517-a0194518caf3416b5ac615fb10b0eb49-302856011",
});

const uri = "mongodb+srv://Mrcos33:33163648mg@cluster0.kbauiaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri, {
    autoIndex: true,
    dbName: 'ghTucuman'
  });

const participantSchema = new mongoose.Schema({
id: {
    type: Number,
    required: true,
},
name: {
    type: String,
    required: true,
},
lastName: {
    type: String,
    required: true,
},
age: {
    type: Number,
    required: true,
},
describe: {
    type: String,
    default: '', // Valor predeterminado si no se proporciona
},
votes: {
    type: Number,
    default: 0,
},
photo: {
    type: String,
    required: true,
},
quantity_votes: {
    type: Number,
    default: 0,
},
facebook: {
    type: String,
    default: '',
},
instagram: {
    type: String,
    default: '',
},
tiktok: {
    type: String,
    default: '',
},
});

const Participant = mongoose.model('participants', participantSchema);

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

router.get('/participants', async (req, res) => {
    try {
      const { id } = req.query;
    
      if (id) {
        // Si hay un 'id', busca un participante específico
        const participant = await Participant.findOne({ id: id });
  
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
        // Si no hay 'id', obtén todos los participantes
        const participants = await Participant.find();
        res.json({
          participants
        });
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
      res.status(500).json({
        error: 'Internal Server Error',
      });
    }
  });

router.get('/feedback', async (req, res) => {
    try {
        if (req.query.status === 'approved') {
            const participant_id = parseInt(req.query.participant_id, 10);
            const quantity_votes = parseInt(req.query.quantity_votes, 10);

            const participant = await Participant.findOne({ id: participant_id });

            if (participant) {
                participant.quantity_votes += quantity_votes;

                await participant.save();

                res.json({
                    Payment: req.query.payment_id,
                    Status: req.query.status,
                    MerchantOrder: req.query.merchant_order_id,
                    UpdatedParticipant: participant
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
    } catch (error) {
        console.error('Error handling feedback:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
        });
    }
});
  


app.use('/.netlify/functions/server', router);

export const handler = serverless(app);
