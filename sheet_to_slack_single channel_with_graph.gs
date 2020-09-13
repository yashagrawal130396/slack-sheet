function SendSalck() 
{
  var ss3 = SpreadsheetApp.openById('SHEET_ID');
  var sheets3 = ss3.getSheets()[1];
  var date = sheets3.getRange(2, 3).getValue();
  var inbcalls = sheets3.getRange(5, 2).getValue();
  var uniqinb = sheets3.getRange(5, 3).getValue();
  var anscalls = sheets3.getRange(8, 2).getValue();
  var uniqans = sheets3.getRange(8, 3).getValue();
  var ansrate = sheets3.getRange(11, 2).getValue();
  var uniqansrate = sheets3.getRange(11, 3).getValue();
  var outcalls = sheets3.getRange(14, 2).getValue();
  var missedcalls = sheets3.getRange(14, 3).getValue();
  var undefinb = sheets3.getRange(17, 2).getValue();
  var shortaban = sheets3.getRange(17, 3).getValue();
  
  try {
  var payload3 = {
    "username": "SLACK_USERNAME",
    "icon_emoji": ":slack_call:",
    "link_names": 1,
    "blocks": [
                    {
                        "type": "section",
                        "text": {
                          "type": "mrkdwn",  
                          "text": "*Call Metrics:* "+date+"",
                        },
                        "fields": [
                            {
                                "type": "mrkdwn",
                                "text": "*Total Inbound Calls*\n"+inbcalls+"\n\n*Answered Calls*\n"+anscalls+"\n\n*Answer Rate*\n"+ansrate+"\n\n*Outbound Calls*\n"+outcalls+"\n\n*Undefined Calls*\n"+undefinb+""    
                            },
                            {
                                "type": "mrkdwn",
                                "text": "*Unique Inbound*\n"+uniqinb+"\n\n*Unique Answered*\n"+uniqans+"\n\n*Unique Answer Rate*\n"+uniqansrate+"\n\n*Missed Calls*\n"+missedcalls+"\n\n*Short Abandoned*\n"+shortaban+""
                            }
                        ]
                    }
                ]
  };
  var url3 = 'SLACK_WEBHOOK_URL';
  var options3 = {
    'method': 'post',
    'payload': JSON.stringify(payload3)
  };
    
    var payload4 = {
    "username": "Call Data",
    "icon_emoji": ":slack_call:",
    "link_names": true,
    "text": "Calls Timeline",
    "attachments": [
        {
          "text": "",
          "image_url": "GRAPH/CHART_URL_IN_IMAGE_FORMAT",
          "unfurl_links": true
        }
      ]
  };
    var options4 = {
    'method': 'post',
    'payload': JSON.stringify(payload4)
  };
    
  var response3 = UrlFetchApp.fetch(url3,options3);
  var response4 = UrlFetchApp.fetch(url3,options4);
    
  Logger.log(response3) 
  SpreadsheetApp.flush();
      sheets3.getRange(2, 5).setValue('Sent');
      sheets3.getRange(3, 5).setValue(new Date());
    } catch (err) {
      sheets3.getRange(2, 5).setValue('Error');
      sheets3.getRange(3, 5).setValue(new Date());
    }
    return ;
  }
