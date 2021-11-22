let csrfSaved;
const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoGender").val() == '') {
        handleError("RAWR! All fields are required!");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

const handleBuy = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#domoBuyForm").attr("action"), $("#domoBuyForm").serialize(), function () {
        loadDomosFromServer();
        setup(csrfSaved);
    });

    return false;
};

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function (domo) {
        if(domo.forSale === 1){
            return (
                <div key={domo._id} className="domo">
                    <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                    <h3 className="domoName">Name: {domo.name}</h3>
                    <h3 className="domoAge">Age: {domo.age}</h3>
                    <h3 className="domoGender">Gender: {domo.gender}</h3>
                    <h3 className="domoOwner">Owner: {domo.owner}</h3>
                    <form id="domoBuyForm"
                        onSubmit={handleBuy}
                        name="domoBuyForm"
                        action="/shop"
                        method="POST">
                    <input className="makeDomoSubmit" type="submit" value="Buy Domo" />
                    <input type ="hidden" name="owner" value={domo.owner} />
                    <input type ="hidden" name="_id" value={domo._id} />
                    <input type ="hidden" name="_csrf" value={props.csrf} />
                    </form>
                </div>
            );
        }
        
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomosForSale', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrfSaved}/>, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );
    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
        csrfSaved = result.csrfToken;
    });
};

$(document).ready(function () {
    getToken();
});