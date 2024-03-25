/**!
 *	9.2.0
 *	Generation date: 2024-03-08T13:38:08.991Z
 *	Client name: quantl
 *	Package Type: Core alacarte
 *	License type: trial
 *	Build descriptor: v9.1.0-86-gc0db61403
 */

/***********************************************************!
 * Copyright © 2023 S&P Global All rights reserved
*************************************************************/
/*************************************! DO NOT MAKE CHANGES TO THIS LIBRARY FILE!! !*************************************
* If you wish to overwrite default functionality, create a separate file with a copy of the methods you are overwriting *
* and load that file right after the library has been loaded, but before the chart engine is instantiated.              *
* Directly modifying library files will prevent upgrades and the ability for ChartIQ to support your solution.          *
*************************************************************************************************************************/
/* eslint-disable no-extra-parens */


import { CIQ } from "../../js/standard.js";
import "./ui.js";
import "./studyInfo.js";
import "./categories.js";

if (!CIQ.StudyBrowser) {
	CIQ.StudyBrowser = function () {};
}
