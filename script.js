let _data = [];

function update_table(argument) {
	$('#table').html('');
	chrome.storage.local.get(['downloadSorter_data'], function(result) {
		_data = result.downloadSorter_data;
		let html = '<tr><td></td><th>Тип файла:</th><th>Путь:</th></tr>';

		if (_data != undefined) {
			_data.forEach(function(item, i, arr) {
				html += '<tr><td><input class="check" type="checkbox" id="' + i + '" /></td><td class="extension_file">' + item.extension_file + '</td><td>' + item.path_folder + '</td></tr>';
			});
		} else {
			chrome.storage.local.set({'downloadSorter_data': ''}, function() {});
		}

		$('#table').html($('#table').html() + html);
   	});
}

$(document).ready(function($) {
	update_table();

	$('#add').click(function(event) {		
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

	$('#delete').click(function(event) {
   		let checked = [];

   		$('.check').each(function(index, el) {
   			if ($(this).prop('checked')){
   				checked.push($(this).attr('id'));
   			}
   		});

   		
		chrome.storage.local.get(['downloadSorter_data'], function(result) {
			if (result.downloadSorter_data != '')
				_data = result.downloadSorter_data;  

			for (var i = checked.length - 1; i >= 0; i--)
  				_data.splice(checked[i], 1);

			chrome.storage.local.set({'downloadSorter_data': _data}, function() {
				update_table();
			});
   		});
	});
});