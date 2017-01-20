locative_phrases = 	['on the table','in the driveway','in the lounge','in the yard',
					'on top of the bed','on this block','in the zoo','in the pond',
					'on the sidewalk','in this house','at this farm','at the aquarium'];

filler_sentences= 	[ 	['The men play checkers in the park.',
						'The men plays checkers in the park.'],
						['Some women run the shop.',
						'Some women runs the shop.'],
						['The employee has come in late every day.',
						'The employee have come in late every day.'],
						['A teacher has to be present during the exam.',
						'A teacher have to be present during the exam.'],
						['All of the students eat in the cafeteria.',
						'All of the students eats in the cafeteria.'],
						['Every government official plans to attend the meeting.',
						'Every government official plan to attend the meeting.'],
						['The skunks love to spray me.',
						'The skunks loves to spray me.'],
						['Some foxes live in the woods behind my house.',
						'Some foxes lives in the woods behind my house.'],
						['The elephant has a long trunk.',
						'The elephant have a long trunk.'],
						['A male lion has a large mane.',
						'A male lion have a large mane.'],
						['All of the birds sleep on my roof.',
						'All of the birds sleeps on my roof.'],
						['Every dolphin likes to play.',
						'Every dolphin like to play.'],
						['The computers at the university cost thousands of dollars.',
						'The computers at the university costs thousands of dollars.'],
						['Some bicycles have to be fixed.',
						'Some bicycles has to be fixed.'],
						['The stapler requires extra-large staples.',
						'The stapler require extra-large staples.'],
						['A backpack carries all of my textbooks.',
						'A backpack carry all of my textbooks.'],
						['All of the airplanes take off from this runway.',
						'All of the airplanes takes off from this runway.'],
						['Every house in the neighborhood has internet access.',
						'Every house in the neighborhood have internet access.'],	
						['The politicians debated among themselves in private.',
						'The politicians debated among themself in private.'],
						['Some managers suggested that we fire him.',
						'Some managers suggested that we fire he.'],
						['The landlord told me that my lease was up.',
						'The landlord told I that my lease was up.'],
						['A basketball player was cut from the team because he did not come to practice.',
						'A basketball player was cut from the team because him did not come to practice.'],
						['All of the doctors said that she was healthy.',
						'All of the doctors said that her was healthy.'],
						['Every parent with a daughter loves her.',
						'Every parent with a daughter loves she.'],
						['The gophers were asleep in their holes.',
						'The gophers were asleep in it holes.'],
						['Some deer make a home for themselves around here.',
						'Some deer make a home for they around here.'],
						['The snake is my favorite animal.',
						'The snake is I favorite animal.'],
						['A hawk is flying after its prey.',
						'A hawk is flying after she prey.'],
						['All of the mice were in their cages.',
						'All of the mice were in it cages.'],
						['Every spider scares me.',
						'Every spider scares I.'],
						['The televisions that she owns are broken.',
						'The televisions that her owns are broken.'],
						['Some clothes of yours ended up in my laundry.',
						'Some clothes of you ended up in my laundry.'],
						['The jacket fit him well.',
						'The jacket fit he well.'],
						['An apple fell from the tree and hit me.',
						'An apple fell from the tree and hit I.'],
						['All of the books on the shelf belong to her.',
						'All of the books on the shelf belong to she.'],
						['Every dish he cooks is delicious.',
						'Every dish him cooks is delicious.']]
						
warm_up_sentences =		[	['Children play in this park all the time.',
							'Children plays in this park all the time.'],
							["My stereo has not worked for a while.",
							"My stereo have not worked for a while."],
							['I gave the package to her yesterday.',
							'I gave the package to she yesterday.'],
							["His phone's screen is broken.",
							"He phone's screen is broken."] ]

copula_types = [' is',' are',"'s"];

subject_types = ['sg','pl','conj_sg','conj_pl'];

num_questions = len(locative_phrases) + len(filler_sentences) + len(warm_up_sentences);
							
function create_item_order() {
	warm_up_order = create_filler_order(warm_up_sentences);
	filler_order = create_filler_order(filler_sentences);
	target_order = create_target_order(locative_phrases);
	console.log(filler_order);
	console.log(target_order);
	item_order = warm_up_order;
	j = 0;
	for (i = 0; i < len(filler_order); i++){
		if ((i-1) % 3 == 0){
			console.log(i);
			rand = random(1,2);
			console.log(rand);
			if (rand == 1){
				item_order.push(target_order[j]);
				item_order.push(filler_order[i]);
			}
			else {
				item_order.push(filler_order[i]);
				item_order.push(target_order[j]);
			}
			j++;
		}
		else {
			item_order.push(filler_order[i]);
		}
	}
	console.log(item_order);
	return item_order
};

function create_target_order (locative) {
	locative_length = len(locative);
	true_loc = Array.apply(null, Array(locative_length/2)).map(function(){return 0});
	false_loc = Array.apply(null, Array(locative_length/2)).map(function(){return 1});
	true_false_loc = shuffle(true_loc.concat(false_loc));
	target_order = [];
	feature_order = create_feature_order();
	for (i = 0; i < len(locative); i++){
		loc = locative[i];
		typ = 'target';
		cop = feature_order[i][0];
		subj = feature_order[i][1];
		sen = create_target_sentence(loc,cop,subj);
		target_obj = {sentence: sen,locative:loc,type:typ,copula:cop,subject:subj}
		target_order.push(target_obj);
	}
	console.log(target_order);
	return shuffle(target_order);
}

function create_feature_order (){
	feature_order = [];
	for (i = 0; i < len(copula_types); i++){
		for (j = 0; j < len(subject_types);j++) {
			pair = [copula_types[i],subject_types[j]];
			feature_order.push(pair);
		}
	}
	return shuffle(feature_order);
}

function create_target_sentence (locative,copula,subject){
	target_sentence = 'There' + copula;
	if (locative == 'on the table'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a magazine ';
		}
		else{
			target_sentence += ' magazines ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a book ';
		}
	} else if (locative == 'in the driveway'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a truck ';
		}
		else{
			target_sentence += ' trucks ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a minivan ';
		}
	} else if (locative == 'in the lounge'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a table ';
		}
		else{
			target_sentence += ' tables ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a chair ';
		}
	} else if (locative == 'in the yard'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a tree ';
		}
		else{
			target_sentence += ' trees ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a bush ';
		}
	} else if (locative == 'on top of the bed'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a pillow ';
		}
		else{
			target_sentence += ' pillows ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a blanket ';
		}
	} else if (locative == 'on this block'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a restaurant ';
		}
		else{
			target_sentence += ' restaurants ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a bank ';
		}
	} else if (locative == 'in the zoo'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a giraffe ';
		}
		else{
			target_sentence += ' giraffes ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a panda ';
		}
	} else if (locative == 'in the pond'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a duck ';
		}
		else{
			target_sentence += ' ducks ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a swan ';
		}
	} else if (locative == 'on the sidewalk'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a pigeon ';
		}
		else{
			target_sentence += ' pigeons ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a squirrel ';
		}
	} else if (locative == 'in this house'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a cat ';
		}
		else{
			target_sentence += ' cats ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a dog ';
		}
	} else if (locative == 'at this farm'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a chicken ';
		}
		else{
			target_sentence += ' chickens ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a horse ';
		}
	} else if (locative == 'at the aquarium'){
		if (subject.indexOf('sg') != -1){
			target_sentence += ' a turtle ';
		}
		else{
			target_sentence += ' turtles ';
		}
		if (subject.indexOf('conj') != -1){
			target_sentence += 'and a shark ';
		}
	}
	
	target_sentence += locative + '.';
	return target_sentence;
}

function create_filler_order (arr) {
	arr_length = len(arr);
	true_arr = Array.apply(null, Array(arr_length/2)).map(function(){return 0});
	false_arr = Array.apply(null, Array(arr_length/2)).map(function(){return 1});
	true_false_arr = shuffle(true_arr.concat(false_arr));
	filler_order = []
	for (i = 0; i < len(arr); i++){
		sentence = arr[i][true_false_arr[i]];
		type = 'filler';
		grammaticality = true_false_arr[i];
		filler_obj = {sentence: sentence,type:type,grammaticality:grammaticality}
		filler_order.push(filler_obj);
	}
	return shuffle(filler_order);
}

function create_feedback_text (grammaticality, sentence, response){
	feedback_text = ''
	if (grammaticality == 0){
		if (response > 4){
			feedback_text = 'Good job. This sentence is fairly natural.'
		}
		else {
			feedback_text = 'This sentence is fairly natural, so you should give it a high rating.'
		}
	} else {
		if (response < 4) {
			feedback_text = 'Good job. This sentence is fairly unnatural.'
		} else if (sentence == 'Children plays in this park all the time.'){
			feedback_text = 'It would be more natural to say "Children play in this park all the time." So, you should give a sentence like this a low rating.'
		} else if (sentence == 'My stereo have not worked for a while.'){
			feedback_text = 'It would be more natural to say "My stereo has not worked for a while." So, you should give a sentence like this a low rating.'
		} else if (sentence == 'I gave the package to she yesterday.'){
			feedback_text = 'It would be more natural to say "I gave the package to her yesterday." So, you should give a sentence like this a low rating.'
		} else if (sentence == "He phone's screen is broken."){
			feedback_text = "It would be more natural to say \"His phone's screen is broken.\" So, you should give a sentence like this a low rating."
		}
	}
	return feedback_text;
}

function showSlide(id) {
	$(".slide").hide();
	$("#"+id).show();
}

function shuffle(v) { // non-destructive.
    newarray = v.slice(0);
    for(var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
};

function random(a,b) {
    if (typeof b == "undefined") {
	a = a || 2;
	return Math.floor(Math.random()*a);
    } else {
	return Math.floor(Math.random()*(b-a+1)) + a;
    }
};

function len (arr){
	return arr.length;
};

function choose(list,n){
	return shuffle(list).slice(0,n)
};

var items = create_item_order();

$(document).ready(function() {
    showSlide("instructions");
    $("#instructions #mustaccept").hide();
});

var experiment = {
    data: {},
    intro: function () {
    	if (turk.previewMode) {
	    	$("#instructions #mustaccept").show();
		} else {
	    	showSlide("intro");
	    }
    },
    next: function(num) { 
    	if (num == num_questions + 1) {
   // or "if (stimuli.length == 0) {...}", etc: test whether it's time to end the experiment
		    showSlide("language");
		    $("#lgerror").hide();
		    $("#lgbox").keypress(function(e){ // capture return so that it doesn't restart experiment
		    	if (e.which == 13) {
		    		return(false);
		    	}
		    });
		    $("#lgsubmit").click(function(){
				var lang = document.getElementById("lgbox").value;
				if (lang.length > 2) {
				    //lang = lang.slice(3,lang.length);
				    experiment.data.language = lang;
				    showSlide("finished");
				    setTimeout(function() { turk.submit(experiment.data) }, 1000);
				}
				return(false);
			});
		}
	else if (num == len(warm_up_sentences)){
		showSlide("warm-up");
		$(".continue").click(function() {
	    	$(".continue").unbind('click'); // remove this fxn after using it once, so we can reuse the button
	    	experiment.next(num + 1);
	    });
	}
	else {
			showSlide("sentence_judgment");
			var qdata = {};
			var startTime = (new Date()).getTime(); 
			var completed = false;
			var feedback = false;
			var response;
			var qnum;
			
			if (num < 4){
				qnum = num;
			} else {
				qnum = num - 1;
			}
			
			$(".no_answer").hide();
			$("#feedback").hide();
			$("#click").hide();
			
			qdata.type = items[qnum].type;
			
			if (qdata.type == 'filler'){
				qdata.grammaticality = items[qnum].grammaticality;
				qdata.sentence = items[qnum].sentence;
			} else {
				qdata.locative = items[qnum].locative;
				qdata.sentence = items[qnum].sentence;
				qdata.subject = items[qnum].subject;
				qdata.copula = items[qnum].copula;
			}
			
			$("#sentence").html(qdata.sentence);
							
			$(".rating").change(function() {
				response = $(this).attr("value");
				console.log(response);
				completed = true;
				$("#feedback").html(create_feedback_text(qdata.grammaticality,qdata.sentence,response));
        	});
			
			$(".continue").click(function() {
	    		var clickTime = (new Date()).getTime();
	    		if (!completed) { // test for answer meeting relevant parameters -- e.g., all questions answered
	    			// if no, show some text saying so and ask them to answer appropriately
	    			$(".no_answer").show()
	    		} else if (!feedback && qnum < 4) {
	    			$("#feedback").show();
	    			$("#click").show()
	    			feedback = true;
	    		} else { // advance to next question
	    			var endTime = (new Date()).getTime(); 
	    			qdata.response = response;
	    			qdata.rt = endTime - startTime;
	    			$(".continue").unbind('click'); // remove this fxn after using it once, so we can reuse the button
	    			$('.rating').attr('checked',false);
	    			experiment.data['q' + qnum + 'data'] = qdata; // add trial data to experiment.data object, which is what we'll eventually submit to MTurk
	    			experiment.next(num + 1);
	    		}
	    	});
	}
	}
};