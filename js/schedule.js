// Fitxers horaris
var fGestibExportacioBase;   // curs base 2018-19. Mai canvia
var fGestibExportacioActual; //curs 2021-22
let fUntilsExportacioActual="ExportacioDadesHoraris.xml"; // ara curs 2021-2022
 
let xmlPlaces;

let xmlHorariActual; // Horari generat

const CODI_SUBMATERIA_MINIMA = 1860000;// codi mínim de submatiera curs actual

// Taula d'equivalència entre les dades base (any 2018-19) i l'actual (ara 2019-20)
var mEquivalencia = [];
var mEquivalenciaGrups = [];
var mEquivalenciaAules = [];

  	// Genera la taula de equivalència de submatèries entre codis antics i nous del gestib del nou curs
	/****************************************************************************/
	function generaTaulaEquivalencia(fGestibExportacioBase, fGestibExportacioActual){
		let submateriesTable = '<table id="submateria" class="display" data-page-length="25" cellspacing="0" cellpadding="2" border="1" width="100%">' +
													 '<thead><tr><th>Nom</th><th>codi</th><th>codi base 2018</th></tr></thead>';

		printLogs('Generant taula equivalència', 1);
		var i=0;

		// Cercam als horaris actuals el codi corresponent a l'horari antic
		$(fGestibExportacioActual).find('MATERIA').each(function(){
			var codi = $(this).attr("codi");
			// Es pot fer per descripció o per nom curt. Provar el que vagi millor
			var nom = $(this).attr("descripcio");
			var nomCurt = $(this).attr("curta");
			var codiBase="no trobat";

			// Cerca per nom curt de la submatèria
			codiBase=$(fGestibExportacioBase).find("MATERIA[curta=\""+nomCurt+"\"]").attr("codi");

			mEquivalencia[i++] = [codi,codiBase, nom, nomCurt];
			
			var classe = (codiBase==undefined)?"alarm":"";
			submateriesTable += `<tr><td>${nom} (${nomCurt})</td><td>${codi}</td><td class="${classe}">${codiBase}</td></tr>`;
			
		});

		submateriesTable += "</table>";
		$("#submateriesTable").html("");
		$("#submateriesTable").append(submateriesTable);
		
	}

	// Troba les places actives sense horari
	/****************************************************************************/
	function generaTaulaPlacesNoHorari(){
		let placesTable = '<table id="places" class="display" cellspacing="0" cellpadding="2" border="1" width="100%">' +
											'<thead><td>Funcio</td><td>codi plaça</td><td>Té horari?</td></thead>';

		$(xmlPlaces).find('llocFeina').each(function(){
			let codi = $(this).attr("codi");
			let funcio = $(this).attr("funcio");
			let abreujat = $(this).attr("abreujat");
			let codiPlacaBase=$(fUntilsExportacioActual).find("SESSIO[placa=\""+codi+"\"]").attr("placa");
			let trobat=(codiPlacaBase==undefined)?"<span style='color:red'>N</span>":"S";

			placesTable += `<tr>
								<td>${funcio} <span class="abreujat">(${abreujat})</span></td>
								<td>${codi}</td>
								<td>${trobat}</td>
							</tr>`;
		});

		placesTable += "</table>";
		$("#placesTable").html("").append(placesTable);
		//$('#places').dataTable();
	}

    // Genera la taula de equivalència de GRUPS entre codis antics i nous del gestib del nou curs acadèmic
	/****************************************************************************/
	function generaTaulaEquivalenciaGrups(fGestibExportacioBase, fGestibExportacioActual){
		let grupsTable = '<table id="grups" class="display" cellspacing="0" cellpadding="2" border="1" width="100%">' +
										 '<thead><tr><th>Nom Grup</th><td>Codi curs</th><th>Codi Actual</th><th>codi base 2018</th></tr></thead>';

		printLogs('Generant taula equivalència', 1);
		var i=0;
		$(fGestibExportacioActual).find('CURS').each(function(){
			let cursCodi = $(this).attr("codi");
			let cursDescripcio  = $(this).attr("descripcio");

			// Grups del curs
			let grupCodiActual = "";
			let grupNom = "";
			let grupCodiBase = "";
			$(this).find('GRUP').each(function(){
				grupCodiActual  = $(this).attr("codi");
				grupNom = $(this).attr("nom");

				// Recuperació de dades base
				let oCursBase = $(fGestibExportacioBase).find("CURS[codi=\""+cursCodi+"\"]");

				// Grup codi base
				grupCodiBase = $(oCursBase).find("GRUP[nom=\""+grupNom+"\"]").attr("codi");

				// Array d'objectes grup
				mEquivalenciaGrups[i] = {
											"cursCodi":cursCodi,
											"cursDesc": cursDescripcio,
											"grupNom": grupNom,
											"grupCodiBase": grupCodiBase,
											"grupCodiActual": grupCodiActual
										};
				i++;
				var classe = (grupCodiBase==undefined)?"alarm":"";
				grupsTable += `<tr>
									<td>${cursDescripcio}"-"${grupNom}</td>
									<td>${cursCodi}</td>
									<td>${grupCodiActual}</td>
									<td class="${classe}">${grupCodiBase}</td>
							   </tr>
							`;
			});

		});

		grupsTable += "</table>";
		$("#grupsTable").html("");
		$("#grupsTable").append(grupsTable);
	
	}

	// Taula d'activitats (DE MOMENT NO ES FA SERVIR)
	/****************************************************************************/
	function generaTaulaActNoConfigurades(fUntilsExportacioActual){
		let taula = '<table id="activitats" class="display" cellspacing="0" cellpadding="2" border="1">'+
								'<thead><td>Nom</td><td>codi</td></thead>';
		console.log('info:generant taula activitat');
		$(fUntilsExportacioActual).find('SESSIO').each(function(){
			var codi = $(this).attr("materia");
			if (materia==""){
				var codi = $(this).attr("codi");
				var nom = $(this).attr("descripcio");
				taula += "<tr><td>"+nom+"</td><td>"+codi+"</td></tr>";
			}
		});
		taula += "</table>";
		//$("#act-no-conf").html("").append(taula);
		$("#act-no-conf").html("");
		$("#act-no-conf").append(taula);
	}
	
	// Taules aules (no dóna problema perquè són els mateix codis)
	/****************************************************************************/
	function generaTaulaEquivalenciaAules(fGestibExportacioBase, fGestibExportacioActual){
		let aulesTable = '<table id="aules" class="display" cellspacing="0" cellpadding="2" border="1" width="100%">' +
										 '<thead><tr><th>Nom aula</th><th>Codi Actual</th><th>codi base 2018</th></tr></thead>';

		
		console.log("aules...");

		$(fGestibExportacioActual).find('AULA').each(function(index){
			let codi = $(this).attr("codi");
			let nom = $(this).attr("descripcio");
			let codiBase=$(fGestibExportacioBase).find("AULA[descripcio=\""+nom+"\"]").attr("codi");
			mEquivalenciaAules[index]=[codi,codiBase, nom];
			aulesTable += "<tr><td>"+nom+"</td><td>"+codi+"</td><td>"+codiBase+"</td></tr>";
		});

		aulesTable += "</table>";
		$("#aulesTable").html("");
		$("#aulesTable").append(aulesTable);
	}

	// Cerca la equivalància codiActual del codiBase a la taula mEquivalencia
	/****************************************************************************/
	function cercaEquivalenciaNou(codiBaseCerca){
		for (var i=0; i<mEquivalencia.length; i++){
			var codi = mEquivalencia[i][0];
			var codiBase = mEquivalencia[i][1];
			if (codiBaseCerca == codiBase) return codi;
			
		}
		return -1;
	}

	// Torna la descripció d'una equivalència entre codiActual i codiBase a la taula mEquivalencia
	/****************************************************************************/
	function cercaDescEquivalenciaNou(codiBaseCerca){
		for (var i=0; i<mEquivalencia.length; i++){
			var codi = mEquivalencia[i][0];
			var codiBase = mEquivalencia[i][1];
			if (codiBaseCerca == codiBase) return mEquivalencia[i][2];
		}
	}

	function cercaCodiGrupEquivalenciaNou(codiGrupBaseCerca){
		for (var i=0; i<mEquivalenciaGrups.length; i++){
			var codiBase = mEquivalenciaGrups[i].grupCodiBase;
			if (codiGrupBaseCerca == codiBase) return mEquivalenciaGrups[i].grupCodiActual;
		}
		return -1;
	}

	// Modificar arxiu final
  /****************************************************************************/
	function setXMLUntilsExportacio(){

		var sSessions ="";
		console.log('Modificant xml per gestib...');

		// Llegir cada sessió generada per untis
		$(fUntilsExportacioActual).find('SESSIO').each(function(){
			var codiSubmateria = $(this).attr("materia"); // Codi de la submateria de untis
			var codiGrupBase = $(this).attr("grup"); // grup
			var codiCurs = $(this).attr("curs"); // curs

			if (codiSubmateria !=""){
				//console.log('codi submateria:'+codiBase);
				
				// Cercam les noves dades als XML corresponents 
				let codi = cercaEquivalenciaNou(codiSubmateria);
				let desc = cercaDescEquivalenciaNou(codiSubmateria);
				let codiGrupActual = cercaCodiGrupEquivalenciaNou(codiGrupBase);
				let codiPlaca = $(this).attr("placa");
				
				console.log('codi submateria base:' + codi);

	
				// Esborram les sessions amb submatèria antiga sense codi nou i sense plaça
				// per filtra només per segon posar || codiCurs!="563"
				if (codi==-1 || $(this).attr("placa")=="" ){
					$(this).remove();
				}else{
					// Modificam el xml amb les dades actualitzades 
					$(this).attr("materia", codi);
					//$(this).attr("desc", desc);
					$(this).attr("grup", codiGrupActual);

				}

				
				// De moment esborram les sessions amb grup -1
				if (codiGrupActual==-1 ){
					$(this).remove();
				}

				// Si és una plaça que no es troba al gestib també es lleva
				let codiPlacaActual = $(xmlPlaces).find("llocFeina[codi=\""+codiPlaca+"\"]").attr("codi");
				if ( codiPlacaActual==undefined){
					console.log("warning:Codi sense plaça origen:"+codiPlaca);
					$(this).remove();
				}
				
			}else{
			   $(this).remove(); // Esborram element sense res
			}
		});
		printLogs('Print xml gestib', 1);
		xmlHorariActual=fUntilsExportacioActual;
		
		// Conversió per poder veure a la pantalla les dades
		var sFitxerXML= xmlToString(fUntilsExportacioActual);
		$("#xml-gestib").html( printXmltoWeb(sFitxerXML) );

	}

	// Sense taules d'equivalència, fitxer untis actualitzat correctament
	function setXMLUntilsExportacioDirecta(){

		var sSessions ="";
		console.log('Modificant xml per gestib...');

		// Llegir cada sessió generada per untis
		$(fUntilsExportacioActual).find('SESSIO').each(function(){
			var codiSubmateria = $(this).attr("materia");
			var codiCurs = $(this).attr("curs"); // curs
			// Esborrar sessions sense codi submateria correcta
			console.log("Resultat:", parseInt(codiSubmateria,10)<CODI_SUBMATERIA_MINIMA);
			// per esborrar 2n curs || codiCurs=="563"
			if (codiSubmateria =="" || parseInt(codiSubmateria,10)<CODI_SUBMATERIA_MINIMA || codiCurs=="563"){
				$(this).remove();
			}
		});

		printLogs('Print xml gestib', 1);
		xmlHorariActual=fUntilsExportacioActual;
		
		// Conversió per poder veure a la pantalla les dades
		var sFitxerXML= xmlToString(fUntilsExportacioActual);
		$("#xml-gestib").html( printXmltoWeb(sFitxerXML) );
	}
/*****************************************************************************
Càrrega de fitxers
****************************************************************************/


	// Carrega dels fitxer XML
	/****************************************************************************/
	function loadFitxers(){
		loadHorariBase();
		loadHorariActual();
		loadHorariUntis();
		loadPlaces();

		//loadFitxerUntisOriginal(fUntilsBase);
	}

	// Carrega l'horari base
	/****************************************************************************/
	function loadHorariBase(){
		$.ajax({
			type: "GET",
			url: "./data/ExportacioDadesHoraris.xml",
			dataType: "xml",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: ' + errorThrown);
			},
			success: function(xml) {
				
				fGestibExportacioBase = xml;

			}
		});
	}
	// Carrega de places del curs actual
	/****************************************************************************/
	function loadPlaces(){
		$.ajax({
			type: "GET",
			url: "./data/placesActual.xml",
			dataType: "xml",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: ' + errorThrown);
			},
			success: function(xml) {
				printLogs('AJAX: load llocs feina', 1);
				xmlPlaces = xml;
			}
		});
	}

	// Carrega l'horari actual
	/****************************************************************************/
	function loadHorariActual(){
		$.ajax({
			type: "GET",
			url: "./data/ExportacioDadesHoraris.xml",
			dataType: "xml",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: ' + errorThrown);
			},
			success: function(xml) {
				printLogs('AJAX Request is succeded.', 1);
				fGestibExportacioActual = xml;

			}
		});
	}

	// Carrega l'horari base (2018)
	/****************************************************************************/
	function loadHorariUntis(){
		$.ajax({
			type: "GET",
			url: "./data/ExportacioUntisBase.xml",
			dataType: "xml",
			error: function(jqXHR, textStatus, errorThrown) {
				console.log('Error: ' + errorThrown);
			},
			success: function(xml) {
				printLogs('AJAX Request is succeded.',1);
				fUntilsExportacioActual = xml;
			}
		});
	}

	/* Carrega de dades des del fitxer txt del programa gpUntis
	 * Genera la taula d'activitats no configurades que s'han afegit com a submatèries noves
	 	 al gpuntis i no hi són al gestib.
	*/
	/****************************************************************************/
	function loadFitxerUntisOriginal(file){
		//lectura directament en javascript del fitxer txt
	  // és l'única manera de llegir txt
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = function (){
			if(rawFile.readyState === 4){
				if(rawFile.status === 200 || rawFile.status == 0){
					var allText = rawFile.responseText;
					let taula = '<table id="act" cellspacing="0" cellpadding="2" border="1">' +
					            '<thead><td>Nom</td><td>codi</td></thead>';

					var rows = allText.split('\n');
					for (var i = 0; i < rows.length; i++) {
						var rowActual = rows[i];
						if (rowActual.indexOf(",,,,,,,,,,,,,0,")!=-1){
							var dadesActivitat = rowActual.split(",");
							var	nom = dadesActivitat[1];
							taula += '<tr><td>'+ nom +'</td><td>'+'</td></tr>';
						}

					}
					taula += '</table>';
					$("#act-no-conf").html("");
					$("#act-no-conf").append(taula);

				}
			}
		}
		//rawFile.send(null);

	}

	// Cerca les funcions d'un únic professor
	function cercaSessionsProfessor(){
		var abrPlaca = document.getElementById("camp-abr").value
		if (abrPlaca==""){
			alert("Abr no especificat");
			return false;
		}
		abrPlaca = abrPlaca.toLocaleUpperCase();
		
		if (!xmlHorariActual){
			alert("No s'ha generat l'horari");
			return false;
			
		}
		let codiPlacaActual = $(xmlPlaces).find("llocFeina[abreujat=\""+abrPlaca+"\"]").attr("codi");
		if (!codiPlacaActual){
			alert("No s'ha trobat el codi de plaça actual");
			return false;
		}
		alert("Codi plaça:"+codiPlacaActual);
		let xmlSessionsProfessor="";
		$(xmlHorariActual).find('SESSIO').each(function(){
			let codiPlaca = $(this).attr("placa");
			if (codiPlaca==codiPlacaActual){
				xmlSessionsProfessor += xmlToString(this)+'\n';
			}
			
			
		});
		if (xmlSessionsProfessor==""){
			alert("No s'han trobat sessions");
		}else{
			$("#sessions-profesor").html( printXmltoWeb(xmlSessionsProfessor));
		}
		
	}