/* Number-extensions.js - extensions for the Javascript Number object
 *
 * The author of this program, Safalra (Stephen Morley), irrevocably releases
 * all rights to this program, with the intention of it becoming part of the
 * public domain. Because this program is released into the public domain, it
 * comes with no warranty either expressed or implied, to the extent permitted
 * by law.
 */

Number.prototype.abs =
    function(){
      return Math.abs(this);
    };

Number.prototype.acos =
    function(){
      return Math.acos(this);
    };

Number.prototype.acosec =
    function(){
      return Math.asin(1 / this);
    };

Number.prototype.acosech =
    function(){
      return this < 0
             ? Math.log((1 - Math.sqrt(1 + this * this)) / this)
             : Math.log((1 + Math.sqrt(1 + this * this)) / this);
    };

Number.prototype.acosh =
    function(){
      return Math.log(this + Math.sqrt(this * this - 1));
    };

Number.prototype.acot =
    function(){
      return Math.PI / 2 - Math.atan(this);
    };

Number.prototype.acoth =
    function(){
      return Math.log((this + 1) / (this - 1)) / 2;
    };

Number.prototype.asec =
    function(){
      return Math.PI / 2 - Math.asin(1 / this);
    };

Number.prototype.asech =
    function(){
      return Math.log((1 + Math.sqrt(1 - this * this)) / this);
    };

Number.prototype.asin =
    function(){
      return Math.asin(this);
    };

Number.prototype.asinh =
    function(){
      return Math.log(this + Math.sqrt(this * this + 1));
    };

Number.prototype.atan =
    function(){
      return Math.atan(this);
    };

Number.prototype.atanh =
    function(){
      return Math.log((1 + this) / (1 - this)) / 2;
    };

Number.prototype.ceil =
    function(){
      return Math.ceil(this);
    };

Number.prototype.cos =
    function(){
      return Math.cos(this);
    };

Number.prototype.cosec =
    function(){
      return 1 / Math.sin(this);
    };

Number.prototype.cosech =
    function(){
      return 2 / (Math.exp(this) - Math.exp(-this));
    };

Number.prototype.cosh =
    function(){
      return (Math.exp(this) + Math.exp(-this)) / 2;
    };

Number.prototype.cot =
    function(){
      return 1 / Math.tan(this);
    };

Number.prototype.coth =
    function(){
      return (Math.exp(this) + Math.exp(-this))
           / (Math.exp(this) - Math.exp(-this));
    };

Number.prototype.degToRad =
    function(){
      return this * Math.PI / 180;
    };

Number.prototype.exp =
    function(){
      return Math.exp(this);
    };

Number.prototype.floor =
    function(){
      return Math.floor(this);
    };

Number.prototype.isInRange =
    function(low, high){
      return this >= low && this <= high;
    };

Number.prototype.limit =
    function(low, high){
      return this < low ? low : (this > high ? high : this);
    };

Number.prototype.limitAbove =
    function(high){
      return Math.min(high, this);
    };

Number.prototype.limitBelow =
    function(low){
      return Math.max(low, this);
    };

Number.prototype.ln =
    function(){
      return Math.log(this);
    };

Number.prototype.log =
    function(base){
      return Math.log(this) / Math.log(base);
    };

Number.prototype.log2 =
    function(){
      return Math.log(this) / Math.LN2;
    };

Number.prototype.log10 =
    function(){
      return Math.log(this) / Math.LN10;
    };

Number.prototype.mod =
    function(modulus){
      return this >= 0 ? this % modulus
                       : (this % modulus + Math.abs(modulus)) % modulus;
    };
    
Number.prototype.radToDeg =
    function(){
      return this * 180 / Math.PI;
    };

Number.prototype.round =
    function(){
      return Math.round(this);
    };

Number.prototype.sec =
    function(){
      return 1 / Math.cos(this);
    };

Number.prototype.sech =
    function(){
      return 2 / (Math.exp(this) + Math.exp(-this));
    };

Number.prototype.sign =
    function(){
      return this == 0 ? 0 : (this > 0 ? 1 : -1);
    };

Number.prototype.sin =
    function(){
      return Math.sin(this);
    };

Number.prototype.sinh =
    function(){
      return (Math.exp(this) - Math.exp(-this)) / 2;
    };

Number.prototype.sqrt =
    function(){
      return Math.sqrt(this);
    };

Number.prototype.pow =
    function(exponent){
      return Math.pow(this,exponent);
    };

Number.prototype.tan =
    function(){
      return Math.tan(this);
    };

Number.prototype.tanh =
    function(){
      return (Math.exp(this) - Math.exp(-this))
           / (Math.exp(this) + Math.exp(-this));
    };

Number.prototype.wrap =
    function(low, high){
      return low + (this - low).mod(high - low);
    };