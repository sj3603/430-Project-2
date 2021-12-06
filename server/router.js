const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getUser', mid.requiresLogin, controllers.Account.getUser);
  app.get('/getOtherUser', mid.requiresLogin, controllers.Account.getOtherUser);
  app.get('/getNFTs', mid.requiresLogin, controllers.NFT.getNFTs);
  app.get('/getNFTsForSale', mid.requiresLogin, controllers.NFT.getNFTsForSale);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/reset', mid.requiresSecure, mid.requiresLogout, controllers.Account.reset);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/addValue', mid.requiresLogin, controllers.Account.addValue);
  app.post('/addOtherValue', mid.requiresLogin, controllers.Account.addOtherValue);
  app.get('/maker', mid.requiresLogin, controllers.NFT.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.NFT.make);
  app.post('/forSale', mid.requiresLogin, controllers.NFT.forSale);
  app.get('/shop', mid.requiresLogin, controllers.NFT.shopPage);
  app.post('/shop', mid.requiresLogin, controllers.NFT.buy);
  app.delete('/delete', mid.requiresLogin, controllers.NFT.delete);
  app.get('/retrieve', mid.requiresLogin,controllers.NFT.retrieveFile);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
