const express = require('express');
const CronJob = require('cron').CronJob;
const excelToJSON = require('convert-excel-to-json');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const customersModel = require('./model');
const twilio = require('twilio');

require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + '/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
const uploads = multer({ storage });

const app = express();

// connect DB
mongoose.connect('mongodb://localhost:27017/app',
  { useUnifiedTopology: true, useNewUrlParser: true }
  , (err) => { if (err) console.log(err) }
);

// Variables
const PORT = process.env.PORT ? process.env.PORT : 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).send('Jay Swaminarayana');
});


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);

app.post('/api/save', uploads.any(), async (req, res) => {
  try {
    const { Sheet1 } = excelToJSON({
      sourceFile: path.join(__dirname + '/uploads/customers.xlsx'),
      header: {
        rows: 1,
      },
      columnToKey: {
        A: 'name',
        B: 'work',
        C: 'dob',
        D: 'dow',
        E: 'mobile'
      }
    });

    Sheet1.forEach(val => {
      date = parseInt(val.dob.getDate()) + 1;
      month = parseInt(val.dob.getMonth()) + 1;
      val.dob = month + '-' + date;
    });


    // console.log(Sheet1);
    // const birthdayList = Sheet1.filter((val, index, ar) => {
    //   // let [_day, month, date, ..._time] = val['dob'].toString().split(' ');
    //   // let [_thisDay, thisM, thisD, _year] = new Date().toDateString().split(' ');
    //   date = parseInt(date) + 1;
    //   thisD = parseInt(thisD);
    //   if (thisM === month && thisD === date)
    //     return { month, date };
    // });

    // customersModel.insertMany(Sheet1)
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err));

    const newInstance = await customersModel.insertMany(Sheet1);

    return res.status(200).send('Jay Swaminarayana');

  }
  catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

app.post('/', async (req, res) => {
  try {

    let today = (parseInt(new Date().getMonth()) + 1) + '-' + new Date().getDate();

    const list = await customersModel.find({ dob: today });

    const job = new CronJob('0 36 22 * * *', () => {
      // birthdayList.forEach(person => {
      //   console.log(`Send greetings to ${person.name}`);
      // })
      // send message to people from list
      // db query wheer b day is today
      // send sms

      list.forEach(val => {
        console.log('Jay Swaminarayana');
        client.messages
          .create({
            to: '+917874407474',
            from: '+16122236529',
            body: 'Jay Swaminarayana',
          })
          .then(message => console.log(message.sid));
      })

    }, null, true, 'Asia/Kolkata')

    return res.status(200).send('Ok');
  }
  catch (err) {
    console.log(err)
    return res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});