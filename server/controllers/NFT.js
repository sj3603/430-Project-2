const models = require('../models');

const { NFT } = models;

// gets all appropriate nfts for the user and passes them in when rendering the maker page
const makerPage = (req, res) => {
  NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), nfts: docs });
  });
};

// gets all appropriate nfts for sale and passes them in when rendering the shop page
const shopPage = (req, res) => {
  NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('shop', { csrfToken: req.csrfToken(), nfts: docs });
  });
};

// takes in info from the nfts and creates a new nft for the user
const makeNFT = (req, res) => {
  if (!req.body.name || !req.body.value) {
    return res.status(400).json({ error: 'Name, value and image are required bromosapien' });
  }

  const nftData = {
    name: req.body.name,
    value: req.body.value,
    owner: req.session.account._id,
    forSale: 0,
  };

  const newNFT = new NFT.NFTModel(nftData);

  const nftPromise = newNFT.save();

  nftPromise.then(() => res.json({ redirect: '/maker' }));

  nftPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'NFT already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return nftPromise;
};

// sets the appropriate domos "for sale" to true
const forSale = (req, res) => {
  NFT.NFTModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'NFT Not Found' });
    }

    if (doc.forSale === 1) {
      return res.status(400).json({ error: 'This NFT is already for sale!' });
    }

    const nft = doc;
    nft.forSale = 1;

    nft.save().then(() => res.status(200));
    return res.status(200).json({ message: 'NFT Put up for sale!'});
  }).catch(() => res.status(500));
};

// buys the nft and sets the owner to the purchaser
const buyNFT = (req, res) => {
  NFT.NFTModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'NFT Not Found' });
    }

    if (doc.owner.toString() === req.session.account._id) {
      return res.status(400).json({ error: 'You already own this NFT!' });
    } // you already own this

    const nft = doc;
    nft.owner = req.session.account._id;
    nft.forSale = 0;

    nft.save().then(() => res.status(200));
    return res.status(200).json({ message: 'NFT purchased!'});
  }).catch(() => res.status(500));
};

// gets all the nfts owned by the user
const getNFTs = (request, response) => {
  const req = request;
  const res = response;

  return NFT.NFTModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ nfts: docs });
  });
};

// gets all the nfts that are available for sale
const getNFTsForSale = (request, response) => {
  const res = response;

  return NFT.NFTModel.findByForSale((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ nfts: docs });
  });
};

// deletes the appropriate nft from the users account
const deleteNFT = (request, response) => {
  const req = request;
  const res = response;

  return NFT.NFTModel.delete(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ StringToDelete: docs });
  });
};



// Our retrieval handler.
const retrieveFile = (req, res) => {
  if (!req.query.fileName) {
    return res.status(400).json({ error: 'Missing File Name! ' });
  }

  return Item.ItemModel.findOne({ name: req.query.fileName }, (error, doc) => {
    // If there is an error, log it and send a 400 back to the client.
    if (error) {
      console.dir(error);
      return res.status(400).json({ error: 'An error occured retrieving the file. ' });
    }

    // If no file with that name is found, but the search is successful, an error will not be
    // thrown. Instead, we will simply not recieve and error or a doc back. In that case, we
    // want to tell the user that the file they were looking for could not be found.
    if (!doc.image) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.writeHead(200, { 'Content-Type': doc.image.mimetype, 'Content-Length': doc.image.size });
    return res.end(doc.image.data);
  });
};

module.exports.makerPage = makerPage;
module.exports.shopPage = shopPage;
module.exports.forSale = forSale;
module.exports.buy = buyNFT;
module.exports.make = makeNFT;
module.exports.getNFTs = getNFTs;
module.exports.getNFTsForSale = getNFTsForSale;
module.exports.delete = deleteNFT;
module.exports.retrieveFile = retrieveFile;
