

// Transforma l'obejte xml rebut a una cadena de text
//------------------------------------------------------------
function xmlToString(xmlData) { 
	var xmlString;
	//IE
	if (window.ActiveXObject){
		xmlString = xmlData.xml;
	}
	// code for Mozilla, Firefox, Opera, etc.
	else{
		xmlString = (new XMLSerializer()).serializeToString(xmlData);
	}
	return xmlString;
} 

// Retorna un xml per mostra a una p�gina web
//------------------------------------------------------------
function printXmltoWeb(xmlData) { 
	var s = xmlData.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/    /g, "");
	
	return "<pre>" + s + "</pre>";
} 

/* Retorna un xml per mostra a una p�gina web
 msg: missatge a imprimir
 type: 0 -> no mostrar,
	   1 -> mostrar per pantalla
 box: capa on mostrar els logs
*/
//------------------------------------------------------------
function printLogs(msg, type, box) {	
	console.log(msg);
	
	if (type==1){
		if(!box || box=="") box="#logs";
		$(box).append( `${msg}<BR/>` );
	}
} 