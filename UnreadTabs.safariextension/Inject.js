// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

document.addEventListener('contextmenu', function (theEvent) {
	var theURLs = [];
	var theAnchors = document.getElementsByTagName('a');
	var theNumberOfAnchors = theAnchors.length;
	if (theNumberOfAnchors>0) {
		/*
			Match the following URL fragments...

				vBulletin:
					[&?]goto=newpost
					-new(-post).htm
		
				Burning Board:
					[&?]action=firstnew

		*/
		var theRegularExpression = /[&?]goto=newpost|-new(-post)?\.htm|[&?]action=firstnew/i;
		var anAnchorIndex;
		var aURL;
		for (anAnchorIndex = 0; anAnchorIndex<theNumberOfAnchors; anAnchorIndex++) {
			aURL = theAnchors[anAnchorIndex].href;
			if ((aURL) && (aURL.match(theRegularExpression)) && (theURLs.indexOf(aURL)===-1)) {
				theURLs.push(aURL);
			}
		}
	}
	safari.self.tab.setContextMenuEventUserInfo(theEvent, theURLs);
}, false);