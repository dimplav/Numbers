var socket = 0;
var number0;
var number1;
var number2;
var number3;
var double_digit0;
var double_digit1;
var timer0;
var timer1;
var timer2;
var timer3;
var timer4;
var timer5;
var time;
var stoping = 0;
function generate_random_number() {
    clearInterval(timer0);
    clearInterval(timer1);
    clearInterval(timer2);
    clearInterval(timer3);
    clearInterval(timer4);
    clearInterval(timer5);
    clearInterval(time);

    var task = Math.floor(Math.random() * 1000 + 1);
    //task number will be changed over time. 
    //it should be a number that can be calculated with given numbers

    document.getElementById("task").value = task;
    socket.emit('game_started', { task: task });
    document.getElementById("equation").value = "";
}

function checkAnswer() {
    try {
        var playerAnswer = eval(document.getElementById("equation"));
        if (playerAnswer.value === "") {
            alert("You forgot to fill the answer box")
        }
    } catch (e) {
        alert("Use correct mathematical operations!");
    }
    var playerTask = document.getElementById("task").value;
    clearInterval(time);
    if (playerAnswer.value == playerTask) {
        console.log("Success");
        alert("You did it correctly!\nClick OK to play new game");
    }
}

function swap_value(a, b) {
    if (a < b) {
        var tmp = b;
        b = a;
        a = tmp;
        return [a, b];
    } else {
        return [a, b];
    }

}

function isRegularAnswer() {
    //using switch is not the best way to solve this problem
    //better solution for solving this problem
    number0 = document.getElementsByClassName("single_digit")[0].innerHTML;
    number1 = document.getElementsByClassName("single_digit")[1].innerHTML;
    number2 = document.getElementsByClassName("single_digit")[2].innerHTML;
    number3 = document.getElementsByClassName("single_digit")[3].innerHTML;
    double_digit1 = document.getElementsByClassName("double_digit")[1].innerHTML;
    double_digit0 = document.getElementsByClassName("double_digit")[0].innerHTML;

    var numbersToUse = [number0, number1, number2, number3, double_digit1, double_digit0];
    try {
        var playerAnswer = document.getElementById("equation").value;
        var res = playerAnswer.toString().replace(/\D/g, ",");
        var array = res.split(",");
        formattedArray = array.filter(number => number != '');
        for (var number in formattedArray) {
            if (number != "" && Number.isInteger(parseInt(formattedArray[number]))) {
                var index = numbersToUse.indexOf(formattedArray[number]);
                if (index === -1) {
                    alert(parseInt(formattedArray[number]) + " cannot be used!");
                    return;
                } else {
                    numbersToUse.splice(index, 1);
                }
            }
            else {
                console.log("nije broj");
            }
        }
        eval(document.getElementById("equation").value);
        document.getElementById("result").value = eval(document.getElementById("equation").value);
        var rez = document.getElementById("result").value;

        socket.emit('result', { result: rez });
        console.log('poslao rezultat');
    } catch (e) {
        alert("Use correct mathematical operations! " + e.message);
    }
}

var global_timer;
var global_timer1;

// var player = 3;

window.onload = function onEnter() {
    // socket.emit('adding_player', { player: player });
    socket.emit('players', { igrac1: "", igrac2: "" });
    input = document.getElementById("equation");
    input.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("calculate_result").click();
        }
    });
}

global_timer = window.setInterval("winner()", 1000);

function stop0() {
    stoping = 1;
    broj = document.getElementsByClassName("single_digit")[0].innerHTML;

    socket.emit('stop0', { number: broj, stoping: 1 });
}
function stop1() {
    stoping = 1;
    broj = document.getElementsByClassName("single_digit")[1].innerHTML;
    socket.emit('stop1', { number: broj, stoping: 1 });
}
function stop2() {
    stoping = 1;
    broj = document.getElementsByClassName("single_digit")[2].innerHTML;
    socket.emit('stop2', { number: broj, stoping: 1 });
}
function stop3() {
    stoping = 1;
    broj = document.getElementsByClassName("single_digit")[3].innerHTML;
    socket.emit('stop3', { number: broj, stoping: 1 });
}
function stop4() {
    stoping = 1;
    broj = document.getElementsByClassName("double_digit")[1].innerHTML;
    socket.emit('stop4', { number: broj, stoping: 1 });
}
function stop5() {
    stoping = 1;
    broj = document.getElementsByClassName("double_digit")[0].innerHTML;
    socket.emit('stop5', { number: broj, stoping: 1 });
}
function showChat() {
    var container = document.getElementById("main_container");
    var chat_field = document.getElementById('chat');
    if (parseInt(container.style.height) > 550) {
        chat_field.style.display = "none";
        container.style.height = "450px";
    }
    else {
        chat_field.style.display = "block";
        container.style.height = "600px";
    }
}

socket = io.connect('http://localhost:3000');

var message = document.getElementById("message_input");
var username = document.getElementById("username");
var result = document.getElementById("result");
var opponent = document.getElementById("opponent");
var chat_field = document.getElementById("chat_field");

socket.on('new_message', (data) => {
    var paragraf = document.createElement("p");
    var player_message = document.createTextNode(data.username + ": " + data.message);
    paragraf.appendChild(player_message);

    chat_field.appendChild(paragraf);

});

function sendUsername() {
    socket.emit('change_username', { username: username.value });
}

function sendMessage() {
    socket.emit('new_message', { message: message.value });
    message.value = "";
}

function sendNumber() {
    console.log(username.value + " je poslao rezultat " + result.value);
    socket.emit('result', { result: result.value, user: username.value });
}

socket.on('stop0', (stoping) => {
    document.getElementsByClassName("single_digit")[0].innerHTML = stoping.number;
    clearInterval(timer0);
});

socket.on('stop1', (stoping) => {
    document.getElementsByClassName("single_digit")[1].innerHTML = stoping.number;
    clearInterval(timer1);
});

socket.on('stop2', (stoping) => {
    document.getElementsByClassName("single_digit")[2].innerHTML = stoping.number;
    clearInterval(timer2);
});

socket.on('stop3', (stoping) => {
    document.getElementsByClassName("single_digit")[3].innerHTML = stoping.number;
    clearInterval(timer3);
});

socket.on('stop4', (stoping) => {
    document.getElementsByClassName('double_digit')[1].innerHTML = stoping.number;
    clearInterval(timer4);
});

socket.on('stop5', (stoping) => {
    document.getElementsByClassName('double_digit')[0].innerHTML = stoping.number;
    clearInterval(timer5);
});

socket.on('game_started', (task) => {
    document.getElementById("task").value = task.task;
    document.getElementById("equation").value = "";
    document.getElementById("result").value = "";
    document.getElementById("opponent").value = "";
    global_timer1 = setInterval("winner()", 1000);
    document.getElementById("generate").disabled = true;
    timer0 = setInterval(function () {
        number0 = Math.floor(Math.random() * 9 + 1);
        document.getElementsByClassName("single_digit")[0].innerHTML = number0;
    }, 10);
    timer1 = setInterval(function () {
        number1 = Math.floor(Math.random() * 9 + 1);
        document.getElementsByClassName("single_digit")[1].innerHTML = number1;
    }, 10);
    timer2 = setInterval(function () {
        number2 = Math.floor(Math.random() * 9 + 1);
        document.getElementsByClassName("single_digit")[2].innerHTML = number2;
    }, 10);
    timer3 = setInterval(function () {
        number3 = Math.floor(Math.random() * 9 + 1);
        document.getElementsByClassName("single_digit")[3].innerHTML = number3;
    }, 10);
    timer4 = setInterval(function () {
        var numbers1 = [10, 15, 25];
        double_digit0 = numbers1[Math.floor(Math.random() * numbers1.length)];
        document.getElementsByClassName("double_digit")[1].innerHTML = double_digit0;
    }, 10);
    timer5 = setInterval(function () {
        var numbers2 = [50, 75, 100];
        double_digit1 = numbers2[Math.floor(Math.random() * numbers2.length)];
        document.getElementsByClassName("double_digit")[0].innerHTML = double_digit1;
    }, 10);

    var bar = document.getElementById("my_progress");
    var width = 0;
    time = setInterval(filling, 1000);
    function filling() {
        if (width >= 100) {
            clearInterval(time);
            alert("Time run out!");
            bar.style.width = 0 + '%';
        }
        else {
            width++;
            bar.style.width = width + '%';
        }
    }
});

socket.on('result', (result) => {
    console.log(document.getElementById('username').value + ' rezultat primljen ' + result.result);
    if (document.getElementById('username').value != result.user && typeof (result.user) !== "undefined") {
        console.log(document.getElementById('username').value + " je dobio poruku od " + result.user);
        document.getElementById('opponent').value = result.result;
        winner(parseInt(document.getElementById("result").value), parseInt(result.result));
    }
});

socket.on('players', (igrac) => {
    igracObj = {};
    igracObj.prvi = igrac.igrac1;
    igracObj.drugi = igrac.igrac2;
    igraci = [igracObj.prvi, igracObj.drugi];
    let tekst = document.getElementById('igrac').innerHTML;
    if (tekst != "") {
        document.getElementById('igrac').innerHTML = igraci[0];
    } else if (tekst == igrac[0]) {
        document.getElementById('igrac').innerHTML = igraci[1];
    }
    else if (tekst == igrac[1]) {
        document.getElementById('igrac').innerHTML = igraci[0];
        //console.log(igraci[0]);

    }
});

//temporarely commented function
// socket.on('adding_player', (player) => {
//     //console.log("stigao je id "+ player.player);
//     playerID = player.player;
// });
// var playerID;

function winner(first_player, second_player) {
    // var task = document.getElementById("task").value;
    // var first_difference = Math.abs(task - first_player);
    // var second_difference = Math.abs(task - second_player);
    // console.log(first_difference);
    // console.log(second_difference);
    // if(first_difference<second_difference && document.getElementById("result").value!=""){
    //     alert("First player wins");
    // }else if(second_difference<first_difference && document.getElementById("result").value!=""){
    //     alert("Second player wins");
    // }
    // else if(document.getElementById("result").value!=""){
    //     alert("Draw");
    // }
}
function winner() {
    var first_player = parseInt(document.getElementById("result").value);
    var second_player = parseInt(document.getElementById("opponent").value);
    var task = document.getElementById("task").value;
    var first_difference = Math.abs(task - first_player);
    var second_difference = Math.abs(task - second_player);
    if (first_difference < second_difference && first_player != NaN && second_player != NaN) {
        window.clearInterval(global_timer);
        clearInterval(global_timer1);
        document.getElementById("generate").disabled = false;
        alert("You win");
    }
    else if (second_difference < first_difference && first_player != NaN && second_player != NaN) {
        window.clearInterval(global_timer);
        clearInterval(global_timer1);
        document.getElementById("generate").disabled = false;
        alert("Opponent wins");
    }
    else if (first_difference === second_difference && first_player != NaN && second_player != NaN) {
        window.clearInterval(global_timer);
        clearInterval(global_timer1);
        document.getElementById("generate").disabled = false;
        alert("Draw");
    }
}