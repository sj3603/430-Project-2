// handles creating a new nft for the user by sending a post request to the server with the given nft info
const handleNFT = (e) => {
    e.preventDefault();

    $("#nftMessage").animate({ width: 'hide' }, 350);

    if ($("#nftName").val() == '' || $("#nftValue").val() == '') {
        handleError("All fields are required bromosapien!");
        return false;
    }

    sendAjax('POST', $("#nftForm").attr("action"), $("#nftForm").serialize(), function () {
        loadNFTsFromServer();
    });

    return false;
};

// handles deleting a given nft for the user by sending a delete request to the server with the given nft info
const handleDelete = (e) => {
    e.preventDefault();

    $("#nftMessage").animate({ width: 'hide' }, 350);

    sendAjax('DELETE', $("#nftDeleteForm").attr("action"), { _id: e.target._id.value, _csrf: e.target._csrf.value }, function () {
        loadNFTsFromServer();
    });

    return false;
};

// handles setting an nft to "for sale" for the user by sending a post request to the server with the given nft info
const handleForSale = (e) => {
    e.preventDefault();

    $("#nftMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#nftForSaleForm").attr("action"), { _id: e.target._id.value, _csrf: e.target._csrf.value }, function () {
        loadNFTsFromServer();
    });

    return false;
};

// the nft maker form React component
const NFTForm = (props) => {
    return (
        <form id="nftForm"
            onSubmit={handleNFT}
            name="nftForm"
            action="/maker"
            method="POST"
            encType="multipart/form-data"
            className="nftForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="nftName" type="text" name="name" placeholder="NFT Name" />
            <label htmlFor="value">Value: </label>
            <input id="nftValue" type="text" name="value" placeholder="NFT Value" />
            {/* <label htmlFor="sampleFile">NFT Image: </label>
            <input id="nftImage" type="file" onChange={onFileChange} name="sampleFile" /> */}
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeNFTSubmit" type="submit" value="Make NFT" />
        </form>
    );
};

const onFileChange = (e) => {
    e.preventDefault();
};

// the nft list React component
const NFTList = function (props) {
    if (props.nfts.length === 0) {
        return (
            <div className="nftList">
                <h3 className="emptyNFT">No NFTs Yet</h3>
            </div>
        );
    }

    const nftNodes = props.nfts.map(function (nft) {
        let imageSource = `/retrieve?fileName=${nft.name}`;
        return (
            <div key={nft._id} className="nft">
                <img src="/assets/img/nftface.jpeg" alt="nft face" className="nftFace" />
                <h3 className="nftName">Name: {nft.name}</h3>
                <h3 className="nftValue">Value: {nft.value}</h3>
                <h3 className="nftForSale">For Sale: {(nft.forSale === 1) ? 'Yes' : 'No'}</h3>
                <form id="nftDeleteForm"
                    onSubmit={handleDelete}
                    name="nftDeleteForm"
                    action="/delete"
                    method="DELETE">
                    <input className="makeNFTSubmit" type="submit" value="Delete NFT" />
                    <input type="hidden" name="_id" value={nft._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                </form>
                <form id="nftForSaleForm"
                    onSubmit={handleForSale}
                    name="nftForSaleForm"
                    action="/forSale"
                    method="POST">
                    <input className="makeNFTSubmit" type="submit" value="Sell NFT" />
                    <input type="hidden" id="nftID" name="_id" value={nft._id} />
                    <input type="hidden" name="_csrf" value={props.csrf} />
                </form>
            </div>
        );
    });

    return (
        <div className="nftList">
            {nftNodes}
        </div>
    );
};

// gets the nfts from the server and rerenders the nft list
const loadNFTsFromServer = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        sendAjax('GET', '/getNFTs', null, (data) => {
            ReactDOM.render(
                <NFTList nfts={data.nfts} csrf={result.csrfToken} />, document.querySelector("#nfts")
            );
        });
    });
};

// sets up the page by rendering the nft form and list before calling loadNFTsFromServer
const setup = function (csrf) {
    ReactDOM.render(
        <NFTForm csrf={csrf} />, document.querySelector("#makeNFT")
    );

    ReactDOM.render(
        <NFTList nfts={[]} />, document.querySelector("#nfts")
    );
    loadNFTsFromServer();
};

// gets the user information to render on the page
const getUser = () => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <label>Welcome {data.user.username}!
                <br /> Balance: {data.user.balance} ETH</label>
            , document.querySelector("#accountInfo")
        );
    });
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getUser();
    getToken();
});