"use strict";

window.twilio = {};
//removed
twilio.accountId = 'XXXXXXXXXXXXXXXXX';
twilio.authToken = 'XXXXXXXXXXXXXXXXX';
twilio.fromNumber = 'XXXXXXXXXXXXXXXXX';


twilio.TwilioShoutout = function(accountId, authToken, fromNumber) {
  // Assign properties
  this.apiUrl = "https://api.twilio.com/2010-04-01";
  this.accountId = accountId;
  this.authToken = authToken;
  this.fromNumber = fromNumber;

  // Reference JQuery objects
  this.messageList = $(".message-list");
  this.messageInputField = $(".message-input-field");
  this.phoneInputField = $(".phone-input-field");
  this.messageSendButton = $(".message-input-button");

  // Set up the event handlers
  this.initialize();

  // Notify user
  console.log("TwilioMessenger is ready.");
};

twilio.TwilioShoutout.prototype = {

  initialize: function() {
    // set up event listeners to DOM
    this.messageSendButton.on("click", this.handleMessageSend.bind(this));
  },

  clearField: function(jqField) {
    jqField.val("");
  },

  validateMessageField: function(textStr) {
    return ($.trim(textStr).length !== 0);
  },

  validatePhoneField: function(phoneStr) {
		var modStr = $.trim(phoneStr);
		var whiteList = '1234567890';
		for (var i = 0; i <= modStr.length - 1; i++) {
			if (whiteList.indexOf(modStr[i]) === -1) return false;
		}

    return (modStr.length !== 0);
  },

  handleMessageSend: function(evt) {
		evt.preventDefault();

    // only send if both fields are valid
    var toPhone = this.phoneInputField.val();
    var thisMessage = this.messageInputField.val();
    if (this.validatePhoneField(toPhone) && this.validateMessageField(thisMessage)) {
      // send the message
      this.sendMessage(toPhone, thisMessage);
      // clear the message field
      this.clearField(this.messageInputField);
    } else {
      throw "Invalid fields";
    }
  },

  sendMessage: function(toNumber, messageBody) {
		// It might be easier to access these variables like this
    var acctId = this.accountId;
    var authTok = this.authToken;
    var messageList = this.messageList;

    var cb = function(data) {
      messageList.append(new Message(toNumber, messageBody).render());
    };

		// `Call` the Twilio API service with our data
    $.ajax({
      method: "POST",

      url: this.apiUrl + "/Accounts/" + this.accountId + "/Messages",

      data : {
        "To" : "+" + toNumber,
        "From": "+" + this.fromNumber,
        "Body": messageBody
      },
			success: cb,
      headers: {
        'Authorization': 'Basic ' + btoa(acctId + ':' + authTok)
      },
      error: function(xhr, textStatus, error) {
        console.log(xhr);
        console.log(xhr.responseText);
      }
    });
  }

};


// This is a helper class that appends sent message to the DOM.
var Message = function(sender, body) {
  this.sender = sender;
  this.body = body;
};


// Returns a jQuery object that encloses span and p tags that encapsulate the sender and body properties.
Message.prototype = {
  render: function() {
    var listElem = $('<li></li>').addClass('message');
    var sender = $('<span></span>').addClass('sender').text(this.sender);
    var body = $('<p></p>').text(this.body);
    listElem.append(sender);
    listElem.append(body);

    return listElem;
  }
};

// var app = new twilio.TwilioShoutout(twilio.accountId, twilio.authToken, twilio.fromNumber)
