
/** op-webpack-js:/Translate.js
 *
 * @created   2023-01-22
 * @version   1.0
 * @package   op-app-skeleton-2020-nep
 * @author    Tomoaki Nagahara <tomoaki.nagahara@gmail.com>
 * @copyright Tomoaki Nagahara All right reserved.
 */

/* <?php if( OP()->Config('execute')['translate'] ?? null ): ?> */

//	...
(function(){
	//	...
	if(!$OP ){
		$OP = {};
	}

	//	...
	$OP['Translate'] = async function(html, callback){
		//	...
		let item_language_code = 'tranlate_language_code';
		let lang    = localStorage.getItem(item_language_code);
		if(!lang ){
			D('Does not selected language code.');
			return;
		}

		//	...
		let hash = await $OP['Hash'](`${lang}, ${html}`,'SHA-1');
		if(!hash ){
			console.error('Hash is empty.');
			return;
		}

		//	...
		let item = localStorage.getItem(hash);
		if( item ){
			D('Found translated item.', item);
			callback(item);
			return item;
		}

		//	...
		Fetch(lang, html, function(result){
			let item = result[0];
			localStorage.setItem(hash, item);
			callback(item);
		});
	};

	//	...
	function Fetch(lang, html, callback){
		let URL     = 'https://onepiece-framework.com/api/i18n/translate/';
		let method  = "POST";
		let data    = {
			to     : lang,
			string : html,
		};
		let body    = Object.keys(data).map((key)=>key+"="+encodeURIComponent(data[key])).join("&");
		let headers = {
			'Accept'       : 'application/json',
			'Content-Type' : 'application/x-www-form-urlencoded; charset=utf-8',
		};

		//	...
		D(`Fetch: ${URL}`, data);
		fetch(URL, {method, headers, body})
			.then((response) => response.json())
			.then((json) => {
				//	...
				if(!json['status'] ){
					console.error('status is not true', json);
					return;
				}
				//	...
				if( json['errors'] ){
					console.error('has errors', json);
					return;
				}
				//	...
				if( json['result'] === null ){
					console.error('result is empty', json);
					return;
				}
				//	...
				if( json['result']['translate'] === undefined ){
					console.error('translate is empty', json);
					return;
				}
				//	...
				callback( json['result']['translate'] );
			});
		//	fetch()
	} // Fetch()
})();

/* <?php endif; ?> */
