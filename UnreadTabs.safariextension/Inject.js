// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

document.addEventListener("contextmenu", function(theEvent) {
	var theURLs = [];
	var theAnchors = document.getElementsByTagName("a");
	var i;
	var aURL;
	var aLowercaseURL;
	for (i = 0; i<theAnchors.length; i++) {
		aURL = theAnchors[i].href;
		aLowercaseURL = aURL.toLowerCase();
		if (
			(aLowercaseURL.indexOf("goto=newpost")!==-1) ||			/* vBulletin */
			(aLowercaseURL.indexOf("-new.htm")!==-1) ||					/* vBulletin */
			(aLowercaseURL.indexOf("action=firstnew")!==-1) ||		/* Burning Board */
		false) {
			theURLs.push(aURL);
		}
	}
	safari.self.tab.setContextMenuEventUserInfo(theEvent, theURLs);
}, false);
