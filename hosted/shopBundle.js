"use strict";

var handleNFT = function handleNFT(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#nftName").val() == '' || $("#nftAge").val() == '' || $("#nftGender").val() == '') {
    handleError("All fields are required bromosapien!");
    return false;
  }

  sendAjax('POST', $("#nftForm").attr("action"), $("#nftForm").serialize(), function () {
    loadNFTsFromServer();
  });
  return false;
};

var handleBuy = function handleBuy(e) {
  e.preventDefault();
  balanceCheck(e);
  return false;
};

var handleBalance = function handleBalance(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#balanceForm").attr("action"), $("#balanceForm").serialize(), function () {
    loadNFTsFromServer();
    getToken();
  });
  return false;
};

var NFTList = function NFTList(props) {
  if (props.nfts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "nftList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNFT"
    }, "No NFTs Yet"));
  }

  var nftNodes = props.nfts.map(function (nft) {
    if (nft.forSale === 1) {
      return /*#__PURE__*/React.createElement("div", {
        key: nft._id,
        className: "nft"
      }, /*#__PURE__*/React.createElement("img", {
        src: "/assets/img/nftface.jpeg",
        alt: "nft face",
        className: "nftFace"
      }), /*#__PURE__*/React.createElement("h3", {
        className: "nftName"
      }, "Name: ", nft.name), /*#__PURE__*/React.createElement("h3", {
        className: "nftValue"
      }, "Value: ", nft.value, " ETH"), /*#__PURE__*/React.createElement("form", {
        id: "nftBuyForm",
        onSubmit: handleBuy,
        name: "nftBuyForm",
        action: "/shop",
        method: "POST"
      }, /*#__PURE__*/React.createElement("input", {
        className: "makeNFTSubmit",
        type: "submit",
        value: "Buy NFT"
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "owner",
        value: nft.owner
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "value",
        value: nft.value
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: nft._id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_csrf",
        value: props.csrf
      })));
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "nftList"
  }, nftNodes);
};

var BalanceForm = function BalanceForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "balanceForm",
    onSubmit: handleBalance,
    name: "balanceForm",
    action: "/addValue",
    method: "POST",
    className: "nftForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "addBalance"
  }, "Amount to Add: "), /*#__PURE__*/React.createElement("select", {
    id: "nftBalance",
    name: "addBalance",
    placeholder: "Add to Balance"
  }, /*#__PURE__*/React.createElement("option", {
    disabled: true,
    defaultValue: true,
    hidden: true
  }, "Add to Balance"), /*#__PURE__*/React.createElement("option", {
    value: "1"
  }, "1 ETH"), /*#__PURE__*/React.createElement("option", {
    value: "3"
  }, "3 ETH"), /*#__PURE__*/React.createElement("option", {
    value: "5"
  }, "5 ETH")), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeNFTSubmit",
    type: "submit",
    value: "Add Balance"
  }));
};

var loadNFTsFromServer = function loadNFTsFromServer() {
  sendAjax('GET', '/getToken', null, function (result) {
    sendAjax('GET', '/getNFTsForSale', null, function (data) {
      ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
        nfts: data.nfts,
        csrf: result.csrfToken
      }), document.querySelector("#nfts"));
    });
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(BalanceForm, {
    csrf: csrf
  }), document.querySelector("#addBalance"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
    nfts: []
  }), document.querySelector("#nfts"));
  getUser();
  loadNFTsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var getUser = function getUser() {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement("label", null, "Welcome ", data.user.username, "!", /*#__PURE__*/React.createElement("br", null), " Balance: ", data.user.balance, " ETH"), document.querySelector("#accountInfo"));
  });
};

var balanceCheck = function balanceCheck(nft) {
  var nftValue = nft.target.value.value;
  sendAjax('GET', '/getUser', null, function (data) {
    if (nft.target.owner.value.toString() === data.user._id) {
      handleError("You already own this NFT bromosapien!");
      return false;
    }

    if (nftValue <= data.user.balance) {
      var subtractValue = nftValue * -1;
      sendAjax('POST', "/addValue", {
        addBalance: subtractValue,
        _csrf: nft.target._csrf.value
      }, function () {});
      sendAjax('POST', "/addOtherValue", {
        _id: nft.target.owner.value,
        addBalance: nftValue,
        _csrf: nft.target._csrf.value
      }, function () {});
      confirmBuy(nft);
      return true;
    } else {
      handleError("Not enough cash bromosapien");
      return false;
    }
  });
};

var confirmBuy = function confirmBuy(nft) {
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#nftBuyForm").attr("action"), {
    _id: nft.target._id.value,
    _csrf: nft.target._csrf.value
  }, function () {
    loadNFTsFromServer();
    getToken();
  });
};

$(document).ready(function () {
  getUser();
  getToken();
});
"use strict";

// handles errors and displays the appropriate message argument
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#nftMessage").animate({
    width: "toggle"
  }, 350);
}; // redirects the user to the appropriate endpoint argument


var redirect = function redirect(response) {
  $("#nftMessage").animate({
    width: "hide"
  }, 350);
  window.location = response.redirect;
}; // used for sending GET, POST, DELETE, and HEAD requests to the server


var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
