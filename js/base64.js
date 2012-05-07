/**
 * Base64 module.
 *
 * @module base64
 * @author John Peloquin
 * @copyright Copyright (c) 2012 John Peloquin. All rights reserved.
 */

/**
 * Base64 encoder and decoder.
 *
 * This class provides methods for base64 encoding and decoding byte arrays in
 * accordance with RFC 4648.
 *
 * @class Base64
 * @static
 */
var Base64 = (function() {
    /**
     * Base64 digits.
     *
     * @property _DIGITS
     * @type String
     * @private
     */
    var _DIGITS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    return {
        /**
         * Encodes an array of bytes into a string of base64 (RFC 4648).
         *
         * @method encode
         * @param {Array} bytes array of bytes
         * @return {String} string of base64
         */
        encode: function(bytes) {
            var D = _DIGITS,
                out = [],
                n = bytes.length,
                r = n % 3,
                i, s;

            // pad input to make evenly divisible by three bytes
            if(r === 1) {
                bytes.push(0, 0);
                n += 2;
            }
            else if(r === 2) {
                bytes.push(0);
                n += 1;
            }

            // loop through input bytes three at a time
            for(i = 0; i < n - 2; i += 3) {
                // construct 24-bit sequence from three 8-bit input bytes
                s = (bytes[i] << 16) + (bytes[i + 1] << 8) + bytes[i + 2];

                // extract four 6-bit subsequences and output base64 digits
                out.push(
                    D.charAt(s >> 18),
                    D.charAt((s >> 12) & 0x3f),
                    D.charAt((s >> 6) & 0x3f),
                    D.charAt(s & 0x3f)
                );
            }

            // pad output to make evenly divisible by four characters
            if(r === 1) {
                out[out.length - 1] = out[out.length - 2] = '=';
            }
            else if(r === 2) {
                out[out.length - 1] = '=';
            }

            return out.join('');
        },

        /**
         * Decodes a string of base64 into an array of bytes (RFC 4648).
         *
         * @method decode
         * @param {String} str string of base64
         * @return {Array} array of bytes
         */
        decode: function(str) {
            var D = _DIGITS,
                bytes = [],
                n = str.length,
                r, i, s;

            if(!/^[A-Za-z0-9\+\/]*\={0,2}$/.test(str) || n % 4 !== 0) {
                throw new Error('Invalid base64 string.');
            }

            if(n === 0) {
                return [];
            }

            // compute remainder bytes in original input
            r = str.charAt(n - 2) === '=' ? 1 : (str.charAt(n - 1) === '=' ? 2 : 0);

            // replace padding characters in string
            str = str.replace(/=/g, 'A');

            // loop through string four characters at a time
            for(i = 0; i < n - 3; i += 4) {
                // construct 24-bit sequence from four 6-bit sequences
                s = (D.indexOf(str.charAt(i)) << 18)
                    + (D.indexOf(str.charAt(i + 1)) << 12)
                    + (D.indexOf(str.charAt(i + 2)) << 6)
                    + D.indexOf(str.charAt(i + 3));

                // extract three 8-bit bytes
                bytes.push(
                    s >> 16,
                    (s >> 8) & 0xff,
                    s & 0xff
                );
            }

            // remove any padding from original input
            if(r === 1) {
                bytes.pop();
                bytes.pop();
            }
            else if(r === 2) {
                bytes.pop();
            }

            return bytes;
        }
    };

}());
