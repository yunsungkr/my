function getDataLink(date, obj)
{
    var dateTemp = new Date(date.getTime());
    var dateParam = getDateText(dateTemp);
    var startParam = getTimeText(dateTemp);
    dateTemp.setMinutes(dateTemp.getMinutes() + obj.getTerm);
    var endParam = getTimeText(dateTemp); //5분 사이 500건
    //return "http://localhost:6369/api/data/" + obj.api + "/" + code + "/" + dateParam + "/" + startParam + "/" + endParam;
    return "https://stockdata.finup.co.kr/api/data/" + obj.api + "/" + code + "/" + dateParam + "/" + startParam + "/" + endParam;
}

function getApiData(date, obj, bindAction, logRef)
{
    if(obj.pendings == true) return;

    obj.pendings = true;

    var url = getDataLink(date, obj);

    var startTime = new Date();

    $.ajax({
        type: "GET",
        url: url,
        contentType: false,
        processData: false,
        error: function (e) { 
            console.error(e); 
        },
        success: function (result) {
            var endTime = new Date();

            if(result.length > 0) {
                
                if(obj.data.length > 0)
                    obj.data = obj.data.concat(result);
                else {
                    obj.data = result;
                    bindAction && bindAction(obj.data[0]);
                }

                apiDataBindLog(startTime, endTime, result, obj, logRef);
                bindingLog(obj, obj.data[0], logRef);
            }
        },
        complete : function () {
            obj.pendings = false;
        }
    });
}

function getPrevDay(date, code) 
{
    //var url = "http://localhost:6369/api/prevday/" + date + "/" + code;
    var url = "https://stockdata.finup.co.kr/api/prevday/" + date + "/" + code;
    $.ajax({
        type: "GET",
        url: url,
        contentType: false,
        processData: false,
        error: function (e) { 
            console.error(e); 
        },
        success: function (result) {
            prevDay.close = result.close;
            prevDay.volume = result.volume;
            prevDay.name = result.name;
            $("#stockName").text(result.name);
            $("#price").text(result.close.toNumber());
            $("#priceind").text();

            getData();
        }
    });
}