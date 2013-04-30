// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)

document.addEventListener('contextmenu', function (theEvent) {
	var theURLs = new Array();
	var theSubforumFlagsByURL = new Object();
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
		var i;
		var anAnchor;
		var aURL;
		var isSubforumAnchor;
		for (i = 0; i<theNumberOfAnchors; i++) {
			anAnchor = theAnchors[i];
			aURL = anAnchor.href;
			if ((aURL) && (aURL.match(theRegularExpression))) {
				isSubforumAnchor = (anAnchor.getElementsByTagName('img').length<1);
				if (theURLs.indexOf(aURL)===-1) {
					theURLs.push(aURL);
					theSubforumFlagsByURL[aURL] = isSubforumAnchor;
				} else if (!isSubforumAnchor) {
					theSubforumFlagsByURL[aURL] = false;
				}
			}
		}
	}
	safari.self.tab.setContextMenuEventUserInfo(theEvent, {
		'com.manytricks.UnreadTabs.URLs': theURLs,
		'com.manytricks.UnreadTabs.SubforumFlags': theSubforumFlagsByURL
	});
}, false);
