$(document).ready(function() {

// Firebase Initialize
    var config = {
	    apiKey: "AIzaSyAh4TIpM8DLE8QuONC1DqQEtq_DW176oWw",
	    authDomain: "train-schedule-hw-299b1.firebaseapp.com",
	    databaseURL: "https://train-schedule-hw-299b1.firebaseio.com",
	    projectId: "train-schedule-hw-299b1",
	    storageBucket: "",
	    messagingSenderId: "190264930605"
      };
      
	firebase.initializeApp(config);


	//Access Data in Firebase
	var trainDatabase = firebase.database();


	//Set Input as Global Var
	$("#submit").on("click", function(event){
		event.preventDefault();
		//Store User Input
        var TrainName = $("#trainname").val().trim();
        var Origin = $("#origin").val().trim();
		var Destination = $("#destination").val().trim();
		var StartTime = $("#traintime").val().trim();
		var Frequency = $("#trainrate").val().trim();

		var trainData = {
            TrainName: TrainName, 
            Origin: Origin,
			Destination: Destination,
			FirstTrainTime: StartTime, 
			Frequency: Frequency
		};

		if(TrainName && Origin && destination && StartTime && Frequency){
			//Push Input to Firebase
		    trainDatabase.ref().push(trainData);
		};


		// Clears Input Form After Submission
        $("#trainname").val("");
        $("#origin").val("");
		$("#destination").val("");
		$("#traintime").val("");
		$("#trainrate").val("");
	});


		//Firebase Data Call When Child Added
		trainDatabase.ref().on("child_added", function(childsnapshot){


			//Gets key from childsnapshot and sets it to variable
			var key = childsnapshot.key;


			//Store Child Data as Var
            var childtrainname = childsnapshot.val().TrainName;
            var ChildOrigin = childsnapshot.val().Origin;
			var childdestination = childsnapshot.val().Destination;
			var ChildStartTime = childsnapshot.val().FirstTrainTime;
			var ChildFrequency = parseInt(childsnapshot.val().Frequency);


			//Convert start time to 'hh:mm'
			var firstTimeConverted = moment(ChildStartTime, "hh:mm");


			//Moment from current time to start time
			var diffTime = moment().diff(moment(firstTimeConverted), "minutes");


			//Modulo 
			var Remainder = diffTime % ChildFrequency;


			//difference between Frequency and Remainder and set to Var
			var MinutesTillTrain = ChildFrequency - Remainder;


			//Add current time of input with the 'MinutesTillTrain' and set to min
			var nextTrain = moment().add(MinutesTillTrain, "minutes");


			//Next Train Var to 'hh:mm a'
			var nextTrainconverted = moment(nextTrain).format("hh:mm a");


			//Print results to table HTML
			$("#traintable > tbody").append("<tr><td>" + childtrainname + "</td><td>" + ChildOrigin + "</td><td>" + childdestination + "</td><td>" + ChildFrequency + "</td><td>" 
			+ nextTrainconverted + "</td><td>" + MinutesTillTrain + "<button class='btn glyphicon glyphicon-trash delete' data-name='" + key + "' style='float: right'>" + "</button>" +  "</td></tr>");
			
		});
	


		// Click function to delete row
		$(document).on("click", ".delete", function() {
			
			//Grabs the specific key and sets it to a variable
            var key = $(this).attr("data-name");
            
			//Firebase call to delete specific child
			trainDatabase.ref().child(key).remove();
			location.reload();

			if(navigator.userAgent.match(/Chrome|AppleWebKit/)){

				window.location.href = "#traintable";

			};
		});
});