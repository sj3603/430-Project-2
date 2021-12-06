const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let NFTModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  value: {
    type: Number,
    min: 0,
    required: true,
  },
  forSale: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

NFTSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  value: doc.value,
  forSale: doc.forSale,
  image: doc.image,
});

NFTSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return NFTModel.find(search).select('name value forSale _id').lean().exec(callback);
};

NFTSchema.statics.findByName = (nameIn, callback) => {
  const search = {
    nameIn,
  };
  return NFTModel.findOne(search, callback);
};

NFTSchema.statics.findByForSale = (callback) => {
  const search = {
    forSale: 1,
  };

  return NFTModel.find(search).select('name value forSale owner _id').lean().exec(callback);
};

NFTSchema.statics.delete = (idIn, callback) => {
  const search = {
    _id: idIn,
  };
  NFTModel.deleteOne(search).lean().exec(callback);
};

NFTSchema.statics.buyNFT = (ownerId, idIn) => {
  const search = {
    _id: idIn,
  };
  const nft = NFTModel.find(search).lean();
  nft.owner = convertId(ownerId);
};

NFTModel = mongoose.model('NFT', NFTSchema);

module.exports.NFTModel = NFTModel;
module.exports.NFTSchema = NFTSchema;
