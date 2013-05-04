// Copyright © 2013 Many Tricks (When in doubt, consider this MIT-licensed)


// Basic functionality

var theFilteredURLs = null;
var didSkipSubforumPosts = false;

function filterUnreadPosts(theContext) {
	theFilteredURLs = theContext['com.manytricks.UnreadTabs.URLs'];
	didSkipSubforumPosts = false;
	if (theFilteredURLs) {
		var theNumberOfURLs = theFilteredURLs.length;
		if (theNumberOfURLs>0) {
			if (safari.extension.settings.getItem('com.manytricks.UnreadTabs.SkipSubforumPosts')) {
				var theSubforumFlagsByURL = theContext['com.manytricks.UnreadTabs.SubforumFlags'];
				var i;
				for (i = 0; i<theNumberOfURLs; i++) {
					if (theSubforumFlagsByURL[theFilteredURLs[i]]) {
						theFilteredURLs.splice(i, 1);
						i--;
						theNumberOfURLs--;
						didSkipSubforumPosts = true;
					}
				}
			}
			return theNumberOfURLs;
		}
	}
	return 0;
}

function openUnreadPosts() {
	if (theFilteredURLs) {
		var theNumberOfURLs = theFilteredURLs.length;
		if (theNumberOfURLs>0) {
			var theWindow = safari.application.activeBrowserWindow;
			var theCurrentTab = theWindow.activeTab;
			var theSettings = safari.extension.settings;
			var theFocusSetting = theSettings.getItem('com.manytricks.UnreadTabs.Focus');
			var theNewTabLevel = ((theFocusSetting=='current') ? 'background' : 'foreground');
			if (theSettings.getItem('com.manytricks.UnreadTabs.Position')=='next') {
				var theTabs = theWindow.tabs;
				var theNumberOfTabs = theTabs.length;
				var theIndexToInsertAt = 1;
				var i;
				if (theNumberOfTabs>1) {
					for (i = 0; i<theNumberOfTabs; i++) {
						if (theTabs[i]===theCurrentTab) {
							theIndexToInsertAt = i + 1;
							break;
						}
					}
				}
				for (i = 0; i<theNumberOfURLs; i++) {
					theWindow.openTab(theNewTabLevel, theIndexToInsertAt++).url = theFilteredURLs[i];
				}
			} else {
				for (i = 0; i<theNumberOfURLs; i++) {
					theWindow.openTab(theNewTabLevel).url = theFilteredURLs[i];
				}
			}
			if ((theFocusSetting=='close') && ((!didSkipSubforumPosts) || (!theSettings.getItem('com.manytricks.UnreadTabs.Focus.Smart')))) {
				theCurrentTab.close();
			}
			return true;
		}
	}
	return false;
}


// Event handlers

var theApplication = safari.application;

theApplication.addEventListener('command', function (theEvent) {
	switch (theEvent.command) {
		case 'com.manytricks.UnreadTabs.Menu.Open':
			openUnreadPosts();
			break;
		case 'com.manytricks.UnreadTabs.Toolbar.Open':
			theApplication.activeBrowserWindow.activeTab.page.dispatchMessage('com.manytricks.UnreadTabs.Toolbar.Gather', null);
			break;
		default:
			break;
	}
}, false);

theApplication.addEventListener('contextmenu', function (theEvent) {
	var theNumberOfURLs = filterUnreadPosts(theEvent.userInfo);
	if (theNumberOfURLs>0) {
		var theLanguage = navigator.language;
		var theMenuItemTitle;
		if (theNumberOfURLs==1)  {
			switch (theLanguage) {
				case 'de-at':
				case 'de-ch':
				case 'de-de':
					theMenuItemTitle = 'Ungelesen Beitrag in neuem Tab öffnen';
					break;
				default:
					theMenuItemTitle = 'Open Unread Post in New Tab';
					break;
			}
		} else {
			switch (theLanguage) {
				case 'de-at':
				case 'de-ch':
				case 'de-de':
					theMenuItemTitle = theNumberOfURLs + ' ungelesene Beiträge in neuen Tabs öffnen';
					break;
				default:
					theMenuItemTitle = 'Open ' + theNumberOfURLs + ' Unread Posts in New Tabs';
					break;
			}
		}
		theEvent.contextMenu.appendContextMenuItem('com.manytricks.UnreadTabs.Menu.Open', theMenuItemTitle);
	}
}, false);

theApplication.addEventListener('message', function (theEvent) {
	if ((theEvent.name=='com.manytricks.UnreadTabs.Toolbar.Open.Gathered') && ((filterUnreadPosts(theEvent.message)<1) || (!openUnreadPosts()))) {
		switch (theLanguage) {
			case 'de-at':
			case 'de-ch':
			case 'de-de':
				alert('Konnte auf dieser Seite keine ungelesenen Beiträge finden.');
				break;
			default:
				alert('Couldn\'t find any unread posts on this page.');
				break;
		}
	}
}, false);
