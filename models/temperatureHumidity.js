const mongoose = require('mongoose');

const temperatureHumiditySchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
},
{
    timestamps: true
});

const TemperatureHumidity = mongoose.model('TemperatureHumidity', temperatureHumiditySchema);

module.exports = TemperatureHumidity;