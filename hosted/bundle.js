"use strict";

// handles creating a new nft for the user by sending a post request to the server with the given nft info
var handleNFT = function handleNFT(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#nftName").val() == '' || $("#nftValue").val() == '') {
    handleError("All fields are required bromosapien!");
    return false;
  }

  sendAjax('POST', $("#nftForm").attr("action"), $("#nftForm").serialize(), function () {
    loadNFTsFromServer();
  });
  return false;
}; // handles deleting a given nft for the user by sending a delete request to the server with the given nft info


var handleDelete = function handleDelete(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('DELETE', $("#nftDeleteForm").attr("action"), {
    _id: e.target._id.value,
    _csrf: e.target._csrf.value
  }, function () {
    loadNFTsFromServer();
  });
  return false;
}; // handles setting an nft to "for sale" for the user by sending a post request to the server with the given nft info


var handleForSale = function handleForSale(e) {
  e.preventDefault();
  $("#nftMessage").animate({
    width: 'hide'
  }, 350);
  sendAjax('POST', $("#nftForSaleForm").attr("action"), {
    _id: e.target._id.value,
    _csrf: e.target._csrf.value
  }, function () {
    loadNFTsFromServer();
  });
  return false;
}; // the nft maker form React component


var NFTForm = function NFTForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "nftForm",
    onSubmit: handleNFT,
    name: "nftForm",
    action: "/maker",
    method: "POST",
    encType: "multipart/form-data",
    className: "nftForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "nftName",
    type: "text",
    name: "name",
    placeholder: "NFT Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "value"
  }, "Value: "), /*#__PURE__*/React.createElement("input", {
    id: "nftValue",
    type: "text",
    name: "value",
    placeholder: "NFT Value"
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "makeNFTSubmit",
    type: "submit",
    value: "Make NFT"
  }));
};

var onFileChange = function onFileChange(e) {
  e.preventDefault();
}; // the nft list React component


var NFTList = function NFTList(props) {
  if (props.nfts.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "nftList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyNFT"
    }, "No NFTs Yet"));
  }

  var nftNodes = props.nfts.map(function (nft) {
    var imageSource = "/retrieve?fileName=".concat(nft.name);
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
    }, "Value: ", nft.value), /*#__PURE__*/React.createElement("h3", {
      className: "nftForSale"
    }, "For Sale: ", nft.forSale === 1 ? 'Yes' : 'No'), /*#__PURE__*/React.createElement("form", {
      id: "nftDeleteForm",
      onSubmit: handleDelete,
      name: "nftDeleteForm",
      action: "/delete",
      method: "DELETE"
    }, /*#__PURE__*/React.createElement("input", {
      className: "makeNFTSubmit",
      type: "submit",
      value: "Delete NFT"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_id",
      value: nft._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    })), /*#__PURE__*/React.createElement("form", {
      id: "nftForSaleForm",
      onSubmit: handleForSale,
      name: "nftForSaleForm",
      action: "/forSale",
      method: "POST"
    }, /*#__PURE__*/React.createElement("input", {
      className: "makeNFTSubmit",
      type: "submit",
      value: "Sell NFT"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      id: "nftID",
      name: "_id",
      value: nft._id
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    })));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "nftList"
  }, nftNodes);
}; // gets the nfts from the server and rerenders the nft list


var loadNFTsFromServer = function loadNFTsFromServer() {
  sendAjax('GET', '/getToken', null, function (result) {
    sendAjax('GET', '/getNFTs', null, function (data) {
      ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
        nfts: data.nfts,
        csrf: result.csrfToken
      }), document.querySelector("#nfts"));
    });
  });
}; // sets up the page by rendering the nft form and list before calling loadNFTsFromServer


var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTForm, {
    csrf: csrf
  }), document.querySelector("#makeNFT"));
  ReactDOM.render( /*#__PURE__*/React.createElement(NFTList, {
    nfts: []
  }), document.querySelector("#nfts"));
  loadNFTsFromServer();
}; // gets the user information to render on the page


var getUser = function getUser() {
  sendAjax('GET', '/getUser', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement("label", null, "Welcome ", data.user.username, "!", /*#__PURE__*/React.createElement("br", null), " Balance: ", data.user.balance, " ETH"), document.querySelector("#accountInfo"));
  });
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
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
