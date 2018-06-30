let _data = [];

chrome.downloads.onDeterminingFilename.addListener(download);

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

	chrome.downloads.cancel(id);

	let file_load = true;
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

	console.log(downloadItem.referrer);

	if (file_load) {
		chrome.downloads.download({
			url: downloadItem.url
		}, function() {
			chrome.downloads.onDeterminingFilename.removeListener(download);
			add_listener();
		});
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

function update_table(argument) {
	$('#table').html('');
	chrome.storage.local.get(['downloadSorter_data'], function(result) {
		_data = result.downloadSorter_data;
		let html = '<tr><th>Тип файла:</th><th>Путь:</th><th></th></tr>';

		if (_data != undefined) {
			_data.forEach(function(item, i, arr) {
				html += '<tr><td class="extension_file">' + item.extension_file + '</td><td>' + item.path_folder + '</td><td><button class="del_button" id="' + i + '">Удалить</button></td></tr>';
			});
		} else {
			chrome.storage.local.set({'downloadSorter_data': ''});
		}

		$('#table').html($('#table').html() + html + '<tr><td><input type="text" id="extension_file"></td><td><input type="text" id="path_folder"></td><td><button class="add_button">Добавить</button></td></tr>');
   	});
}

$(document).ready(function($) {
	update_table();

	$('#table').on('click', '.add_button', function(event) {		
		let extension_file = $('#extension_file').val();
		let path_folder = $('#path_folder').val();
		_data = [];

		chrome.storage.local.get(['downloadSorter_data'], function(result) {
			if (result.downloadSorter_data != '')
				_data = result.downloadSorter_data;

			_data.push({
    			extension_file: extension_file,
				path_folder: path_folder
    		});

			chrome.storage.local.set({'downloadSorter_data': _data}, function() {
				update_table();

				$('#extension_file').val("");
				$('#path_folder').val("");
			});
   		});
	});

	$('#table').on('click', '.del_button', function(event) {
		chrome.storage.local.get(['downloadSorter_data'], function(result) {
			if (result.downloadSorter_data != '')
				_data = result.downloadSorter_data;  

			_data.splice(event.target.getAttribute('id'), 1);

			chrome.storage.local.set({'downloadSorter_data': _data}, function() {
				update_table();
			});
   		});
	});
});
