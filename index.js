const express = require('express');
const stripe = require('stripe')("sk_test_51IjRN9BDBW0hZ8SlZrhIsFHojU6pFy1KJd4nRb4ZJEmHNba2ekyrG8cWUnRvrGjEbSxL8cLFDACyBK1izf4hFPRF00LqIWqXaZ");
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT|| 5000;

const uri = "mongodb+srv://IgorLima:Lima2529@payments.vkgg5og.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.get('/no-sleep', (req, res) => {
  res.send("Server is awake")
})



const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

const PaymentSchema = {
  paymentId: String,
  created: Date
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "igor.filipe.lima@gmail.com",
    pass: "siacbmtqycytibfx",
  },
});

const checkPayments = async () => {
  const db = client.db('test');
  const payments = db.collection('payments');
  
  const lastPayment = await payments.find().sort({ _id: -1 }).limit(1).next();
  const startDate = lastPayment ? new ObjectId(lastPayment._id).getTimestamp() : 0;

  const endDate = Math.floor(Date.now() / 1000);

  const options = {
    limit: 100,
    created: {
      gte: startDate,
      lt: endDate
    }
  };

  const charges = await stripe.charges.list(options);
  for (const charge of charges.data) {
    const existingPayment = await payments.findOne({ paymentId: charge.id });
    if (!existingPayment) {
      console.log(`New payment: ${charge.id} | Email: ${charge.billing_details.email} | Name: ${charge.billing_details.name} | Amount: ${charge.amount}`);
      
      // Send email to client
      const mailOptions = {
        from: 'igor.filipe.lima@gmail.com',
        to: charge.billing_details.email,
        subject: 'Payment Received',
        text: `Hello ${charge.billing_details.name},\n\nWe have received your payment of ${charge.amount}.\n\nThank you for your business!`,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
      
      const payment = { paymentId: charge.id, created: charge.created };
      await payments.insertOne(payment);
    }
  }
};

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  connectToDatabase().then(() => {
    checkPayments();
    setInterval(checkPayments, 1 * 2 * 1000);
  });
});
