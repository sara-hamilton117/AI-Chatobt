// Greets the user
// Code by: Justin & Sébastien

function greetings() {

    let today = new Date()
    let checkHour = today.getHours()
    var userInfo;
    
    try {
        userInfo = JSON.parse(sessionStorage.getItem('graphUser'));

        var name = userInfo.givenName;
        
    } catch (error) {
        console.log(error)
    }
    
    if (userInfo != null) {
        if (checkHour < 12) {
            pushChat('Good morning ' + name + '. Andrew-01d here. I\'m listening.', 'bot');
        } else if (checkHour < 18) {
            pushChat('Good afternoon ' + name + '. Andrew-01d here. I\'m listening.', 'bot');
        } else {
            pushChat('Good evening ' + name + '. Andrew-01d here. I\'m listening.', 'bot');
        }
    } else {
        if (checkHour < 12) {
            pushChat('Good morning. Andrew-01d here. I\'m listening.', 'bot');
        } else if (checkHour < 18) {
            pushChat('Good afternoon. Andrew-01d here. I\'m listening.', 'bot');
        } else {
            pushChat('Good evening. Andrew-01d here. I\'m listening.', 'bot');
        }
    }
   

}