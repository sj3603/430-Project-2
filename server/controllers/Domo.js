const models = require('../models');

const { Domo } = models;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const shopPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('shop', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.gender) {
    return res.status(400).json({ error: 'RAWR! Name, age, and gender are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    owner: req.session.account._id,
    forSale: 0,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const forSale = (req, res) => {
  Domo.DomoModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Domo Not Found' });
    }

    if (doc.forSale === 1) {
      return res.status(400).json({ error: 'This Domo is already for sale!' });
    } // you already own this

    const domo = doc;
    domo.forSale = 1;

    domo.save().then(() => res.status(200));
    return domo;
  }).catch(() => res.status(500));
};

const buyDomo = (req, res) => {
  Domo.DomoModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Domo Not Found' });
    }

    console.dir(doc.owner.toString());

    if (doc.owner.toString() === req.session.account._id) {
      return res.status(400).json({ error: 'You already own this Domo!' });
    } // you already own this

    const domo = doc;
    domo.owner = req.session.account._id;
    domo.forSale = 0;

    // console.dir(req.session.account._id);
    // console.dir(domo.owner);

    domo.save().then(() => res.status(200));
    return domo;
  }).catch(() => res.status(500));
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ domos: docs });
  });
};

const getDomosForSale = (request, response) => {
  const res = response;

  return Domo.DomoModel.findByForSale((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.delete(req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An Error occured' });
    }
    return res.json({ StringToDelete: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.shopPage = shopPage;
module.exports.forSale = forSale;
module.exports.buy = buyDomo;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;
module.exports.getDomosForSale = getDomosForSale;
module.exports.delete = deleteDomo;
