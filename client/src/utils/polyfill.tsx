import 'promise/polyfill';

// 新代码（core-js v3）
import 'core-js/actual/object';
import 'core-js/actual/array';
import 'core-js/actual/symbol';
import 'core-js/actual/set';
import 'core-js/actual/map';

// 或者直接引入完整的 polyfill（不推荐，体积大）
import 'core-js/actual';


if (!Element.prototype.matches) {
    // @ts-ignore
    Element.prototype.matches = Element.prototype.msMatchesSelector
    || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function (s:any) {
        var el:any = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }

        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement;
        } while (el !== null);
        return null;
    };
}
