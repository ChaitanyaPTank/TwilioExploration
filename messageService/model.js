const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const Customers = new Schema({
  name: { type: String },
  work: String,
  // dob: {
  //   type: Date,

  //   set: (v) => {
  //     let month = parseInt(v.getDate()) + 1;
  //     v.setDate(month)
  //     v.setUTCMinutes(00);
  //     v.setUTCHours(00);
  //     v.setUTCSeconds(00);
  //     v.setUTCMilliseconds(00);

  //     console.log('setter', new Date(v));
  //     return new Date(v);
  //   },

  //   get: (v) => { console.log('getter', v); return v; }
  // },
  dob: String,
  dow: Date,
  mobile: String
}, {
  timestamps: true
});

module.exports = mongoose.model('customers', Customers);