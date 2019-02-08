var BASE_URL = "http://jsonplaceholder.typicode.com/posts/";
var SEARCH_FIELD = "searchTitle";

var posts = [];
var currentActive = -1;
var totalSuggestions = 0;

function showSuggestions() {
	var search = document.getElementById(SEARCH_FIELD);
	document.getElementById("suggestions").innerText = '';
	clearSuggestionListeners();
	var userInput = search.value;
	if (userInput != "") {
		configureSuggestions(userInput);
	}
	search.addEventListener('keydown', keyboardListener);
}

function configureSuggestions(input){
	var suggestions = document.getElementById("suggestions");
	var titles = getTitles(findMatchingPostsByTitle(input));
	totalSuggestions = titles.length;
	suggestions.addEventListener('click', processSelected, true);
	suggestions.addEventListener('keydown', keyboardListener, true);
	for (var i=0; i<totalSuggestions; i++){
		var div = document.createElement('DIV');
		div.id = i;
		div.classList.add("suggestion");
		var text = document.createTextNode(titles[i]);
		div.appendChild(text);
		suggestions.appendChild(div);
	}
}

function clearSuggestionListeners(){
	var suggestions = document.getElementById("suggestions");
	suggestions.removeEventListener('click', processSelected, true);
	suggestions.removeEventListener('keydown', keyboardListener, true);
}

function highlight(event){
	event.target.classList.toggle("active");
}

function clearPostDetails(event){
	if (document.getElementById(SEARCH_FIELD).value.length == 0){
		document.querySelector("#user_Id").innerText = "";
		document.querySelector("#post_Id").innerText = "";
		document.querySelector("#title").innerText = "";
		document.querySelector("#body").innerText = "";
	}
}

function keyboardListener(event){
	if (document.getElementById(0) == null) return;
// ENTER is pressed
	if (event.keyCode == 13) { 
		highlightedTitle = document.getElementById(currentActive).innerText;
		processSelected(highlightedTitle);
		return;
	}
// key DOWN is pressed
	if (event.keyCode == 40) { 
		handleKeyDownPress();
	}
// key UP is pressed
	else if (event.keyCode == 38) {
		handleKeyUpPress();
	}
}

function handleKeyDownPress(){
	currentActive++;
	if (currentActive > (totalSuggestions - 1)) {
		currentActive = 0;
		document.getElementById((totalSuggestions - 1)).classList.remove("active");
	}
	if (currentActive>0) {
		document.getElementById(currentActive-1).classList.remove("active");
	}
	document.getElementById(currentActive).classList.add("active");
}

function handleKeyUpPress(){
	currentActive--;
	if (currentActive < 0) {
		currentActive = totalSuggestions-1
		document.getElementById("0").classList.remove("active");
	};
	document.getElementById(currentActive).classList.add("active");
	if (currentActive != (totalSuggestions-1)) 
		document.getElementById(currentActive+1).classList.remove("active");	
}

function processSelected(event){
	var search = document.getElementById(SEARCH_FIELD);
	if (highlightedTitle == "") {
		search.value = event.target.innerText;
		showPostDetails(event.target.innerText);
	} else {
		search.value = highlightedTitle;
		showPostDetails(highlightedTitle);
	}
	document.getElementById("suggestions").innerText = '';
	currentActive = -1;
	highlightedTitle = "";
	totalSuggestions = 0;
}

function showPostDetails(title){
	var post = findMatchingPostsByTitle(title);
	document.getElementById("user_Id").innerText = post[0].userId;
	document.getElementById("post_Id").innerText = post[0].id;
	document.getElementById("title").innerText = post[0].title;
	document.getElementById("body").innerText = post[0].body;
}

function getTitles(posts) {
	var titles = [];
	posts.forEach( function(item) {
		titles.push(item.title);
	});
	return titles;
}

function findMatchingPostsByTitle(title) {
	var matchingPosts = [];
	posts.forEach(function(item) {
		if (item.title.startsWith(title)) {
			matchingPosts.push(item);
		}
	});
	return matchingPosts;
}

window.onload = function(){
	var search = document.getElementById(SEARCH_FIELD);
	search.addEventListener("input", showSuggestions);
	search.addEventListener("keyup", clearPostDetails);
	search.autofocus = true;
	getPosts();
}

function getPosts(){
	fetch(BASE_URL)
		.then(res => res.json())
		.then(data => data.forEach(
			function(item){
				posts.push(item);
			})
	);
}