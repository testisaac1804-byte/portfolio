var HOST_NAME = 'https://cdn.n4dhx7bt.com/';
var WEB_DOWNLOAD_LINK = '';
var ANDROID_DOWNLOAD_LINK = '';
var IOS_CLASSIC_DOWNLOAD_LINK = 'https://itunes.apple.com/app/%E5%AF%B0%E5%AE%87%E6%B5%8F%E8%A7%88%E5%99%A8/id1109296472';
var IOS_DOWNLOAD_LINK = '';

function isiOSDevice() {
    // iPad 於 iOS 13 以後版本的 useragent 內並未包含 iPad 字串，以 platform 與 maxTouchPoints 做判斷
    // https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    var isIOS = /iPad|iPhone|iPod/.test(navigator.platform) || isIpadOs()
    return isIOS;
}

function isAndroidDevice() {
    var userAgent = window.navigator.userAgent;
    var regex = /Android/i;
    return regex.test(userAgent);
}

function isIpadOs() {
    return (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function getUserAgentMajorVersion(userAgent, regex) {
    var results = regex.exec(userAgent);
    if (Array.isArray(results)
        && (results.length > 1)) {
        return parseInt(results[1], 10);
    } else {
        return 0;
    }
}

function getIosMajorVersion() {
    var userAgent = window.navigator.userAgent;

    // iPhone iOS 14 useragent:
    // Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.1 Mobile/15E148 Safari/604.1

    // iPad iOS 13 useragent:
    // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15

    var regex;

    if (isIpadOs()) {
        regex = / Version\/(\d+)/;
    } else {
        regex = / OS (\d+)/;
    }

    return getUserAgentMajorVersion(userAgent, regex);
}

function isIosClassicUser() {
    //UserAgent 為 UBiOS/28.x.x.x 以下版本則為經典版
    let userAgent = window.navigator.userAgent;
    let regex = /UBiOS\/(\d+)/;
    let iOSFirstVersion = getUserAgentMajorVersion(userAgent, regex);
    return iOSFirstVersion > 0 && iOSFirstVersion < 28;
}

function getDownloadLink() {
    var downloadLink = WEB_DOWNLOAD_LINK;
    if (isiOSDevice()) {
        if (isIosClassicUser()) {
            alert("尊敬的会员您好，建议您删除旧版寰宇APP，这样能保证下次开启时是新版的寰宇唷！");
        }

        if (getIosMajorVersion() < 14) {
            alert("建议您升级您的 iOS 版本至 14(含) 以上版本即可继续下载寰宇喔！");
            return;
        } else {
            downloadLink = IOS_DOWNLOAD_LINK;
        }
    } else if (isAndroidDevice()) {
        downloadLink = ANDROID_DOWNLOAD_LINK;
    }
    return downloadLink;
}