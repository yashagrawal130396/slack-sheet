function Slackdata() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var date = today.getDate();
  var fromdate = new Date(year,month,date-1);
  var todate = new Date(year,month,date);
  var from = Math.floor(((fromdate.getTime())/1000)).toString();
  var to = Math.floor(((todate.getTime())/1000)).toString();
  var sheetname = fromdate.getDate();
  
  try {
    var url = 'https://slack.com/api/conversations.history?token=SLACK_TOKEN_WITH_CONVERSATION_LIST_SCOPE&channel=CHANNEL_ID&latest='+ to +'&limit=1000&oldest='+ from +'&pretty=1';
    var res = UrlFetchApp.fetch(url);
    var data = JSON.parse(res);
    var msgdata = data.messages;
    var matrix = [];
    var newarr = [];
    var mainarr = [];
    
    for(var i=0; i < msgdata.length; i++) {
      var matrix2 = [];
      if(!msgdata[i].blocks || msgdata[i].subtype != 'bot_message' || msgdata[i].bot_id != 'B01813W32UE') continue;
      var blockdata = msgdata[i].blocks;
      
      var ts = msgdata[i].ts;
      var bid = blockdata[0].fields[1].text;
      var vendor = blockdata[0].fields[3].text;
      var tour = blockdata[0].fields[5].text;
      var city = blockdata[0].fields[7].text;
      var rating = blockdata[0].fields[9].text;
      
      if(!blockdata[1]) {
        var row1 = [[""]];
      } else {
        var row1 = blockdata[1].text.text;
      }
      
      if(!blockdata[2]) {
        var row2 = [[""]];
      } else {
        var row2 = blockdata[2].text.text;
      }
      if(JSON.stringify(row1).indexOf('Comments:') > -1) {
        var row1 = [[""]];
        var row2 = blockdata[1].text.text;
      } 
      var pasterow = [[bid],[vendor],[tour],[city],[rating],[row1],[row2],[ts]];
      matrix.push(pasterow);
    }
    var sortmatrix = ArrayLib.unique(matrix, 0, false);
    var sortedmatrix = ArrayLib.sort(sortmatrix, 4, true);
    ss.getSheetByName(sheetname).getRange("A2:H").clearContent();
    ss.getSheetByName(sheetname).getRange("J2:J").clearContent();
    ss.getSheetByName(sheetname).getRange("L2:S").clearContent();
    ss.getSheetByName(sheetname).getRange(2, 1, sortedmatrix.length, sortedmatrix[0].length).setValues(sortedmatrix);
    return false;
  }
  catch(err) {
    ss.getSheetByName(sheetname).getRange("A2:H").clearContent();
    ss.getSheetByName(sheetname).getRange("J2:J").clearContent();
    ss.getSheetByName(sheetname).getRange("L2:S").clearContent();
    ss.getSheetByName(sheetname).getRange(2, 1, 1, 1).setValue(err);
    return false;
  }
}
