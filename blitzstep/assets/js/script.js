var api_endpoint = 'http://localhost:5002';


//deleteCookie('login-cc');

var currenfile = document.location.pathname.split('/')[2];

if( !getCookie('login-cc') && currenfile != 'login.shtml' && currenfile != 'register.shtml' ){
    document.location = './login.shtml';
}else{
//
//    var profileInfo {
//        "url": "http://localhost:5002/api/profile?cookie="+getCookie(login-cc)",
//        "method": "GET",
//        "timeout": 0,
//    }
}


if (getCookie('run-start')) {
    $('#mainB').addClass('in-run').html('...');
    const obj = JSON.parse(getCookie('run-start'));

    setInterval(function () {
        var second_in_run = Math.floor(Date.now() / 1000) - obj.time;
        var minutes_in_run = parseInt(second_in_run / 60);
        $('#mainB').html(minutes_in_run + ' m');
    }, 1000);
}

$('#mainB').click(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {

            console.log('test');
            var runningtime;
            var cookie = getCookie("run-start");
            if (cookie == null) {
                mainB.textContent = "runningtime";
            }
            else if (cookie != null) {
                mainB.textContent = "Go";
            }

            longStart = position.coords.longitude;
            latiStart = position.coords.latitude;

            var timeActive = Math.floor(Date.now() / 1000)


            const obj = {
                "longitude": position.coords.longitude,
                "latitude": position.coords.latitude,
                "time": timeActive
            };
            const json_string = JSON.stringify(obj);

            if (getCookie('run-start')) {
                setCookie('run-end', json_string, 365);
                $(this).removeClass('in-run').html('Svyrshi');

                var run_start = JSON.parse(getCookie('run-start'));
                var run_end = JSON.parse(getCookie('run-end'));

                var time = run_end.time - run_start.time;
                var km = getDistanceFromLatLonInKm(run_start.longitude, run_start.latitude, run_end.longitude, run_end.latitude);
                var meters = km * 1000;
                var points = pointsCalc(meters);


                var settings = {
                    "url": "http://localhost:5002/api/insert?meters="+ parseInt(meters) +"&imageUrl=a&data=a&points="+ parseInt( points ) +"&cookie=" + getCookie('login-cc'),
                    "method": "GET",
                    "timeout": 0,
                  };
                  
                  $.ajax(settings).done(function (response) {
                    if( response.status === true ){
                        $('#mainB').removeClass('in-run');
                        deleteCookie('run-start');
                        deleteCookie('run-end');
                        alert('Успешно приключихте!');
                        location.reload();
                    }
                  });

                 

            } else {
                setCookie('run-start', json_string, 365);
                location.reload();
            }
        });
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
});



function calcCrow(p1, p2) {

    var lat1 = p1.latitude;
    var lon1 = p1.longitude;
    var lat2 = p2.latitude;
    var lon2 = p2.longitude;

    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

function toRad(Value) {
    return (Value * Math.PI / 180) / 1000;
}

/*function selectedB() {
  console.log("10")
  if (selected == true) {
    //document.getElementById(selectB).style.filter = brightness(120%)
    document.getElementById('selectedG').style.marginBottom = "10vw"
    selected == false
  }
}
document.querySelectorAll("a").forEach(el => el.addEventListener("click", document.getElementById("selectG").style.marginBottom = "2vw"))

function selectedB() {
  document.getElementById("selectG").style.marginBottom = "2vw"
}*/

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


function deleteCookie( name ) {
    var path = '/';
    if( getCookie( name ) ) {
        document.cookie = name + "=" +
        ((path) ? ";path="+path:"")+
        ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


function pointsCalc(distance) {
    if (distance < 1000) {
        points = distance * 2;
    }
    else if (distance < 2000) {
        points = distance * 1.5;
    }
    else if (distance < 3000) {
        points = distance;
    }
    else if (distance >= 3000) {
        points = distance * 0.5;
    }

    return points;
}

$('#register_form').submit(function(e){
    e.preventDefault();

    var username = $('#username').val();
    var email = $('#email').val();
    var password = $('#password').val();
    var repassword = $('#repassword').val();

    var settings = {
        "url": "http://localhost:5002/api/Register",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "userName": username,
            "email": email,
            "password": password,
            "confirmPassword": repassword,
        }),
    };
    
    $.ajax(settings).done(function (response) {
        if( response.status === true ){
            alert('Успешна регистрация.');

            deleteCookie('run-start');
            deleteCookie('run-end');

            setCookie('login-cc', response.hashEmail, 365);
            window.location.href = "./index.shtml";
        }else{
            alert('Упс... нещо се случи. Моля опитайте отново.');
        }
    });
});

$('#login_form').submit(function(e){ //.click for log out
    e.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    var settings = {
        "url": "http://localhost:5002/api/Login",
        "method": "POST",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify({
            "email": email,
            "password": password,
        }),
    };
    
    $.ajax(settings).done(function (response) {
        if( response.status === true ){
            alert('Успешно влизане.');
            setCookie('login-cc', response.hashEmail, 365); 


            deleteCookie('run-start');
            deleteCookie('run-end');


            window.location.href = "./index.shtml";
        }else{
            alert('Упс... нещо се случи. Моля опитайте отново.');
        }
    });
});






