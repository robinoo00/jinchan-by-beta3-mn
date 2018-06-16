var work = $.connection.myHub;
var k_type_choose = "";
$.connection.hub.url = 'http://139.196.236.139:1818/lcc';
function chooseKType(code,type){
    $.connection.hub.start().done(function () {
        work.server.k线(code, type, "");
    });
}
