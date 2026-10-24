/*!
 * IE10 agent hack for Surface/desktop Windows 8 bug
 * Copyright 2014 Twitter, Inc.
 * Licensed under the Creative Commons Attribution 3.0 Unported License. For
 * details, see http://creativecommons.org/licenses/by/3.0/.
 */

// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width

(function () {
  'use strict';
  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msagentStyle = document.createElement('style')
    msagentStyle.appendChild(
      document.createTextNode(
        '@-ms-agent{width:auto!important}'
      )
    )
    document.querySelector('head').appendChild(msagentStyle)
  }
})();
