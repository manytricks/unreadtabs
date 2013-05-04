// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)


// Basic functionality

function gatherUnreadPostsContext() {
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
				isSubforumAnchor = ((anAnchor.getElementsByTagName('img').length<1) && (window.getComputedStyle(anAnchor).backgroundImage=='none'));
				if (theURLs.indexOf(aURL)===-1) {
					theURLs.push(aURL);
					theSubforumFlagsByURL[aURL] = isSubforumAnchor;
				} else if (!isSubforumAnchor) {
					theSubforumFlagsByURL[aURL] = false;
				}
			}
		}
	}
	return {
		'com.manytricks.UnreadTabs.URLs': theURLs,
		'com.manytricks.UnreadTabs.SubforumFlags': theSubforumFlagsByURL
	};
}


// Event handlers

document.addEventListener('contextmenu', function (theEvent) {
	safari.self.tab.setContextMenuEventUserInfo(theEvent, gatherUnreadPostsContext());
}, false);

safari.self.addEventListener('message', function (theEvent) {
	if ((theEvent.name=='com.manytricks.UnreadTabs.Toolbar.Gather') && (window.top==window.self)) {
		safari.self.tab.dispatchMessage('com.manytricks.UnreadTabs.Toolbar.Open.Gathered', gatherUnreadPostsContext());
	}
}, false);
