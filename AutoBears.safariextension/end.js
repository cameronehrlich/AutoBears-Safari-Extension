//message listener
safari.self.addEventListener("message", getAnswer, false);

//vars
var loc = window.location.toString();
var loginPageURL = "wlan.berkeley.edu/login/";
var cookiePageURL = "https://wlan.berkeley.edu/cgi-bin/login/cookie.cgi";
var authenticationCompletedURL = "https://wlan.berkeley.edu/cgi-bin/login/calnet.cgi?url=&count=1";
var alertStringCredentials = "Enter your Calnet Credentials in \nPreferences -> Extensions -> AutoBears";
var hasAlertedAboutCredentials = false;
//end vars


//redirect to cookie.cgi page if presented with air airbears page.
if(loc.indexOf(loginPageURL) > -1){
    var originalRequestURL = loc.substring(loginPageURL.length+"/login/?".length,loc.length);
    setOriginalRequestURL(originalRequestURL);
    window.location = cookiePageURL;
}
if(loc.indexOf(authenticationCompletedURL) > -1){
    safari.self.tab.dispatchMessage("getOriginalRequestURL",null);
}


function setOriginalRequestURL(_url){
    safari.self.tab.dispatchMessage("setOriginalRequestURL",_url);
}

function getCredentials() {
    //send message to get the username
    safari.self.tab.dispatchMessage("getUsername",null);
}

function getAnswer(theMessageEvent) {
    if (theMessageEvent.message == null || theMessageEvent.message == ""){
        //try to avoid a fuck load of alerts
        if(hasAlertedAboutCredentials == false){
            //alert and shut the fuck up
            alert(alertStringCredentials);
            hasAlertedAboutCredentials = true;
        }
        return;
    }
    //begin messaging
    if (theMessageEvent.name == "returnUsername") {
        //insert username into form
        document.getElementById('username').value = theMessageEvent.message;
        //now send message to retreive password, once username is present
        safari.self.tab.dispatchMessage("getPassword",null);
        
    } else if (theMessageEvent.name == "returnPassword") {
        //insert password into form
        document.getElementById('password').value = theMessageEvent.message;
        //now submit login form
        document.forms['loginForm'].submit();
    } else if(loc.indexOf(authenticationCompletedURL) > -1 && theMessageEvent.name == "returnOriginalRequestURL"){
        //redirect to desired page
        window.location = theMessageEvent.message;
    }
    
}

//begin retrieving credentials from global.html
getCredentials();