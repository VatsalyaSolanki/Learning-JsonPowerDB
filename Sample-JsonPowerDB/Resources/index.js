var jpdbUrl = "http://api.login2explore.com:5577";
var jpdbIrl = "/api/irl";
var jpdbIml = "/api/iml";
var dbName = "ship_database";
var relation = "ship-rel";
var token = "90932290|-31949271161824793|90954069";

$("#Shipment-No").focus();

function saveRecNo2LS(jsonObj) {
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getShipmentNoJson() {
    var shipNo = $("#Shipment-No").val();
    var jsonStr = {
        shipID: shipNo,
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#Description").val(record.shipDescription);
    $("#Destination").val(record.shipDesitnation);
    $("#Source").val(record.shipSource);
    $("#Shipping-Date").val(record.shipDate);
    $("#Expected-Delivery-Date").val(record.shipEDD);
}

function resetForm() {
    $("#Shipment-No").val("");
    $("#Description").val("");
    $("#Source").val("");
    $("#Destination").val("");
    $("#Shipping-Date").val("");
    $("#Expected-Delivery-Date").val("");
    $("#Shipment-No").prop("disabled",false);
    $("#saveData").prop("disabled",true);
    $("#changeData").prop("disabled",true);
    $("#resetData").prop("disabled",true);
    $("#Shipment-No").focus();
}

function validateData() {
    var ShipmentNo, Description, Destination, Source, ShippingDate, ExpectedDeliveryDate;
    ShipmentNo = $("#Shipment-No").val();
    Description = $("#Description").val();
    Destination = $("#Destination").val();
    Source = $("#Source").val();
    ShippingDate = $("#Shipping-Date").val();
    ExpectedDeliveryDate = $("#Expected-Delivery-Date").val();

    if (ShipmentNo === "") {
        alert("Shipment ID is missing");
        $("#Shipment-No").focus();
        return "";
    }
    if (Description === "") {
        alert("Description missing");
        $("#Description").focus();
        return "";
    }
    if (Source === "") {
        alert("Source is missing");
        $("#Source").focus();
        return "";
    }
    if (Destination === "") {
        alert("Destination missing");
        $("#Destination").focus();
        return "";
    }
    
    if (ShippingDate === "") {
        alert("Shipping Date is missing");
        $("#Shipping-Date").focus();
        return "";
    }
    if (ExpectedDeliveryDate === "") {
        alert("Expected Delivery Date is missing");
        $("#Expected-Delivery-Date").focus();
        return "";
    }

    var jsonStrObj = {
        shipID: ShipmentNo,    
        shipDescription: Description,
        shipDesitnation: Destination,
        shipSource: Source,
        shipDate:  ShippingDate,
        shipEDD: ExpectedDeliveryDate
    };

    return JSON.stringify(jsonStrObj);
}

function save() {
    var jsonStrObj = validateData();

    if (jsonStrObj === "") {
        return "";
    }

    var putRequest = createPUTRequest(
        token,
        jsonStrObj,
        dbName,
        relation
    );

    jQuery.ajaxSetup({ async: false });

    var resJsonObj = executeCommandAtGivenBaseUrl(
        putRequest,
        jpdbUrl,
        jpdbIml
    );

    jQuery.ajaxSetup({ async: true });

    resetForm();
    $("#Shipment-No").focus();
}

function getInfo() {
    
    var shipmentNoJson = getShipmentNoJson();
   
    var getRequest = createGET_BY_KEYRequest(
        token,
        dbName,
        relation,
        shipmentNoJson
    );
    jQuery.ajaxSetup({ async: false });

    var response = executeCommandAtGivenBaseUrl(
        getRequest,
        jpdbUrl,
        jpdbIrl
    );
    jQuery.ajaxSetup({ async: true });
    //console.log("This is shipmentno::"+response.status);
    if (response.status === 400) {
        console.log("This is shipmentno: went into 400 :"+response.getInfo);
        $("#saveData").prop("disabled", false);
        $("#resetData").prop("disabled", false);
        $("#Description").focus();
    } else if (response.status === 200) {
       //  console.log("This is shipmentno: went into 200 :"+response.status);
        $("#Shipment-No").prop("disabled", true);
        fillData(response);
        $("#saveData").prop("disabled", true);
        $("#changeData").prop("disabled", false);
        $("#resetData").prop("disabled", false);
    }
    $("#Description").focus();
}

function change() {
    
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(
        token,
        jsonChg,
        dbName,
        relation,
        localStorage.getItem("recno")
    );
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(
        updateRequest,
        jpdbUrl,
        jpdbIml
    );
    jQuery.ajaxSetup({ async: True });
    resetForm();
    $("#Shipment-No").focus();
}