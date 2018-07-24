let _data = [];

chrome.downloads.onDeterminingFilename.addListener(download);

/**chrome.downloads.onDeterminingFilename.addListener(function (item, suggest) {
	suggest({
		filename: 'torrents/' . item.filename
	});
});*//*test this*/

function download(downloadItem) {
	let id = downloadItem.id,
		ext = downloadItem.filename.split('.')[downloadItem.filename.split('.').length - 1];

	chrome.storage.local.get(['downloadSorter_data'], function(result) {
		if (result.downloadSorter_data != '')
			_data = result.downloadSorter_data;

		_data.push({
    		extension_file: extension_file,
			path_folder: path_folder
    	});
	});

	let file_load = true;

	if (downloadItem.url.split('/')[downloadItem.url.split('/').length - 1].split('.').length >= 2) {
		chrome.downloads.cancel(id);

	_data.forEach(function(el, i, arr) {
		if (el.extension_file == ext) {
			chrome.downloads.download({
				url: downloadItem.url,
				filename: el.path_folder + '\\' + downloadItem.filename
			}, function() {
				chrome.downloads.onDeterminingFilename.removeListener(download);
				add_listener();
			});
			file_load = false;
		}
	});

	if (file_load) {
		chrome.downloads.download({
			url: downloadItem.url
		}, function() {
			chrome.downloads.onDeterminingFilename.removeListener(download);
			add_listener();
		});
	}
}
}

function add_listener() {
	var start = new Date();
	var i = 0;
	setImmediate(function go() {
		i++;
		if (i == 500) {
        	chrome.downloads.onDeterminingFilename.addListener(download);
        } else {
        	setImmediate(go);
        }
    });
}

if (!window.setImmediate) window.setImmediate = (function() {
  	var head = { }, tail = head;

  	var ID = Math.random();

  	function onmessage(e) {
    	if(e.data != ID) return;
    	head = head.next;
    	var func = head.func;
    	delete head.func;
    	func();
  	}

    window.addEventListener('message', onmessage);

 	return function(func) {
    	tail = tail.next = { func: func };
    	window.postMessage(ID, "*");
 	};
}());