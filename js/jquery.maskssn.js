/*
    jQuery Masked Input Plugin
    Copyright (c) 2007 - 2014 Josh Bush (digitalbush.com)
    Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license)
    Version: 1.4.0

	Customized version for SSN Masking v1.1
	Dependency: https://raw.githubusercontent.com/digitalBush/jquery.maskedinput/1.4.0/dist/jquery.maskedinput.min.js
*/
$.fn.extend({
	maskSSN: function(mask, settings) {
				var caretTimeoutId, ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua), android = /android/i.test(ua);
				var input, inputName, isEditable, submitField, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
				if (this.length > 0) {
					input = $(this[0]);
					if (!mask){
						var fn = input.data($.mask.dataName);
						return fn ? fn() : void 0;
					}
				}

				return settings = $.extend({
					autoclear: false, //$.mask.autoclear,
					placeholder: $.mask.placeholder,
					completed: null,
					maskedCharsLength:5,
					maskedChar: 'X',
					numericMaskedCharEquivalent:'9'
				}, settings), defs = $.mask.definitions, tests = [], partialPosition = len = mask.length,
				firstNonMaskPos = null, $.each(mask.split(""), function(i, c) {
					"?" == c ? (len--, partialPosition = i) : defs[c] ? (tests.push(new RegExp(defs[c])),
					null === firstNonMaskPos && (firstNonMaskPos = tests.length - 1), partialPosition > i && (lastRequiredNonMaskPos = tests.length - 1)) : (settings.maskedCharsLength++, tests.push(null));
				}), this.trigger("unmask").each(function() {
					function tryFireCompleted() {
						if (settings.completed) {
							for (var i = firstNonMaskPos; lastRequiredNonMaskPos >= i; i++) if (tests[i] && buffer[i] === getPlaceholder(i)) return;
							settings.completed.call(input);
						}
					}
					function getPlaceholder(i) {
						return settings.placeholder.charAt(i < settings.placeholder.length ? i : 0);
					}
					function seekNext(pos) {
						for (;++pos < len && !tests[pos]; ) ;
						return pos;
					}
					function seekPrev(pos) {
						for (;--pos >= 0 && !tests[pos]; ) ;
						return pos;
					}
					function shiftL(begin, end) {
						var i, j;
						if (!(0 > begin)) {
							for (i = begin, j = seekNext(end); len > i; i++) if (tests[i]) {
								if (!(len > j && tests[i].test(buffer[j]))) break;
								buffer[i] = buffer[j], buffer[j] = getPlaceholder(j), j = seekNext(j);
							}
							writeBuffer(), input.caret(Math.max(firstNonMaskPos, begin));
						}
					}
					function shiftR(pos) {
						var i, c, j, t;
						for (i = pos, c = getPlaceholder(pos); len > i; i++) if (tests[i]) {
							if (j = seekNext(i), t = buffer[i], buffer[i] = c, !(len > j && tests[j].test(t))) break;
							c = t;
						}
					}
					function androidInputEvent(e) {
						var curVal = input.val();
						if (oldVal && oldVal.length && curVal.length < oldVal.length) {
							input.val("");
							clearBuffer(0, buffer.length);
						} else {
							var code = oldVal ? getChangedChar(oldVal, curVal) : curVal;
							var pos = checkVal(!0, input.data($.mask.dataName)() + code);
							window.setTimeout(function() {
								input.caret(pos, pos);
							}, 10);
							e.stopImmediatePropagation();
						}
						tryFireCompleted();
						return false;
          			}
					function getChangedChar(oldV, newV){
						 var c = newV.split("").find(function(v, i){
							return v !== oldV[i];
						});
						return (c && c !== $.mask.placeholder && c !== settings.maskedChar) ? c : "";
					}
					function blurEvent() {
						checkVal(), input.val() != focusText && input.change();
						//TBD: below statement runs the validation on the value of the field, if any.
						submitField.valid ? submitField.valid() : void 0;
					}
					function keydownEvent(e) {
						if (isEditable) {
							if(!input.data('dirtyState') && e.keyCode!=9){
								input.data('dirtyState', true);
								input.val("");
								clearBuffer(0, buffer.length);
							}
							else {
								var pos, begin, end, k = e.which || e.keyCode;
								oldVal = input.val(), 8 === k || 46 === k || iPhone && 127 === k ? (input.val(""), clearBuffer(0, buffer.length)) : 13 === k ? blurEvent.call(this, e) : 27 === k && (input.val(focusText),
								input.caret(0, checkVal()), e.preventDefault());
							}
						}
					}
					function keypressEvent(e) {
						if (isEditable) {
							var p, c, next, k = e.which || e.keyCode, pos = input.caret();
							if (!(e.ctrlKey || e.altKey || e.metaKey || 32 > k) && k && 13 !== k) {
								if (pos.end - pos.begin !== 0 && (clearBuffer(pos.begin, pos.end), shiftL(pos.begin, pos.end - 1)),
								p = seekNext(pos.begin - 1), len > p && (c = String.fromCharCode(k), tests[p].test(c))) {
									if (shiftR(p), buffer[p] = c, writeBuffer(), next = seekNext(p), android) {
										var proxy = function() {
											$.proxy($.fn.caret, input, next)();
										};
										setTimeout(proxy, 0);
									} else input.caret(next);
									pos.begin <= lastRequiredNonMaskPos && tryFireCompleted();
								}
								e.preventDefault();
							}
						}

					}
					function clearBuffer(start, end) {
						var i;
						for (i = start; end > i && len > i; i++) tests[i] && (buffer[i] = getPlaceholder(i));
						submitField.val("");
					}
					function writeBuffer() {
						var i, val = [];
						for(i = 0; i<buffer.length; i++) {
							(i<settings.maskedCharsLength) ? val.push(buffer[i].replace(/\d/i, settings.maskedChar)) : val.push(buffer[i]);
						}
						input.val(val.join(""));
						submitField.val(input.data($.mask.dataName)());
					}
					function checkVal(allow, val) {
						var i, c, pos, test = (val && replaceStartChars(val, settings.maskedChar, settings.numericMaskedCharEquivalent, settings.maskedCharsLength-2)) || input.data($.mask.dataName)(), lastMatch = -1;
						for (i = 0, pos = 0; len > i; i++) if (tests[i]) {
							for (buffer[i] = getPlaceholder(i); pos++ < test.length; )
							if (c = test.charAt(pos - 1), tests[i].test(c)) {
								buffer[i] = c, lastMatch = i;
								break;
							}
							if (pos > test.length) {
								clearBuffer(i + 1, len);
								break;
							}
						} else buffer[i] === test.charAt(pos) && pos++, partialPosition > i && (lastMatch = i);
						return allow ? writeBuffer() : partialPosition > lastMatch + 1 ? settings.autoclear || buffer.join("") === defaultBuffer ? (input.val() && input.val(""), clearBuffer(0, len)) : writeBuffer() : input.val(input.val().substring(0, lastMatch + 1)),
						partialPosition ? i : firstNonMaskPos;
					}

					function replaceStartChars(str, oldC, newC, matchCount) {
						return str.replace(new RegExp("^"+oldC+"{" + matchCount +"}", 'g'), (function(newC, matchCount){ var c=[];for(var i=0; i<matchCount; i++){c.push(newC) } return c.join("");  })(newC, matchCount));
					}

					var input = $(this),
						inputName = input.attr('name'),
						isEditable = !(input.prop('readonly') || input.prop('disabled')),
						submitField = $('<input type="hidden" name="'+inputName+'"></input>'),

					buffer = $.map(mask.split(""), function(c, i) {
						return "?" != c ? defs[c] ? getPlaceholder(i) :  c : void 0;
					}), defaultBuffer = buffer.join(""), focusText = input.val();
					input.data($.mask.dataName, function() {
						return $.map(buffer, function(c, i) {
							return tests[i] && c != getPlaceholder(i) ? c : null;
						}).join("");
					}),

					input.one("unmask", function() {
						input.off(".mask");
						if(isEditable) {
							input.attr('name', submitField.attr('name'));
							submitField.remove();
							var showValue = input.data($.mask.dataName)()?input.data($.mask.dataName)():input.val();
							input.val(replaceStartChars(showValue, settings.numericMaskedCharEquivalent, settings.maskedChar, settings.maskedCharsLength-2));
							input.data('dirtyState', false);
						}
						input.removeData($.mask.dataName);
					}).on("focus.mask", function() {
						if (isEditable) {
							clearTimeout(caretTimeoutId);
							var pos;
							focusText = $(input).data($.mask.dataName)(), pos = checkVal(), caretTimeoutId = setTimeout(function() {
								pos == mask.replace("?", "").length ? input.caret(0, pos) : input.caret(pos);
							}, 10);
						}
					}).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function() {
						!isEditable || setTimeout(function() {
							var pos = checkVal(!0);
							input.caret(pos), tryFireCompleted();
						}, 0);
					}), chrome && android && input.off("input.mask").on("input.mask", androidInputEvent);

						input.removeAttr('name');
						submitField.insertAfter(input);
						checkVal(!0, input.val());
						checkVal();
				});
			}
});
