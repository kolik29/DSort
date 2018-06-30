let _data = [];

function update_table(argument) {
	$('#table').html('');
	chrome.storage.local.get(['downloadSorter_data'], function(result) {
		_data = result.downloadSorter_data;
		let html = '<tr><th>Тип файла:</th><th>Папка:</th><th>&nbsp</th></tr>';

		if (_data != undefined) {
			_data.forEach(function(item, i, arr) {
				html += '<tr><td class="extension_file">' + item.extension_file + '</td><td>' + item.path_folder + '</td><td><div class="del_button" id="' + i + '" title="Удалить"></div></td></tr>';
			});
		} else {
			chrome.storage.local.set({'downloadSorter_data': ''});
		}

		$('#table').html($('#table').html() + html + '<tr><td><input type="text" id="extension_file" placeholder="Расширение файла"></td><td><input type="text" id="path_folder" placeholder="Название папки"></td><td><div class="add_button" title="Добавить"></div></td></tr>');
   	});
}

$(document).ready(function($) {
	update_table();

	$('#table').on('click', '.add_button', function(event) {
		let extension_file = $('#extension_file').val();
		let path_folder = $('#path_folder').val();
		_data = [];

		if ((extension_file != '') && (path_folder != '')) {
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
		}
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

	$('#table').on('keypress', 'input', function(key) {
		if ((key.charCode >= 33 && key.charCode <= 46) || (key.charCode >= 58 && key.charCode <= 64) || (key.charCode >= 91 && key.charCode <= 96) || (key.charCode >= 123 && key.charCode <= 126)) {
			return false;
		}
	});

	$('#table').on('keypress', '#extension_file', function(key) {
		if (key.charCode == 47) {
			return false;
		}
	});
});
