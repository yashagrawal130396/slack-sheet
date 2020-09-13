function businesschannels() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var msgdate = sheet.getSheetName();
  var lR = sheet.getLastRow();
  var range = sheet.getRange(2, 1, lR, 15).getValues();
  var matrix = [];
  var errors = [];
  for(var i in range) {
  //channel pick condition
    if(range[i][0] != '' && range[i][8] != '' && range[i][11] != '' && range[i][4] != '' && range[i][14] == '') {
      matrix.push(range[i][8]);
    }
  }
  var uni = ArrayLib.unique(matrix, 0, false);
  var len = uni.length;
  if(len <= 0) { return; }
  
  var divider = {
    "type": "divider"
  }
  
  for(var j=0; j < len; j++) {
    try {
      var reviews = 0;
      var nrev = 0;
      var prev = 0;
      var rating = 0;
      var block = [];
      var channel = uni[j];
      
      for(var i in range) {
      //reviews/msgs sum (specifically for this use case)
        if(range[i][0] != '' && range[i][4] != '' && range[i][8] != '' && range[i][8] == channel) {
          reviews = reviews + 1;
          rating = rating + range[i][4];
          if(range[i][4] <= 3) {
            nrev = nrev + 1;
          } else {
            prev = prev + 1;
          }
        }
      }
      
      var avgrating = Utilities.formatString("%.2f", rating/reviews).substring(0,3);
      
      var topSection = {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "@here *Analysis of all negative rated reviews for date: " + msgdate + "*\n*Reviews:* " + reviews + "\t*Positive (Rated 4/5):* " + prev + "\t*Negative:* " + nrev + "\t*Avg Rating:* " + avgrating
        }
      }
      block.push(topSection);
      
      for(var i in range) {
      //msg pick condition
        if(range[i][0] == '' || range[i][4] == '' || range[i][8] == '' || range[i][11] == '' || range[i][8] != channel || range[i][14] != '') continue;
        if(range[i][10] == 'Yes') {
          var section = {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "<https://SLACK_URL/archives/CHANNEL_ID_FOR_HYPERLINK/p" + range[i][7].toString().replace(".","") + "|" + range[i][0] + ">" + ":\t" + range[i][1] + ":\t" + range[i][2] + "\n*Rating: " + range[i][4] + "*\n" + range[i][6] + "\n*Analysis:* " + range[i][11] + "\n" + range[i][12]
            }
          }
          } else {
            var section = {
              "type": "section",
              "text": {
                "type": "mrkdwn",
                "text": "<https://SLACK_URL/archives/CHANNEL_ID_FOR_HYPERLINK/p" + range[i][7].toString().replace(".","") + "|" + range[i][0] + ">" + ":\t" + range[i][1] + ":\t" + range[i][2] + "\n*Rating: " + range[i][4] + "*"
              }
            }
            }
        block.push(divider);
        block.push(section);
        sheet.getRange(Number(i)+2, 15, 1, 2).setValues([[['Sent'],[new Date()]]]);
      }
      var message = {
        'username': 'MSG_USERNAME',
        'icon_emoji':':vertical_traffic_light:',
        'link_names': 1,
        'unfurl_links': false,
        'channel': channel,
        'blocks': JSON.stringify(block)
      }
      var urlslack = 'SLACK_WEBHOOK_URL';
      var optionsslack = {
        'method': 'post',
        'payload': JSON.stringify(message)
      };
      var slack = UrlFetchApp.fetch(urlslack, optionsslack);
    }
    catch(err) {
      errors.push([[channel],[err],[new Date()]]);
      sheet.getRange(2, 17, errors.length, errors[0].length).setValues(errors);
    }
  }
}
