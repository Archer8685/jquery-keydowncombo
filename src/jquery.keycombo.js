/**
 * jquery.keycombo.js
 *
 * @description jQuery KeyDown Combo Plugin
 * @version     1.0.0
 * @author      Archer Hsieh
 * @date        2013/07/09
 *
 * @copyright Copyright 2013 Archer Hsieh, all rights reserved.
 */
 
(function($) {
  /**
   * DeBug Log
   */
  var _canLog = true;

  function _log(mode, msg) {
  
    if( !_canLog ){
      return;
    }

    /* 移除傳入值第一項 */
    var args = Array.prototype.slice.apply(arguments, [1]);
    
    /* log tag */
    var d = new Date();
    var tag = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + 
    d.getHours() + ":"+d.getMinutes() + ":"+d.getSeconds() + "."+d.getMilliseconds();
    args[0] = tag + " - " + args[0];

    /* Log模式 */
    try {
      switch( mode ) {
      case "info":
        window.console.info.apply(window.console, args);
        break;
      case "warn":
        window.console.warn.apply(window.console, args);
        break;
      default:
        window.console.log.apply(window.console, args);
        break;
      }
    } catch(e) {
      if( !window.console ){
        _canLog = false; //不支援Console的瀏覽器,則關閉log
      }else if(e.number === -2146827850){
        // 修正IE 8不支援.apply()
        window.console.log(args.join(", "));
      }
    }
  }
  
  function logMsg() {
    /* 加入debug字串到傳入值第一項mode */
    Array.prototype.unshift.apply(arguments, ["debug"]);
    _log.apply(this, arguments);// == this._log(arguments);
  }
  
  var methods = {
    init: function (options) {
    
    /* 預設參數 */
    var defaults = {
      keys: {},
      delayTime: -1,
      limitType: -1,
      igrone: []
    };
    
    var callback = $.extend({
        onTimeOutError: function() {},
        onKeyError: function() {},
        onSuccess: function() {},
        onComplete: function() {}
    }, arguments[0] || {});
    
    var options = $.extend({}, defaults, options);
    
      return this.each(function() {
        try {

        
          /* Global */
          var lastTime, //上次KeyDown時間
              isReset = false, //是否要重置
              startTime = 0, //開始時間
              totalTime = 0, //總花費時間
              pressTimes = 0, //KeyDown次數
              nowTime = 0, //現在時間
              obj = $(this),
              
              /* Options */
              _keys = options.keys || {},
              _keysLength = _keys.length,
              _delayTime = options.delayTime || -1,
              _igrone = options.igrone || [],
              _limitType = options.limitType || -1,
              disable = false;
              
          if (!_keys) return false; //按鍵不得為空
          
          /* 轉為小寫 */
          _igrone = $.map(_igrone, function(v, k) {
              return (isNaN(v)) ? v.toLowerCase() : v;
          });
        
          var initEvent = function(e) {
            
            nowTime = new Date().getTime();
            logMsg("initEvent");
            var diffTime = 0,
                _keyCode = e.keyCode || e.which,
                _keyStr = keyCodeToStr(_keyCode).toLowerCase() || -1,
                compareVal = _keys[pressTimes] || "";
 
            if ($.inArray(_keyCode, _igrone) >= 0 || $.inArray(_keyStr, _igrone) >= 0) return true; //若為忽略的Key,則直接回傳
            
            if (_limitType > 0) { //Limit Key Type
                if (_limitType == 1) { //Only Numbers
                    if (_keyCode < 48 || _keyCode > 57) return true;
                } else if (_limitType == 2) { //Only Words
                    if (_keyCode < 65 || _keyCode > 90) return true;
                } else if (_limitType == 3) { //Only Numbers and Words
                    if ((_keyCode < 48 || _keyCode > 57) && (_keyCode < 65 || _keyCode > 90)) return true;
                }
            }
            
            compareVal = (isNaN(compareVal)) ? compareVal.toLowerCase() : keyCodeToStr(compareVal).toLowerCase();
            pressTimes++; //按下次數 + 1
            
            if (pressTimes > _keysLength) return true; //重新觸發最後一個動作,則直接回傳
            
            /* 前次和這次Press延遲時間 */
            if (lastTime != null ) {
                diffTime = nowTime - lastTime;
                if (diffTime >= _delayTime && !isReset && _delayTime != -1) { //是否超過延遲時間,且非初始狀態
                    logMsg("onTimeOutError: " + "pressTimes = " + pressTimes + ", diffTime = " + diffTime);
                    callback.onTimeOutError.call(this, pressTimes, diffTime);
                    _clear();
                    return true;
                } 
            }
            
            isReset = false;
            logMsg("compareVal = " + compareVal);
            /* 按下的按鍵順序需符合陣列內的Key Code */
            if (_keyStr == compareVal) {
            
                if (pressTimes == 1) startTime = nowTime;
                if (pressTimes == 1) diffTime = 0;
                
                logMsg("onSuccess: " + "pressTimes = " + pressTimes + ", keyCode = " + _keyCode + ", diffTime = " + diffTime);
                callback.onSuccess.call(this, pressTimes, _keyCode, diffTime);
                  
                if (pressTimes == _keys.length) {
                  totalTime = nowTime - startTime;
                  logMsg("onComplete: " + "totalTime = " + totalTime);
                  /** 
                   * onComplete在KeyDown回傳之上, 
                   * 所以將KeyDown事件攔截,
                   * 並在回傳onComplete之後,
                   * 重新觸發最後一個KeyDown動作。
                   */
                  callback.onComplete.call(this, totalTime); //回傳onComplete事件
                  reTrigger(_keyCode); //最後一個動作被攔截,需重新觸發
                  _clear();
                  return false; //攔截KeyDown事件
                }
                  
            } else { //Press錯誤
                logMsg("onKeyError: " + "pressTimes = " + pressTimes + ", keyCode = " + _keyCode);
                callback.onKeyError.call(this, pressTimes, _keyCode);
                _clear();
            }
            
            lastTime = nowTime;
            return true;
          };

          obj.bind('keydown', initEvent);
        
          /**
           * 清除KeyDown次數,和重置事件。
           */
          var _clear = function () {
              startTime = 0;
              pressTimes = 0;
              diffTime = 0;
              isReset = true;
          },
          reTrigger = function(keyCode) {
              var e = $.Event("keydown");
              e.which = keyCode;
              obj.trigger(e);
          };
          
        } catch(err) {
            logMsg(err);
        }  
      });
    }
  };

  $.fn.KeyDownCombo = function(methodOrOptions) {
      if ( methods[methodOrOptions] ) { //執行選項
          return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) { //初始化
          return methods.init.apply( this, arguments );
      } else {
          $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.KeyDownCombo' );
      }   
  };
    
})(jQuery);
  
  /**
   * 將KeyCode轉成String
   *
   * @param  (Number) keyCode
   * @return (String) str
   */ 
  var keyCodeToStr = function (keyCode) {
    var str,
        keyStrList = {
        "8": "Backspace",
        "9": "Tab",
        "13": "Enter",
        "16": "Shift",
        "17": "Ctrl",
        "18": "Alt",
        "19": "Pause",
        "20": "CapsLock",
        "27": "Esc",
        "32": "Space",
        "33": "PageUp",
        "34": "PageDown",
        "35": "End",
        "36": "Home",
        "37": "leftArrow",
        "38": "upArrow",
        "39": "rightArrow",
        "40": "downArrow",
        "45": "Insert",
        "46": "Delete",
        "48": "Zero",
        "49": "One",
        "50": "Two",
        "51": "Three",
        "52": "Four",
        "53": "Five",
        "54": "Six",
        "55": "Seven",
        "56": "Eight",
        "57": "Nine",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "96": "Numpad0",
        "97": "Numpad1",
        "98": "Numpad2",
        "99": "Numpad3",
        "100": "Numpad4",
        "101": "Numpad5",
        "102": "Numpad6",
        "103": "Numpad7",
        "104": "Numpad8",
        "105": "Numpad9",
        "106": "Multiply", //"*"
        "107": "Plus", //"+"
        "109": "Minut", //"-"
        "110": "Dot", //"."
        "111": "Slash", //"/"
        "112": "F1",
        "113": "F2",
        "114": "F3",
        "115": "F4",
        "116": "F5",
        "117": "F6",
        "118": "F7",
        "119": "F8",
        "120": "F9",
        "121": "F10",
        "122": "F11",
        "123": "F12",
        "144": "NumLock",
        "145": "ScrollLock",
        "186": "Semicolon", //";"
        "187": "Equals", //"="
        "188": "Comma", //","
        "189": "Minus", //"-"
        "190": "Period", //"."
        "191": "Slash", //"/"
        "192": "BackTick", //"`"
        "219": "LeftBrackets", //"["
        "220": "BackSlash", //"\"
        "221": "RightBrackets", //"]"
        "222": "Apostrophe" //"'"
    }
    
    str = keyStrList[keyCode] || "";
    
    return str;
    
 };