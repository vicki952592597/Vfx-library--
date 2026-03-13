/**
 * ================================================================
 *  FX Overlay — 一键粒子特效叠加工具
 * ================================================================
 *
 *  使用方式（任选一种）：
 *
 *  ▸ 方式1：一行 JS 调用
 *    <script src="effects/fx-overlay.js"></script>
 *    <script>FxOverlay.add('sakura-petals-transparent');</script>
 *
 *  ▸ 方式2：HTML 属性声明式
 *    <script src="effects/fx-overlay.js" data-fx="meteor-shower"></script>
 *
 *  ▸ 方式3：同时叠加多个
 *    FxOverlay.add('fireflies');
 *    FxOverlay.add('stardust-float');
 *
 *  ▸ 移除特效
 *    FxOverlay.remove('fireflies');
 *    FxOverlay.removeAll();
 *
 * ================================================================
 *  可用特效列表（文件名去掉 .html）：
 *
 *    sakura-petals-transparent  — 🌸 和风花瓣（透明）
 *    stardust-float             — ✨ 星光浮尘
 *    snowfall                   — ❄️ 飘雪粒子
 *    rising-embers              — 🔥 浮升火星
 *    fireflies                  — 💫 萤火虫
 *    bubbles-rise               — 🫧 气泡上升
 *    energy-field               — ⚡ 能量粒子场
 *    confetti-rain              — 🌈 彩色纸屑雨
 *    falling-stars              — ⭐ 星星坠落
 *    meteor-shower              — ☄️ 拖尾流星
 *
 * ================================================================
 */

(function (root) {
  'use strict';

  var EFFECTS_DIR = 'effects/';
  var activeOverlays = {};   // name → iframe element

  /**
   * 自动检测 effects/ 目录路径
   * 如果脚本自身在 effects/ 下，则用相对当前脚本的路径
   */
  function detectBasePath() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (src.indexOf('fx-overlay') !== -1) {
        var idx = src.lastIndexOf('/');
        if (idx !== -1) {
          return src.substring(0, idx + 1);
        }
      }
    }
    return EFFECTS_DIR;
  }

  var basePath = detectBasePath();

  /**
   * 添加一个粒子特效叠加层
   * @param {string} name - 特效文件名（不含 .html）
   * @param {object} [options] - 可选配置
   * @param {number} [options.zIndex=99999] - 层级
   * @param {number} [options.opacity=1] - 整体透明度
   * @returns {HTMLIFrameElement} iframe 元素
   */
  function add(name, options) {
    if (activeOverlays[name]) {
      console.warn('[FxOverlay] "' + name + '" 已经在运行中');
      return activeOverlays[name];
    }

    var opts = options || {};
    var zIndex = opts.zIndex !== undefined ? opts.zIndex : 99999;
    var opacity = opts.opacity !== undefined ? opts.opacity : 1;

    var iframe = document.createElement('iframe');
    iframe.src = basePath + name + '.html';
    iframe.setAttribute('data-fx-name', name);
    iframe.style.cssText = [
      'position:fixed',
      'top:0',
      'left:0',
      'width:100%',
      'height:100%',
      'border:none',
      'pointer-events:none',
      'z-index:' + zIndex,
      'opacity:' + opacity,
      'background:transparent'
    ].join(';');

    // 确保 iframe 背景透明
    iframe.setAttribute('allowtransparency', 'true');

    document.body.appendChild(iframe);
    activeOverlays[name] = iframe;

    console.log('[FxOverlay] ✅ 已叠加: ' + name);
    return iframe;
  }

  /**
   * 移除指定特效
   * @param {string} name
   */
  function remove(name) {
    var iframe = activeOverlays[name];
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
      delete activeOverlays[name];
      console.log('[FxOverlay] ❌ 已移除: ' + name);
    }
  }

  /**
   * 移除所有特效
   */
  function removeAll() {
    for (var name in activeOverlays) {
      if (activeOverlays.hasOwnProperty(name)) {
        remove(name);
      }
    }
  }

  /**
   * 获取当前活跃的特效列表
   * @returns {string[]}
   */
  function list() {
    return Object.keys(activeOverlays);
  }

  // ---- 公开 API ----
  var FxOverlay = {
    add: add,
    remove: remove,
    removeAll: removeAll,
    list: list
  };

  root.FxOverlay = FxOverlay;

  // ---- 声明式自动加载：<script data-fx="xxx"> ----
  (function autoLoad() {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
      var fx = scripts[i].getAttribute('data-fx');
      if (fx && scripts[i].src.indexOf('fx-overlay') !== -1) {
        // 支持逗号分隔多个
        var names = fx.split(',');
        for (var j = 0; j < names.length; j++) {
          var n = names[j].replace(/\s/g, '');
          if (n) add(n);
        }
      }
    }
  })();

})(window);
