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


	//Submit Button (Enter Or Click Button)
	$(document).bind('keydown', function(e) {
        if (e.keyCode==13) {
            e.preventDefault(); 
            $("#submit").trigger("click");
        };
    });


	//Grabbing the values from the inputs and setting them to the global variables
	$("#submit").on("click", function(event){
		event.preventDefault();
		//Store User Input
		var TrainName = $("#trainname").val().trim();
		var Destination = $("#destination").val().trim();
		var StartTime = $("#traintime").val().trim();
		var Frequency = $("#trainrate").val().trim();

		var trainData = {
			TrainName: TrainName, 
			Destination: Destination,
			FirstTrainTime: StartTime, 
			Frequency: Frequency
		};

		if(TrainName && destination && StartTime && Frequency){
			//Push Input to Firebase
		    trainDatabase.ref().push(trainData);
		};


		// Clears Input Form After Submission
		$("#trainname").val("");
		$("#destination").val("");
		$("#traintime").val("");
		$("#trainrate").val("");
	});


		//The firebase call to go through the data when a child is added to our data
		trainDatabase.ref().on("child_added", function(childsnapshot){


			//Grabs key from childsnapshot and sets it to variable
			var key = childsnapshot.key;


			//Store everything in variables from the "child" data
			var childtrainname = childsnapshot.val().TrainName;


			var childdestination = childsnapshot.val().Destination;


			var ChildStartTime = childsnapshot.val().FirstTrainTime;


			var ChildFrequency = parseInt(childsnapshot.val().Frequency);


			//Converting StartTime of the train to the format 'hh:mm'
			var firstTimeConverted = moment(ChildStartTime, "hh:mm");


			//Finding the difference between the First Time when the Train leaves to the current time of the user
			var diffTime = moment().diff(moment(firstTimeConverted), "minutes");


			//Finding the remainder of the difference
			var Remainder = diffTime % ChildFrequency;


			//Find the difference again between Frequency and Remainder and setting it to a variable
			var MinutesTillTrain = ChildFrequency - Remainder;


			//Adding the current time of the users with the 'MinutesTillTrain' and making sure it is in minutes
			var nextTrain = moment().add(MinutesTillTrain, "minutes");


			//Converting the variable 'nextTrain' time to the format 'hh:mm a'
			var nextTrainconverted = moment(nextTrain).format("hh:mm a");


			//Uploading the results to the HTML page
			$("#traintable > tbody").append("<tr><td>" + childtrainname + "</td><td>" + childdestination + "</td><td>" + ChildFrequency + "</td><td>" 
			+ nextTrainconverted + "</td><td>" + MinutesTillTrain + "<button class='btn glyphicon glyphicon-trash delete' data-name='" + key + "' style='float: right'>" + "</button>" +  "</td></tr>");
			
		});
	


		// Click function to delete that current row of values in the table
		$(document).on("click", ".delete", function() {
			
			//Grabs the specific key and sets it to a variable
			var key = $(this).attr("data-name");


			//Calls firebase and removes this specific child with this key
			trainDatabase.ref().child(key).remove();
			
			location.reload();


			if(navigator.userAgent.match(/Chrome|AppleWebKit/)){


				window.location.href = "#traintable";


			};


		});
});