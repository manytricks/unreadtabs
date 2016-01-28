// Copyright © 2013-2016 Many Tricks (When in doubt, consider this MIT-licensed)


// Basic functionality

function unreadPostsContext() {
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

				XenForo:
					/unread$
		
				Burning Board:
					[&?]action=firstnew

		*/
		var thePotentialSubforumExpression = /[&?]goto=newpost|-new(-post)?\.htm/i;	// vBulletin
		var theOtherExpression = /\/unread$|[&?]action=firstnew/i;	// everything else
		var i;
		var anAnchor;
		var aURL;
		var isPotentialSubforumMatch;
		var isSubforumAnchor;
		for (i = 0; i<theNumberOfAnchors; i++) {
			anAnchor = theAnchors[i];
			aURL = anAnchor.href;
			if (aURL) {
				isPotentialSubforumMatch = thePotentialSubforumExpression.test(aURL);
				if (isPotentialSubforumMatch || theOtherExpression.test(aURL)) {
					isSubforumAnchor = (isPotentialSubforumMatch && (anAnchor.getElementsByTagName('img').length<1) && (window.getComputedStyle(anAnchor).backgroundImage=='none'));
					if (theURLs.indexOf(aURL)===-1) {
						theURLs.push(aURL);
						theSubforumFlagsByURL[aURL] = isSubforumAnchor;
					} else if (!isSubforumAnchor) {
						theSubforumFlagsByURL[aURL] = false;
					}
				}
			}
		}
	}
	return {
		'com.manytricks.UnreadTabs.PageURL': document.location.href,
		'com.manytricks.UnreadTabs.SubforumFlags': theSubforumFlagsByURL,
		'com.manytricks.UnreadTabs.UnreadPostURLs': theURLs
	};
}


// Event handlers

document.addEventListener('contextmenu', function (theEvent) {
	safari.self.tab.setContextMenuEventUserInfo(theEvent, unreadPostsContext());
}, false);

safari.self.addEventListener('message', function (theEvent) {
	if (window.top==window.self) {
		switch (theEvent.name) {
			case 'com.manytricks.UnreadTabs.Toolbar.Gather':
				safari.self.tab.dispatchMessage('com.manytricks.UnreadTabs.Toolbar.Gathered', unreadPostsContext());
				break;
			case 'com.manytricks.UnreadTabs.Toolbar.Validate':
				safari.self.tab.dispatchMessage('com.manytricks.UnreadTabs.Toolbar.Validated', unreadPostsContext());
				break;
			default:
				break;
		}
	}
}, false);


// Disable button while the page is loading

safari.self.tab.dispatchMessage('com.manytricks.UnreadTabs.Toolbar.Validated', {
	'com.manytricks.UnreadTabs.PageURL': document.location.href
});
