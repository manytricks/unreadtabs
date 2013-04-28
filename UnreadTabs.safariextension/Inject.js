// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

document.addEventListener('contextmenu', function(theEvent) {
	var theURLs = [];
	var theAnchors = document.getElementsByTagName('a');
	var theNumberOfAnchors = theAnchors.length;
	if (theNumberOfAnchors>0) {
		/*
			vBulletin:
				[&?]goto=newpost
				-new.htm
				-new-post.htm
		
			Burning Board:
				[&?]action=firstnew
		*/
		var theRegularExpression = /[&?]goto=newpost|-new\.htm|-new-post\.htm|[&?]action=firstnew/i;
		var i;
		var aURL;
		for (i = 0; i<theAnchors.length; i++) {
			aURL = theAnchors[i].href;
			if ((aURL) && (aURL.match(theRegularExpression)) && (theURLs.indexOf(aURL)===-1)) {
				theURLs.push(aURL);
			}
		}
	}
	safari.self.tab.setContextMenuEventUserInfo(theEvent, theURLs);
}, false);
