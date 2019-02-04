var BASE_URL = "http://jsonplaceholder.typicode.com/posts/";
var SEARCH_FIELD = "searchTitle";

var posts = [];
var currentActive = -1;
var highlightedTitle = "";
var movingDown = false;
var totalSuggestions = 0;

function showSuggestions() {
	document.getElementById("resp").innerText = '';
	var userInput = document.getElementById(SEARCH_FIELD).value;
	if (userInput != "") {
		var titles = getTitles(findMatchingPostsByTitle(userInput));
		totalSuggestions = titles.length;
		for (var i=0; i<totalSuggestions; i++){
			var div = document.createElement('DIV');
			div.id = i;
			div.classList.add("sug");
			div.classList.add("well");
			div.addEventListener('mouseover', highlight);
			div.addEventListener('mouseout', highlight);
			div.addEventListener('click', processSelected);
			div.addEventListener('keydown', keyboardListener);
			var text = document.createTextNode(titles[i]);
			div.appendChild(text);
			document.getElementById("resp").appendChild(div);
		}
	}
	document.getElementById(SEARCH_FIELD).addEventListener('keydown', keyboardListener);
}

function highlight(event){
	event.target.classList.toggle("active");
}

function clearPostDetails(event){
	event.stopPropagation();
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
		currentActive++;
		if (currentActive > (totalSuggestions - 1)) {
			currentActive = 0;
			document.getElementById((totalSuggestions - 1)).classList.remove("active");
		}
		if (currentActive>0) {document.getElementById(currentActive-1).classList.remove("active");}
		document.getElementById(currentActive).classList.add("active");
// key UP is pressed
	} else if (event.keyCode == 38) {
		currentActive--;
		if (currentActive < 0) {
			currentActive = totalSuggestions-1
			document.getElementById("0").classList.remove("active");
		};
		document.getElementById(currentActive).classList.add("active");
		if (currentActive != (totalSuggestions-1)) 
			document.getElementById(currentActive+1).classList.remove("active");
	}
}

function processSelected(event){
	if (highlightedTitle == "") {
		document.getElementById(SEARCH_FIELD).value = event.target.innerText;
		showPostDetails(event.target.innerText);
	} else {
		document.getElementById(SEARCH_FIELD).value = highlightedTitle;
		showPostDetails(highlightedTitle);
	}
	document.getElementById("resp").innerText = '';
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
	document.getElementById(SEARCH_FIELD).addEventListener("input", showSuggestions);
	document.getElementById(SEARCH_FIELD).addEventListener("keyup", clearPostDetails);
	document.getElementById(SEARCH_FIELD).autofocus = true;
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

