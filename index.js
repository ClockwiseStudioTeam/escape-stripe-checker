const express = require('express');
const stripe = require('stripe')(process.env.STRIPE);
const { MongoClient, ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT|| 5000;

const uri = process.env.MONGO;
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
    user: process.env.EMAIL,
    pass: process.env.PASS,
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
        from: process.env.EMAIL,
        to: charge.billing_details.email,
        subject: 'Treasure Hunters-Recebemos o teu pagamento',
        text: `\n\n
        

         <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
         <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
         
         <head>
           <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
           <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
           <meta name="viewport" content="width=device-width">
           <!--[if !mso]><!-->
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <!--<![endif]-->
           <title></title>
           <!--[if !mso]><!-->
           <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet" type="text/css">
           <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" type="text/css">
           <link href="https://fonts.googleapis.com/css?family=Roboto+Slab" rel="stylesheet" type="text/css">
           <!--<![endif]-->
           <style type="text/css">
             body {
               margin: 0;
               padding: 0;
             }
         
             table,
             td,
             tr {
               vertical-align: top;
               border-collapse: collapse;
             }
         
             * {
               line-height: inherit;
             }
         
             a[x-apple-data-detectors=true] {
               color: inherit !important;
               text-decoration: none !important;
             }
           </style>
           <style type="text/css" id="media-query">
             @media (max-width: 750px) {
         
               .block-grid,
               .col {
                 min-width: 320px !important;
                 max-width: 100% !important;
                 display: block !important;
               }
         
               .block-grid {
                 width: 100% !important;
               }
         
               .col {
                 width: 100% !important;
               }
         
               .col_cont {
                 margin: 0 auto;
               }
         
               img.fullwidth,
               img.fullwidthOnMobile {
                 max-width: 100% !important;
               }
         
               .no-stack .col {
                 min-width: 0 !important;
                 display: table-cell !important;
               }
         
               .no-stack.two-up .col {
                 width: 50% !important;
               }
         
               .no-stack .col.num2 {
                 width: 16.6% !important;
               }
         
               .no-stack .col.num3 {
                 width: 25% !important;
               }
         
               .no-stack .col.num4 {
                 width: 33% !important;
               }
         
               .no-stack .col.num5 {
                 width: 41.6% !important;
               }
         
               .no-stack .col.num6 {
                 width: 50% !important;
               }
         
               .no-stack .col.num7 {
                 width: 58.3% !important;
               }
         
               .no-stack .col.num8 {
                 width: 66.6% !important;
               }
         
               .no-stack .col.num9 {
                 width: 75% !important;
               }
         
               .no-stack .col.num10 {
                 width: 83.3% !important;
               }
         
               .video-block {
                 max-width: none !important;
               }
         
               .mobile_hide {
                 min-height: 0px;
                 max-height: 0px;
                 max-width: 0px;
                 display: none;
                 overflow: hidden;
                 font-size: 0px;
               }
         
               .desktop_hide {
                 display: block !important;
                 max-height: none !important;
               }
             }
           </style>
         </head>
         
         <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
           <!--[if IE]><div class="ie-browser"><![endif]-->
           <table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="#FFFFFF" valign="top">
             <tbody>
               <tr style="vertical-align: top;" valign="top">
                 <td style="word-break: break-word; vertical-align: top;" valign="top">
                   <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
                   <div style="background-color:transparent;">
                     <div class="block-grid " style="min-width: 320px; max-width: 730px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                       <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:730px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                         <!--[if (mso)|(IE)]><td align="center" width="730" style="background-color:transparent;width:730px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                         <div class="col num12" style="min-width: 320px; max-width: 730px; display: table-cell; vertical-align: top; width: 730px;">
                           <div class="col_cont" style="width:100% !important;">
                             <!--[if (!mso)&(!IE)]><!-->
                             <!-- <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                               <!--<![endif]-->
                               <!-- <div class="img-container center fixedwidth" align="center" style="padding-right: 0px;padding-left: 0px;">
                                 <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img class="center fixedwidth" align="center" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/663304_645640/crmpal.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 219px; display: block;" width="219">
                                 <!--[if mso]></td></tr></table><![endif]-->
                               </div> --> -->
                               <table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
                                 <tbody>
                                   <tr style="vertical-align: top;" valign="top">
                                     <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                       <table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 6px solid #F6F6FA; width: 100%;" align="center" role="presentation" valign="top">
                                         <tbody>
                                           <tr style="vertical-align: top;" valign="top">
                                             <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                           </tr>
                                         </tbody>
                                       </table>
                                     </td>
                                   </tr>
                                 </tbody>
                               </table>
                               <!--[if (!mso)&(!IE)]><!-->
                             </div>
                             <!--<![endif]-->
                           </div>
                         </div>
                         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                       </div>
                     </div>
                   </div>
                   <div style="background-color:transparent;">
                     <div class="block-grid " style="min-width: 320px; max-width: 730px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                       <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:730px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                         <!--[if (mso)|(IE)]><td align="center" width="730" style="background-color:transparent;width:730px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                         <div class="col num12" style="min-width: 320px; max-width: 730px; display: table-cell; vertical-align: top; width: 730px;">
                           <div class="col_cont" style="width:100% !important;">
                             <!--[if (!mso)&(!IE)]><!-->
                             <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                               <!--<![endif]-->
                               <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                               <div style="color:#555555;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                 <div class="txtTinyMce-wrapper" style="line-height: 1.2; font-size: 12px; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                                   <p style="margin: 0; font-size: 16px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Roboto, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 19px; margin-top: 0; margin-bottom: 0;"><strong><span style="font-size: 17px; mso-ansi-font-size: 18px;">Obrigado Piratas!</span></strong></p>
                                 </div>
                               </div>
                               <!--[if mso]></td></tr></table><![endif]-->
                               <div class="img-container center autowidth" align="center" style="padding-right: 0px;padding-left: 0px;">
                                 <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img class="center autowidth" align="center" border="0" src="https://d2fi4ri5dhpqd1.cloudfront.net/public/resources/defaultrows/1.png" alt="I'm an image" title="I'm an image" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 125px; display: block;" width="125">
                                 <!--[if mso]></td></tr></table><![endif]-->
                               </div>
                               <table cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top">
                                 <tr style="vertical-align: top;" valign="top">
                                   <td style="word-break: break-word; vertical-align: top; padding-bottom: 0px; padding-left: 0px; padding-right: 0px; padding-top: 0px; text-align: center; width: 100%;" width="100%" align="center" valign="top">
                                     <h1 style="color:#555555;direction:ltr;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;font-size:32px;font-weight:normal;letter-spacing:normal;line-height:120%;text-align:center;margin-top:0;margin-bottom:0;"><strong>  ${charge.amount} moedas em tesouro foram recebidos!</strong></h1>
                                   </td>
                                 </tr>
                               </table>
                               <!--[if (!mso)&(!IE)]><!-->
                             </div>
                             <!--<![endif]-->
                           </div>
                         </div>
                         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                       </div>
                     </div>
                   </div>
                   <div style="background-color:transparent;">
                     <div class="block-grid " style="min-width: 320px; max-width: 730px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                       <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:730px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                         <!--[if (mso)|(IE)]><td align="center" width="730" style="background-color:transparent;width:730px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                         <div class="col num12" style="min-width: 320px; max-width: 730px; display: table-cell; vertical-align: top; width: 730px;">
                           <div class="col_cont" style="width:100% !important;">
                             <!--[if (!mso)&(!IE)]><!-->
                             <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                               <!--<![endif]-->
                               <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                               <div style="color:#555555;font-family:'Roboto', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                 <div class="txtTinyMce-wrapper" style="line-height: 1.2; font-size: 12px; font-family: 'Roboto', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
                                   <p style="margin: 0; font-size: 14px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Roboto, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 17px; margin-top: 0; margin-bottom: 0;"><p>Obrigado ${charge.billing_details.name} por te juntares à nossa caça ao tesouro com os teus amigos! Para participar, você precisará baixar o aplicativo Loquiz em sua loja de aplicativos (Google Play ou App Store) e inserir os dados de acesso que foram enviados para você por e-mail.
                                     \n\n
                                     Certifique-se de inserir as informações corretas e seguir as instruções para começar a jogar. A Loquiz é uma plataforma fácil de usar que permitirá que você participe do jogo em tempo real e interaja com outros jogadores.
                                     \n\n
                                     Se você tiver alguma dúvida ou problema para acessar o jogo, não hesite em entrar em contato conosco por e-mail ou telefone.
                                     \n\n
                                     Boa sorte e divirta-se!
                                     \n\n
                                     Atenciosamente,
                                     \n\n
                                     \n\n
                                     Os piratas da Treasure Trackers! Arrrg!</p></p>
                                 </div>
                               </div>
                               <!--[if mso]></td></tr></table><![endif]-->
                               <div class="button-container" align="center" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                 <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:30.75pt;width:144.75pt;v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#506efa"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]-->
                                 <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#506efa;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #506efa;border-right:1px solid #506efa;border-bottom:1px solid #506efa;border-left:1px solid #506efa;padding-top:5px;padding-bottom:5px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;letter-spacing:undefined;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong>Go to CRMPAL</strong></span></span></div>
                                 <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                               </div>
                               <!--[if (!mso)&(!IE)]><!-->
                             </div>
                             <!--<![endif]-->
                           </div>
                         </div>
                         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                       </div>
                     </div>
                   </div>
                   <div style="background-color:transparent;">
                     <div class="block-grid " style="min-width: 320px; max-width: 730px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: transparent;">
                       <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                         <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:730px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                         <!--[if (mso)|(IE)]><td align="center" width="730" style="background-color:transparent;width:730px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                         <div class="col num12" style="min-width: 320px; max-width: 730px; display: table-cell; vertical-align: top; width: 730px;">
                           <div class="col_cont" style="width:100% !important;">
                             <!--[if (!mso)&(!IE)]><!-->
                             <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                               <!--<![endif]-->
                               <table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
                                 <tbody>
                                   <tr style="vertical-align: top;" valign="top">
                                     <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                                       <table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 6px solid #F6F6FA; width: 100%;" align="center" role="presentation" valign="top">
                                         <tbody>
                                           <tr style="vertical-align: top;" valign="top">
                                             <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                                           </tr>
                                         </tbody>
                                       </table>
                                     </td>
                                   </tr>
                                 </tbody>
                               </table>
                               <!--[if (!mso)&(!IE)]><!-->
                             </div>
                             <!--<![endif]-->
                           </div>
                         </div>
                         <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                         <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                       </div>
                     </div>
                   </div>
                   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                 </td>
               </tr>
             </tbody>
           </table>
           <!--[if (IE)]></div><![endif]-->
         </body>
         
         </html>`,
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
