const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

//View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//POST Function
app.post('/send',(req,res)=>{
    const output = `
        <h3>Form Inputs</h3>
        <ul>
            <li>Name: ${req.body.firstName}</li>
            <li>Last Name: ${req.body.lastName}</li>
            <li>Email: ${req.body.email}</li>
            <li>Message: ${req.body.message}</li>
        </ul>
        
    `;

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'EMAIL', 
        pass: 'PASSWORD'
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  let mailOptions = {
      from: '"Registration Form" <your@email.com>', 
      to: 'EMAIL OF RECEIVERS', 
      subject: 'Registration Form Inputs', 
      text: '', 
      html: output 
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('registration', {msg:'Email has been sent'});
  });
})


app.get('/',(req,res)=>{
    res.render('registration', {layout:false});
});

app.listen(3000, ()=> console.log('Server started...'));
