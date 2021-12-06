const models = require('../models');

const { Account } = models;

// renders the login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// redirects the user to the main page (login) and destroys the session, logging them out
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// logs the user in
const login = (request, response) => {
  const req = request;
  const res = response;

  // force cast to strings to cover up some security flaws
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

// signs the user up and creates an account with their username and password
const signup = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(200).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      balance: 0,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// resets the users password to a new one they give
const resetPassword = (request, response) => {
  const req = request;
  const res = response;

  // cast to strings to cover up some security flaws
  req.body.username = `${req.body.username}`;
  req.body.currentPass = `${req.body.currentPass}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.currentPass || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(req.body.username, req.body.currentPass, 
    (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
      const accountData = {
        username: account.username,
        salt,
        password: hash,
        balance: account.balance,
      };

      const newAccount = account;
      newAccount.salt = accountData.salt;
      newAccount.password = accountData.password;
      newAccount.balance = accountData.balance;
      const savePromise = newAccount.save();

      savePromise.then(() => {
        req.session.account = Account.AccountModel.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
      });
      savePromise.catch(() => res.status(400).json({ error: 'An error has occured' }));
    });
  });
};

// adds value to the balance of the user logged in
const addValue = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Account Not Found' });
    }

    let account = doc;
    let intBalance = parseInt(req.body.addBalance, 10);
    account.balance += intBalance;

    account.save().then(() => res.status(200));
    return res.status(200).json({ message: 'ETH Added!'});
  }).catch(() => res.status(500));
};

// adds value to the balance of the previous owner of a purchased nft
const addOtherValue = (req, res) => {
  Account.AccountModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Account Not Found' });
    }

    let account = doc;;
    let intBalance = parseInt(req.body.addBalance, 10);
    account.balance += intBalance;

    account.save().then(() => res.status(200));
    return res.status(200).json({ message: 'ETH Added!'});
  }).catch(() => res.status(500));
};

// gets the information of the currently logged in user
const getUser = (req, res) => {
  Account.AccountModel.findOne({ _id: req.session.account._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Account Not Found' });
    }
    return res.json({ user: doc });

  });
};

// gets the information of the previous owner of a purchased nft
const getOtherUser = (req, res) => {
  Account.AccountModel.findOne({ _id: req.body._id }, (err, doc) => {
    if (err) {
      return res.status(500).json({ error: 'An Error occured' });
    }
    if (!doc) {
      return res.status(404).json({ error: 'Account Not Found' });
    }

    return res.json({ user: doc });

  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.reset = resetPassword;
module.exports.addValue = addValue;
module.exports.addOtherValue = addOtherValue;
module.exports.getUser = getUser;
module.exports.getOtherUser = getOtherUser;
module.exports.getToken = getToken;
