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

const handleDelete = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('DELETE', $("#domoDeleteForm").attr("action"), $("#domoDeleteForm").serialize(), function () {
        loadDomosFromServer();
    });

    return false;
};

const handleForSale = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    sendAjax('POST', $("#domoForSaleForm").attr("action"), $("#domoForSaleForm").serialize(), function () {
        loadDomosFromServer();
        setup(csrfSaved);
    });

    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age" />
            <label htmlFor="gender">Gender: </label>
            <select id="domoGender" name="gender" placeholder="Domo Gender">
                <option disabled defaultValue hidden>Domo Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
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
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
                <h3 className="domoGender">Gender: {domo.gender}</h3>
                <h3 className="domoGender">For Sale: {(domo.forSale===1)?'true':'false'}</h3>
                <form id="domoDeleteForm"
                    onSubmit={handleDelete}
                    name="domoDeleteForm"
                    action="/delete"
                    method="DELETE">
                <input className="makeDomoSubmit" type="submit" value="Delete Domo" />
                <input type ="hidden" name="_id" value={domo._id} />
                <input type ="hidden" name="_csrf" value={props.csrf} />
                </form>
                <form id="domoForSaleForm"
                    onSubmit={handleForSale}
                    name="domoForSaleForm"
                    action="/forSale"
                    method="POST">
                <input className="makeDomoSubmit" type="submit" value="Sell Domo" />
                <input type ="hidden" name="_id" value={domo._id} />
                <input type ="hidden" name="_csrf" value={props.csrf} />
                </form>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} csrf={csrfSaved}/>, document.querySelector("#domos")
        );
    });
};

const setup = function (csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

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