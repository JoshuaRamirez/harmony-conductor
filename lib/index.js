!function(r,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("harmony-conductor",[],n):"object"==typeof exports?exports["harmony-conductor"]=n():r["harmony-conductor"]=n()}(self,(()=>(()=>{"use strict";var r={};return(()=>{var n=r;Object.defineProperty(n,"__esModule",{value:!0}),n.Conductor=void 0;var e=function(){function r(){}return r.Subscribe=function(r,n,e){var t=this;if(!r)throw new Error("Missing eventName parameter.");if("function"!=typeof n)throw new Error("Missing a function in handler parameter.");if(!n)throw new Error("Missing handler parameter.");var o={Subscriber:e?n.bind(e):n,EventName:r,UnSubscribe:(function(){},function(){t._subscriptions=t._subscriptions.filter((function(r){return r!==o}))})};return this._subscriptions.push(o),o},r.Publish=function(r,n){if(!r)throw new Error("Missing eventName parameter.");this._subscriptions.filter((function(n){return n.EventName===r})).forEach((function(r){r.Subscriber(n)}))},r._subscriptions=[],r}();n.Conductor=e})(),r})()));
//# sourceMappingURL=index.js.map