function maketheirpuzzle(theirpuzzle){ // Creates the form for a user-inputed cryptogram
	theirpuzzle=theirpuzzle.toUpperCase(); // Changes puzzle into uppercase letters.
	theirpuzzle = theirpuzzle.split(" ");
	var alphareg=/[a-zA-Z]/;
	var tablestart = '<table class="gram">';
	var tableend = "</table>";
	var rowstart = "<tr>";
	var rowend = "</tr>";
	var cellstart = "<td>";
	var cellend = "</td>";
	var i, j, qword, qletter;
	var tomake = '<form id="puzzleform">';
	var indexforid = 0;
	for (i=0;i<theirpuzzle.length;i++){ // for each word in the quote
		qword = theirpuzzle[i];
		tomake=tomake + tablestart + rowstart; //start a table, row, and cell
		for (j=0;j<qword.length;j++){
			qletter = qword.charAt(j);
			if (alphareg.test(qletter)){
				tomake = tomake + cellstart + '<input type=text maxlength="1" size="1" class="' + qletter + '" id="' + indexforid +'">' + cellend;
				indexforid++;
			}
			else{
				tomake = tomake + cellstart + qletter + cellend;
			}
		}
		tomake = tomake + rowend + rowstart;
		for (j=0;j<qword.length;j++){
			tomake = tomake + cellstart + qword.charAt(j) + cellend;
		}
		tomake = tomake + rowend + tableend + " ";
	}
	tomake = tomake + '</form>';
	document.getElementById("puzzle").innerHTML = tomake;
	document.getElementById("helps").style.display = "block"; // Show the helps div 
}

function updateLetters (letter, lclass){ //Update all occurrences of the letter, which will show up as the second letter in the class.
	var positions = document.getElementsByClassName(lclass); //Get all instances of the class.
	var i;
	for (i=0;i<positions.length;i++){
		positions[i].value = letter.toUpperCase(); //Convert the value in the input to the guess in uppercase.
		if (positions[i].style.backgroundColor!="#AAFFAA"){ //If the letter had previously been guessed wrong, this updates the background. Then update other style bits to make them consistent.
			positions[i].style.backgroundColor="#FFFFFF";
		}
		positions[i].style.width = "1.2em";
		positions[i].style.border = "1px solid black";
	}
	checkpuzzle("update"); //Check to see if the puzzle was solved.
}

function clearwrong(){ //Clear incorrect guesses.
	var cells = puzzleform.getElementsByTagName("input");
	var plength=cells.length;
	var i, cellid, cellclass, userinput, correctletter;
	for (i=0; i<plength; i++){ // Go through all the inputs in the puzzle and check the value vs the correct value.
		cellclass=cells[i].className; 
		userinput=cells[i].value;
		cellid=cells[i].id;
		correctletter = cellclass.charAt(1);
		if (userinput != correctletter){
			document.getElementById(cellid).style.backgroundColor = "#FFFFFF";
			document.getElementById(cellid).style.border = "1px solid black";
			document.getElementById(cellid).value="";
		}
	}
}

function hint(){ // Give the user a hint.
	do { //Pick a random letter that the user hasn't already gotten right.
		var cells=puzzleform.getElementsByTagName("input");
		var plength = cells.length;
		var tohint= Math.floor(Math.random()* plength)
		var tochange=cells[tohint].className;
		var changeto = tochange.charAt(1);
		var existingvalue = cells[tohint].value;
	} while (existingvalue == changeto)
	var positions = document.getElementsByClassName(tochange); //Get all occurrences of the class we're changing.
	var i, cell;
	for (i=0;i<positions.length;i++){ //Replace the input with text in each occurrence and update the style so this hopefully all stays the same.
		$(positions[i]).closest("td")
			.addClass(tochange)
			.text(changeto)
			.css("border","1px solid black")
			.css("width","1.2em")
			.css("background-color", "#AAAAFF")
			.css("padding","0");
	}
	checkpuzzle("update"); // Check the puzzle to see if the user is done.
}

function solve(){ //Solve the puzzle for the user.
	var cells = puzzleform.getElementsByTagName("input"); // Get all inputs in the form.
	var plength=cells.length;
	var i, cellid, cellclass, correctletter;
	for (i=0; i<plength; i++){ //Go through each input.
		cellclass=cells[i].className;
		cellid=cells[i].id;
		correctletter = cellclass.charAt(1);
		document.getElementById(cellid).value=correctletter;
		document.getElementById(cellid).style.backgroundColor = "#AAAAFF";
		document.getElementById(cellid).style.border = "1px solid black";
		document.getElementById(cellid).style.width = "1.2em";
	}
	alert("The puzzle is complete. Better luck with the next one!");
}

function resetpuzzle(){ // Reset all elements. Won't reset hinted answers. 
	document.getElementById('puzzleform').reset();
	var cells=puzzleform.getElementsByTagName("input");
	var plength=cells.length;
	var cellid, i;
	for (i=0; i<plength; i++){
		cellid=cells[i].id;
		document.getElementById(cellid).style.background="#FFFFFF";
		document.getElementById(cellid).style.border = "1px solid black";
	}
}

function checkpuzzle(when){ //Check the puzzle for correct answers. "when" is when the function is called, so that it doesn't automatically display the colored cells if called by one of the other functions.
	var cells = puzzleform.getElementsByTagName("input"); // Get all inputs in the form.
	var plength=cells.length;
	var numErrors = numBlank = numCorrect= 0;
	var i, cellid, cellclass, userinput, correctletter;
	for (i=0; i<plength; i++){ //Go through each input.
		cellclass=cells[i].className;
		userinput=cells[i].value;
		cellid=cells[i].id;
		correctletter = cellclass.charAt(1);
		if (userinput == correctletter){ 
			if (when!="update"){
				document.getElementById(cellid).style.backgroundColor = "#AAFFAA";
				document.getElementById(cellid).style.border = "1px solid black";
				document.getElementById(cellid).style.width = "1.2em";
			}
			numCorrect++;
		} else if (!userinput){
			if (when!="update"){
				document.getElementById(cellid).style.backgroundColor = "#FFFFFF";
				document.getElementById(cellid).style.border = "1px solid black";
				document.getElementById(cellid).style.width = "1.2em";
			}
			numBlank++;
		} else {
			if (when!="update"){
				document.getElementById(cellid).style.backgroundColor = "#FFAAAA";
				document.getElementById(cellid).style.border = "1px solid black";
				document.getElementById(cellid).style.width = "1.2em";
			}
			numErrors++;
		}
	}
	if (numBlank==0 && numErrors==0){
		alert("Congratulations! You solved the puzzle!");
	}
}

function scramblealpha(original){
	var i;
	var copyalpha = [];
	for (i = 0; i < original.length; i++){ // copy the original array into two.
		copyalpha.push(original[i]);
	}
	var scrambledalphabet=[".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."];
	var randomnumbercopy, randomnumberscram, copylength, originalplace,  newletter, scramletter,newplace, gapletter;
	copylength = copyalpha.length;
	do{
		randomnumbercopy = Math.floor(Math.random()*copylength);
		newletter=copyalpha[randomnumbercopy];
		originalplace = original.indexOf(newletter);
		newplace=scrambledalphabet.indexOf(".");
		if (originalplace == newplace){
			newplace = scrambledalphabet.indexOf(".", newplace+1);
		}
		scrambledalphabet[newplace] = newletter;
		copyalpha.splice(randomnumbercopy,1);
		copylength = copyalpha.length;
	} while (copylength >1);
	//need a different method to make sure that there aren't repeat letters or it doesn't get stuck in a loop.
	newletter = copyalpha[0];
	originalplace = original.indexOf(newletter);
	newplace = scrambledalphabet.indexOf(".");
	if (originalplace != newplace){
		scrambledalphabet[newplace] = newletter;
	} else {
		do {
			randomnumbercopy = Math.floor(Math.random()*26);
		} while (randomnumbercopy == newplace);
		gapletter = scrambledalphabet[randomnumbercopy];
		scrambledalphabet[randomnumbercopy] = newletter;
		scrambledalphabet[newplace] = gapletter;
	}
	return scrambledalphabet;
}

function getcryptogram (quote) {
	var originalalphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	var newalphabet = scramblealpha(originalalphabet);
	var qlength = quote.length;
	var i, letter, newletter, oindex;
	var scrambledquote=[];
	for (i=0;i<=qlength;i++){
		letter = quote.charAt(i);
		oindex = originalalphabet.indexOf(letter);
		if (oindex!=-1){ // if the letter is actually a letter,in other words
			newletter = newalphabet[oindex]; // the new letter will be in the same position, just in the scrambled alphabet
			scrambledquote[i]=newletter;
		}
		else{
			scrambledquote[i]=letter;
		}
	}
	var quotetostring = scrambledquote.join("");
	var quotetowords = quotetostring.split(" ");
	var purequote = quote.split(" ");
	var tablestart = '<table class="gram">';
	var tableend = "</table>";
	var rowstart = "<tr>";
	var rowend = "</tr>";
	var cellstart = "<td>";
	var cellend = "</td>";
	var j, qword, qletter, oletter, oword;
	var tomake = '<form id="puzzleform">';
	var indexforid = 0;
	for (i=0;i<quotetowords.length;i++){ // for each word in the quote
		qword = quotetowords[i];
		oword = purequote[i];
		tomake=tomake + tablestart + rowstart; //start a table, row, and cell
		for (j=0;j<qword.length;j++){
			qletter = qword.charAt(j);
			oletter = oword.charAt(j);
			if (newalphabet.indexOf(qletter)!=-1){
				tomake = tomake + cellstart + '<input type=text maxlength="1" size="1" class="' + qletter + oletter + '" id="' + indexforid +'">' + cellend;
				indexforid++;
			}
			else{
				tomake = tomake + cellstart + qletter + cellend;
			}
		}
		tomake = tomake + rowend + rowstart;
		for (j=0;j<qword.length;j++){
			tomake = tomake + cellstart + qword.charAt(j) + cellend;
		}
		tomake = tomake + rowend + tableend + " ";
	}
	tomake = tomake + '</form>';
	document.getElementById("puzzle").innerHTML = tomake;
}

function loadJSON(){ // 	http://stackoverflow.com/questions/9363107/getting-response-from-server-in-javascript
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			var jsonObj = JSON.parse(xmlhttp.responseText);
			var quotation = jsonObj.quotation.toUpperCase();
			var author = jsonObj.author.toUpperCase();
			var quotestring = quotation + "-" + author;
			getcryptogram(quotestring);
		}
	}
	xmlhttp.open("Get","http://hogsmeade.us/cryptofun/gogetit.php",true);
	xmlhttp.send();
}

function createtoprint(newquote){
	var originalalphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
	var newalphabet = scramblealpha(originalalphabet);
	newquote = newquote.toUpperCase();
	var qlength = newquote.length;
	var i, letter, newletter, oindex;
	var scrambledquote=[];
	for (i=0;i<=qlength;i++){
		letter = newquote.charAt(i);
		oindex = originalalphabet.indexOf(letter);
		if (oindex!=-1){ // if the letter is actually a letter,in other words
			newletter = newalphabet[oindex]; // the new letter will be in the same position, just in the scrambled alphabet
			scrambledquote[i]=newletter;
		}
		else{
			scrambledquote[i]=letter;
		}
	}
	var quotetostring = scrambledquote.join("");
	var quotetowords = quotetostring.split(" ");
	var alphareg=/[a-zA-Z]/;
	var tablestart = '<table class="gram">';
	var tableend = "</table>";
	var rowstart = "<tr>";
	var rowend = "</tr>";
	var cellstart = "<td>";
	var cellend = "</td>";
	var j, qword, qletter;
	var tomake = "";
	for (i=0;i<quotetowords.length;i++){ // for each word in the quote
		qword = quotetowords[i];
		tomake=tomake + tablestart + rowstart; //start a table, row, and cell
		for (j=0;j<qword.length;j++){
			qletter = qword.charAt(j);
			if (alphareg.test(qletter)){
				tomake = tomake + cellstart + "_" + cellend;
			}
			else{
				tomake = tomake + cellstart + qletter + cellend;
			}
		}
		tomake = tomake + rowend + rowstart;
		for (j=0;j<qword.length;j++){
			tomake = tomake + cellstart + qword.charAt(j) + cellend;
		}
		tomake = tomake + rowend + tableend + " ";
	}
	tomake = tomake + '</form>';
	document.getElementById("puzzle").innerHTML = tomake;
}