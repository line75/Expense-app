const mongoose = require('mongoose');

const ModelIncrementSchema = new mongoose.Schema({
    model: { type: String, required: true, index: { unique: true } },
    idx: { type: Number, default: 0 },
    highestId: { type: Number, default: 0 }
});

ModelIncrementSchema.statics.getNextId = async function(modelName, callback) {
    let incr = await this.findOne({ model: modelName });

    if (incr) {
        incr.highestId = Math.max(incr.idx, incr.highestId);
        incr.idx++;
        await incr.save();
        return incr.idx;
        /*
        if (!incr) incr = await new this({ model: modelName }).save();
             incr.idx++;
            incr.save();
            return incr.idx;*/
  } else {
        incr = await new this({ model: modelName, idx: 1, highestId: 1 }).save();
        return 1;
  }
};

const ModelIncrement = mongoose.model('ModelIncrement', ModelIncrementSchema);

module.exports = ModelIncrement;

