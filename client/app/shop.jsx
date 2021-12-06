const handleNFT = (e) => {
    e.preventDefault();

    $("#nftMessage").animate({ width: 'hide' }, 350);

    if ($("#nftName").val() == '' || $("#nftAge").val() == '' || $("#nftGender").val() == '') {
        handleError("All fields are required bromosapien!");
        return false;
    }

    sendAjax('POST', $("#nftForm").attr("action"), $("#nftForm").serialize(), function () {
        loadNFTsFromServer();
    });

    return false;
};

const handleBuy = (e) => {
    e.preventDefault();

    balanceCheck(e);

    return false;
};

const handleBalance = (e) => {
    e.preventDefault();

    $("#nftMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#balanceForm").attr("action"), $("#balanceForm").serialize(), function () {
        loadNFTsFromServer();
        getToken();
    });

    return false;
};

const NFTList = function (props) {
    if (props.nfts.length === 0) {
        return (
            <div className="nftList">
                <h3 className="emptyNFT">No NFTs Yet</h3>
            </div>
        );
    }

    const nftNodes = props.nfts.map(function (nft) {
        if (nft.forSale === 1) {
            return (
                <div key={nft._id} className="nft">
                    <img src="/assets/img/nftface.jpeg" alt="nft face" className="nftFace" />
                    <h3 className="nftName">Name: {nft.name}</h3>
                    <h3 className="nftValue">Value: {nft.value} ETH</h3>
                    <form id="nftBuyForm"
                        onSubmit={handleBuy}
                        name="nftBuyForm"
                        action="/shop"
                        method="POST">
                        <input className="makeNFTSubmit" type="submit" value="Buy NFT" />
                        <input type="hidden" name="owner" value={nft.owner} />
                        <input type="hidden" name="value" value={nft.value} />
                        <input type="hidden" name="_id" value={nft._id} />
                        <input type="hidden" name="_csrf" value={props.csrf} />
                    </form>
                </div>
            );
        }

    });

    return (
        <div className="nftList">
            {nftNodes}
        </div>
    );
};

const BalanceForm = (props) => {
    return (
        <form id="balanceForm"
            onSubmit={handleBalance}
            name="balanceForm"
            action="/addValue"
            method="POST"
            className="nftForm"
        >
            <label htmlFor="addBalance">Amount to Add: </label>
            <select id="nftBalance" name="addBalance" placeholder="Add to Balance">
                <option disabled defaultValue hidden>Add to Balance</option>
                <option value="1">1 ETH</option>
                <option value="3">3 ETH</option>
                <option value="5">5 ETH</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeNFTSubmit" type="submit" value="Add Balance" />
        </form>
    );
};

const loadNFTsFromServer = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        sendAjax('GET', '/getNFTsForSale', null, (data) => {
            ReactDOM.render(
                <NFTList nfts={data.nfts} csrf={result.csrfToken} />, document.querySelector("#nfts")
            );
        });
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <BalanceForm csrf={csrf} />, document.querySelector("#addBalance")
    );
    ReactDOM.render(
        <NFTList nfts={[]} />, document.querySelector("#nfts")
    );
    getUser();
    loadNFTsFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const getUser = () => {
    sendAjax('GET', '/getUser', null, (data) => {
        ReactDOM.render(
            <label>Welcome {data.user.username}!
            <br /> Balance: {data.user.balance} ETH</label>
            , document.querySelector("#accountInfo")
        );
    });
};

const balanceCheck = (nft) => {
    let nftValue = nft.target.value.value;
    sendAjax('GET', '/getUser', null, (data) => {
        if (nft.target.owner.value.toString() === data.user._id) {
            handleError("You already own this NFT bromosapien!");
            return false;
        }

        if (nftValue <= data.user.balance) {
            let subtractValue = nftValue * -1;
            sendAjax('POST', "/addValue", { addBalance: subtractValue, _csrf: nft.target._csrf.value }, function () { });

            sendAjax('POST', "/addOtherValue", { _id: nft.target.owner.value, addBalance: nftValue, _csrf: nft.target._csrf.value }, function () { });

            confirmBuy(nft);
            return true;
        }
        else {
            handleError("Not enough cash bromosapien");
            return false;
        }
    });
};

const confirmBuy = (nft) => {
    $("#nftMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#nftBuyForm").attr("action"), { _id: nft.target._id.value, _csrf: nft.target._csrf.value }, function () {
        loadNFTsFromServer();
        getToken();
    });
};

$(document).ready(function () {
    getUser();
    getToken();
});