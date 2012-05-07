/**
 * Obfuscator module.
 *
 * @module obfuscator
 * @author John Peloquin
 * @copyright Copyright (c) 2012 John Peloquin. All rights reserved.
 */

/**
 * Obfuscator.
 *
 * This class provides methods to obfuscate and deobfuscate textual strings. The
 * obfuscation is not intended to provide any real security, just to prevent
 * casual reading by humans and machines.
 *
 * @class Obfuscator
 * @static
 */
var Obfuscator = (function() {
    /**
     * Convert array of utf8 bytes to string.
     *
     * @method _utf8BytesToString
     * @private
     * @param {Array} bytes array of utf8 bytes
     * @return {String} string
     */
    var _utf8BytesToString = function(bytes) {
        var hex = [],
            n = bytes.length,
            i;

        for(i = 0; i < n; i++) {
            hex[i] = '%' + bytes[i].toString(16);
        }

        return decodeURIComponent(hex.join(''));
    };

    /**
     * Convert a string to an array of utf8 bytes.
     *
     * @method _stringToUtf8Bytes
     * @private
     * @param {String} str string
     * @return {Array} array of utf8 bytes
     */
    var _stringToUtf8Bytes = function(str) {
        var out = [],
            hex = encodeURIComponent(str),
            n = hex.length,
            i;

        for(i = 0; i < n; i++) {
            if(hex[i] === '%') {
                out.push(parseInt(hex.substr(i + 1, 2), 16));
                i += 2;
            }
            else {
                out.push(hex.charCodeAt(i));
            }
        }

        return out;
    };

    /**
     * Inverts an array of bytes.
     *
     * @method _invert
     * @private
     * @param {Array} bytes array of bytes
     * @return {Array} array of inverted bytes
     */
    var _invert = function(bytes) {
        var out = [],
            n = bytes.length,
            i;

        for(i = 0; i < n; i++) {
            out[i] = ~bytes[i] & 0xff;
        }

        return out;
    };

    /**
     * Encodes an array of bytes to a string of base64 (RFC 4648).
     *
     * @method _encode64
     * @private
     * @param {Array} bytes array of bytes
     * @return {String} string of base64
     */
    var _encode64 = function(bytes) {
        return Base64.encode(bytes);
    };

    /**
     * Decodes a string of base64 into an array of bytes (RFC 4648).
     *
     * @method _decode64
     * @param {String} str string of base64
     * @return {Array} array of bytes
     */
    var _decode64 = function(str) {
        return Base64.decode(str);
    };

    return {
        /**
         * Obfuscates a string of text.
         *
         * This method obfuscates the input string by base64 encoding inversions
         * of the bytes in the utf8 representation of the string.
         *
         * @method obfuscate
         * @param {String} str string
         * @return {String} obfuscated string
         */
        obfuscate: function(str) {
            return _encode64(_invert(_stringToUtf8Bytes(str)));
        },

        /**
         * Deobfuscates a string of obfuscated text.
         *
         * @param {String} str obfuscated string
         * @return {String} deobfuscated string
         */
        deobfuscate: function(str) {
            return _utf8BytesToString(_invert(_decode64(str)));
        }
    };

}());
