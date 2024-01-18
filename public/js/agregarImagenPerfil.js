/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/agregarImagenPerfil.js":
/*!***************************************!*\
  !*** ./src/js/agregarImagenPerfil.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n\r\n    const agregarImagen = document.getElementById('imagen-nueva');\r\n    const contenedorimagen = document.getElementById('foto-perfil');\r\n    const token = document.querySelector('meta[name=\"csrf-token\"]').getAttribute('content')\r\n    agregarImagen.addEventListener('change', cambiarFotoPerfil);\r\n    \r\n    async function cambiarFotoPerfil() {\r\n        const file = agregarImagen.files[0];\r\n        const url= '/mi-perfil/agregar-imagen'\r\n        \r\n        if (file) {\r\n\r\n            // Use FileReader to read the selected file as a data URL\r\n            const reader = new FileReader();\r\n            const formdata = new FormData()\r\n            formdata.append('imagen', file)\r\n    \r\n            const respuesta = await fetch(url, {\r\n               \r\n                method: \"POST\",\r\n                headers: {\r\n                    'CSRF-Token': token\r\n                },\r\n                body:formdata,\r\n            });\r\n\r\n           \r\n            if(respuesta.status){\r\n                Swal.fire(\r\n                    'Se agrego la iamgen',\r\n                    'Imagen de perfil',\r\n                    'success'\r\n                   );\r\n            }else{\r\n                Swal.fire({\r\n                    type:'error',\r\n                    title:'Hubo un error',\r\n                    text:'Vuelve a intentarlo'\r\n                })\r\n            }\r\n            \r\n    \r\n            reader.onload = function (e) {\r\n                // Set the source of the image to the data URL\r\n                contenedorimagen.src = e.target.result;\r\n            };\r\n    \r\n            // Read the selected file as a data URL\r\n            reader.readAsDataURL(file);\r\n        }\r\n    }\r\n    \r\n\r\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/agregarImagenPerfil.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/agregarImagenPerfil.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;