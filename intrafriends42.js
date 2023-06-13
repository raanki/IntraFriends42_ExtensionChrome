









/*** I don't know the creator it's fixed by @ranki. 
 I don't create the extension, I just fix the photo problem and add a scroll bar***/








var friends = [];
var friends_data = [];
var timeout_get_friends;
var button_zone = document.getElementsByClassName("pull-right")[0].innerHTML;

function get_friends()
{
	chrome.storage.sync.get("friends", function(result)
	{
		friends_data = [];
		friends = result.friends == null ? [] : JSON.parse(result.friends);
		friends.forEach(function(friend)
		{
			var url = 'https://profile.intra.42.fr/users/' + friend;
			var xmlHttp = new XMLHttpRequest();
			xmlHttp.open("GET", url, false);
			xmlHttp.send();
			friends_data.push(JSON.parse(xmlHttp.responseText));
		});
		init_bar();
		timeout_get_friends = setTimeout(get_friends, 1000 * 60);

		if (document.location.href.startsWith("https://profile.intra.42.fr/users/"))
		{
			var friend = document.getElementsByClassName("login")[0].getAttribute("data-login");
			var button = "";

			if (friends.includes(friend))
			{
				button = '<span id="remove_specified_friend" style="display: block;color: white;width: 200px;text-align: center;cursor: pointer;">Remove from friends</span>';
				document.getElementsByClassName("pull-right")[0].innerHTML = DOMPurify.sanitize(button + button_zone);
				document.getElementById("remove_specified_friend").addEventListener("click", remove_specified_friend);
			}
			else
			{
				button = '<span id="add_specified_friend" style="display: block;color: white;width: 150px;text-align: center;cursor: pointer;">Add to friends</span>';
				document.getElementsByClassName("pull-right")[0].innerHTML = DOMPurify.sanitize(button + button_zone);
				document.getElementById("add_specified_friend").addEventListener("click", add_specified_friend);
			}
		}
	});
}

function init_bar()
{
	var new_bar = "";//'<li><a class="inactive" href="https://profile.intra.42.fr"><span class="icon-user-2"></span><span class="visible-overlay">Profile</span></a></li><li><a class="inactive" href="https://projects.intra.42.fr"><span class="icon-network-2-1"></span><span class="visible-overlay">Projets</span></a></li><li><a class="inactive" href="https://elearning.intra.42.fr"><span class="icon-movie-play-1"></span><span class="visible-overlay">E-learning</span></a></li><li><a class="inactive" href="https://forum.intra.42.fr"><span class="icon-bubble-conversation-5"></span><span class="visible-overlay">Forum</span></a></li><li><a class="inactive" href="https://companies.intra.42.fr"><span class="icon-briefcase"></span><span class="visible-overlay">Companies</span></a></li><li><a class="inactive" href="https://meta.intra.42.fr"><span class="icon-compass-2"></span><span class="visible-overlay">Meta</span></a></li><li><a class="inactive" href="https://shop.intra.42.fr"><span class="icon-shopping-1"></span><span class="visible-overlay">Shop</span></a></li>';
	friends_data.forEach(function(friend)
	{
		var login = friend.login;
		var profile_picture = friend.image.link;
		var localisable = (friend.location == null ? false : true);
		var location = localisable ? friend.location : "-";
		new_bar +=	'<li style="padding-top: 0px;">';
		new_bar +=	'	<a class="inactive" href="https://profile.intra.42.fr/users/' + login + '" style="font-size: 14px;">';
		new_bar +=	'		<span class="icon-friend" style="color: rgba(0,0,0,0);background-image: url(' + profile_picture + ');background-size: 100%;background-position: center;width: 70%;height: 70%;border-radius: 35px;' + (localisable ? '' : 'opacity: 0.4;') + '">';
		new_bar +=	'		</span>';
		new_bar +=			location;
		new_bar +=	'		<span class="visible-overlay">';
		new_bar +=				login
		new_bar +=	'		</span>';
		new_bar +=	'	</a>';
		new_bar +=	'</li>';
	});
	var friendsbar = document.getElementById("friends");
		friendsbar.innerHTML = DOMPurify.sanitize(new_bar);
		friendsbar.style.overflowY = "auto";


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    #friends::-webkit-scrollbar {
        width: 3px;
    }

    #friends::-webkit-scrollbar-track {
        background: #f1f1f1; 
    }
  
    #friends::-webkit-scrollbar-thumb {
        background: #888; 
    }
  
    #friends::-webkit-scrollbar-thumb:hover {
        background: #555; 
		cursor: pointer;
    }
`;
document.getElementsByTagName('head')[0].appendChild(style);

}

function add_specified_friend()
{
	var friend = document.getElementsByClassName("login")[0].getAttribute("data-login");
	friends.push(friend);
	chrome.storage.sync.set({friends: JSON.stringify(friends)}, function()
	{
		clearTimeout(timeout_get_friends);
		get_friends();
	});
}

function remove_specified_friend()
{
	var friend = document.getElementsByClassName("login")[0].getAttribute("data-login");
	var index_friend = friends.indexOf(friend);
	friends.splice(index_friend, 1);
	chrome.storage.sync.set({friends: JSON.stringify(friends)}, function()
	{
		clearTimeout(timeout_get_friends);
		get_friends();
	});
}

document.getElementsByClassName("main-left-navbar")[0].innerHTML += DOMPurify.sanitize('<div id="friends"></div>');
get_friends();
