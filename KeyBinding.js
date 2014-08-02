/*
 * Object that holds all of the bindings and key states
 */
var KeyBinding = {
	// will hold all the states and functions
	keyFuncMap : {},

	/*
	 * Extracts the key code of the key from the event
	 *
	 * KeyboardEvent evt , the keyboard event that contains the key
	 *
	 * return int , the code of the key
	 */
	getKeyCode : function(evt) {
		return (evt.which) ? evt.which : evt.keyCode
	},
};


/*
 * Establishes a bound key
 *
 * String k , the key to bind to
 * 
 * Object functions , can have onkeydown, onkeyup, and/or onkeypress properties which are functions to execute
 * 		      If left undefined, then the key's state will be updated only
 */
KeyBinding.bind_key = function(k, functions){
	// make so you can add on other functions
	KeyBinding.keyFuncMap[k.toUpperCase().charCodeAt()] = [false, functions];
};


/*
 * Whether or not the given key is down
 *
 * String k , the key in question
 *
 * return boolean , state of the key
 */
KeyBinding.isKeyDown = function(k){
	var code = k.toUpperCase().charCodeAt();
	if (KeyBinding.keyFuncMap[code])
		return KeyBinding.keyFuncMap[code][0];
	
	return undefined;
};


/*
 * Calls the onkeydown method corresponding to the depressed key
 *
 * KeyboardEvent e , the keyboard event that contains which key was depressed
 */
document.onkeydown = function(e){
	var code = KeyBinding.getKeyCode(e);
	if (KeyBinding.keyFuncMap[code]){
		KeyBinding.keyFuncMap[code][0] = true;
		
		if (KeyBinding.keyFuncMap[code][1].onkeydown){ 
			KeyBinding.keyFuncMap[code][1].onkeydown();
		}
	}	
};


/*
 * Calls the onkeyup method corresponding to the key lifted
 *
 * KeyboardEvent e , the keyboard event that contains which key was lifted
 */
document.onkeyup = function(e){
	var code = KeyBinding.getKeyCode(e);
	if (KeyBinding.keyFuncMap[code]){
		KeyBinding.keyFuncMap[code][0] = false;
		
		if (KeyBinding.keyFuncMap[code][1].onkeyup){
			KeyBinding.keyFuncMap[code][1].onkeyup();
		}
	}	
};


/*
 * Calls the onkeypress method corresponding to the pressed key
 *
 * KeyboardEvent e , the keyboard event that contains which key was pressed
 */
document.onkeypress = function(e){
	var code = KeyBinding.getKeyCode(e);
	if (KeyBinding.keyFuncMap[code]){
		if (KeyBinding.keyFuncMap[code][1].onkeypress){
			KeyBinding.keyFuncMap[code][1].onkeypress();
			KeyBinding.keyFuncMap[code][0] = false;
		}
	}	
};

/* */