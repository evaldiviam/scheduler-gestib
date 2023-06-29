# SCHEDULE GESTIB 

Aquest és un petit programa intermig per poder importar els horaris generats per Untis al Gestib. Així es pot reutilitzar el mateix fitxer cada any.

En teoria no faria falta perquè directament a untis es pot importar l'esquema de submatèries del Gestib, però falla per distintes raons.

## Informació codis:
    - Codis aules: Es migren d'un any a l'altre.
    - Codis places: Són les mateixes però poden aparèixer noves. Fer cas al nom "curt". Es configuren tant a untis com a gestib igual
    - Codis submatèries: van canviant cada any al gestib
    - Codi cursos: Els codis dels cursos són els mateixos cada curs acadèmic
	- Codi grups (A-B-C...): Els codis dels grups de cada curs canvai cada curs acadèmic

## Fixers input:
	- ExportacioDadesHoraris-2018-2019.xml: No canvia mai. Es fa servir per obtenir l'equivalència entre gestib i untis. És el fitxer amb el qual va començar l'Untis.

    - ExportacioDadesHoraris-2021-2022.xml: Del Gestib. Exportació inicial amb les submatèries del curs actual. Cada any s'haura d'exporta del del Gestib. Pantalla d'exportació/importació horaris.

	- ExportacioUntisBase.xml: És el fitxer generat per untis. Es va crear per primera vegada al 2018-19 (per això només conserva els codis antics del gestib). Cada any s'ha de tornar a crear des de untis.  

    - placesActual: Curs actual de places. Serveix per fer comprovacions de les places que no cuadren. Es pot agafar de la pnatalla de definició de places (llistaLlocsFeina.xml)

## Fixers output:
    - HorariGestib.xml: Ës el fitxer que genera aquesta aplicació que s'ha d'importar al Gestib amb l'horari del centre. Es desar a partir de la pipella "Fitxer generat per importació Gestib".


