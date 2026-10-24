(function () {
    var download_link_attribute = "download-link";

    function getQRCodeUrl(provider) {
        if (provider.className == "default-download-link") {
            return location.href + "/../download/index.html";
        }
        if (provider.getAttribute(download_link_attribute) != undefined) {
            return provider.getAttribute(download_link_attribute);
        }

        return undefined;
    }

    function spwnAdditionalInfoLabel(text) {
        var additionalInfo = document.createElement("div");
        additionalInfo.innerText = text;
        additionalInfo.style.backgroundColor = "#f5372f";
        additionalInfo.style.borderRadius = "10px";
        additionalInfo.style.color = "white";
        additionalInfo.style.fontSize = "14px";
        additionalInfo.style.left = "50%";
        additionalInfo.style.padding = "5px 5px 5px 5px";
        additionalInfo.style.position = "absolute";
        additionalInfo.style.top = "50%";
        additionalInfo.style.transform = "translate(-50%, -50%)";
        additionalInfo.style.wordBreak = "keep-all";
        return additionalInfo;
    }

    var additional_info_attribute = "additional-info";
    var provider_name_key = "provider-name";

    function spwanQRCode(provider) {
        var qrCodeElements = $(".qr-code .qr-code-img");

        qrCodeElements.empty();

        var url = getQRCodeUrl(provider);
        if (url == undefined) {
            qrCodeElements.get(0).removeAttribute(provider_name_key);
            return;
        }

        qrCodeElements.get(0).setAttribute(provider_name_key, provider.getAttribute(provider_name_key));

        new QRCode(qrCodeElements.get(0), {
            text: url,
            width: 140,
            height: 140,
            correctLevel: QRCode.CorrectLevel.H
        });

        if ((addInfo = provider.getAttribute(additional_info_attribute)) != undefined) {
            $(".qr-code-img")[0].appendChild(spwnAdditionalInfoLabel(addInfo));
        }
    };

    $(function GenerateQRCode() {
        $(".default-download-link").get(0).onclick = function () { spwanQRCode(this); };
        spwanQRCode($(".default-download-link").get(0));
    });

    $(function SetDownloadButtonLink() {
        var $downloadButtonLink = $('.download-btn a');
        var $downloadButton = $('.download-btn');

        $(window).on('load', function () {
            $downloadButtonLink.attr('href', "download.html");
            $downloadButton.removeClass('desktop').addClass('mobile');
        });
    });
    $(function bindDownloadButtonClickGA() {
        $('.download-btn a').click(function () {
            var downloadUrl = $(this).attr('href');
            ga('send', 'event', 'Link', 'Click', downloadUrl);
            gtag('event', 'click', {
                'link': downloadUrl
            });
        });
    });
    $(function i18n() {
        var languageLib = {
            zh_cn: {
                title: '寰宇浏览器',
                subTitle: '隐私不外露！',
                downloadTip: '支援 iOS 14+、Android 8+',
                downloadButton: '手机版',
                qrCodeText: '[ 扫描下载手机版 ]',
                changeProvider: '[ 更换载点供应商 ]',
                defaultDownload: '本地下载',
                fastTitle: '浏览速度更快',
                fastSubTitle: '寰宇独家线路加速技术',
                safetyTitle: '最佳的安全性',
                safetySubTitle: '保护您远离危险',
                privacyTitle: '最高级别的隐私保护',
                privacySubTitle: '免设置，隐私不外露'
            },
            zh_tw: {
                title: '寰宇瀏覽器',
                subTitle: '隱私不外露！',
                downloadTip: '支援 iOS 14+、Android 8+',
                downloadButton: '手機版',
                qrCodeText: '[ 掃描下載手機版 ]',
                changeProvider: '[ 更換載點供應商 ]',
                defaultDownload: '本地下載',
                fastTitle: '瀏覽速度更快',
                fastSubTitle: '寰宇獨家線路加速技術',
                safetyTitle: '最佳的安全性',
                safetySubTitle: '保護您遠離危險',
                privacyTitle: '最高級別的隱私保護',
                privacySubTitle: '免設置，隱私不外露'
            },
            en: {
                title: 'UNIVERSE BROWSER',
                subTitle: 'Avoid privacy leaks！',
                downloadTip: 'Support iOS 14+ and Android 8+.',
                downloadButton: 'Mobile',
                qrCodeText: '[ Scan to download mobile version ]',
                changeProvider: '[ Change Provider ]',
                defaultDownload: 'Mobile download',
                fastTitle: 'Fastest Browser',
                fastSubTitle: 'Use unique technology to improve the internet speed.',
                safetyTitle: 'Best Secure',
                safetySubTitle: 'Keep you away from danger.',
                privacyTitle: 'Most Private',
                privacySubTitle: 'Simple settings to avoid privacy leaks.'
            },
            ko: {
                title: "UB 브라우저",
                subTitle: "프라이버시 유출없이!",
                downloadTip: 'iOS 14+ 및 Android 8+ 지원.',
                downloadButton: "모바일",
                qrCodeText: "[ 모바일 버전을 스캔으로 다운로드 ]",
                changeProvider: "[ 부하점 공고업체 교환한다 ]",
                defaultDownload: "모바일 버전 다운로드",
                fastTitle: "브라우저 속도 더 빠르게",
                fastSubTitle: "UB의 독보적 회로 첨단 기술",
                safetyTitle: "최선 보안성",
                safetySubTitle: "위험에 빠지지 않게 당신을 보호한다.",
                privacyTitle: "최고급적 프라이버시 보호방치",
                privacySubTitle: "설치 필요없이 프라이버시 유출없이",
            },
            vi: {
                title: "Trình duyệt UB",
                subTitle: "quyền riêng tư cá nhân không bị lộ!",
                downloadTip: 'Hỗ trợ iOS 14+ và Android 8+.',
                downloadButton: "Di động",
                qrCodeText: "[ Quét và tải xuống phiên bản di động ]",
                changeProvider: "[ Thay đổi nhà cung cấp điểm tải ]",
                defaultDownload: "Tải phiên bản di động",
                fastTitle: "Tốc độ lướt web nhanh hơn",
                fastSubTitle: "Công nghệ đường dây tăng tốc độc quyền của UB",
                safetyTitle: "Tính bảo mật tối ưu",
                safetySubTitle: "Bảo vệ bạn khỏi nguy hiểm",
                privacyTitle: "Bảo vệ sự riêng tư ở mức cao nhất",
                privacySubTitle: "Miễn cài đặt, quyền riêng tư cá nhân không bị lộ",
           }
        };

        var i18n = (function () {
            var lang = '';
            var langLib = {};

            return {
                setLanguage: function (language, lib) {
                    lang = language;
                    langLib = lib;
                },
                translate: function (key) {
                    var currentLangObject = langLib[lang];
                    for (var langKey in currentLangObject) {
                        if (langKey === key) {
                            return currentLangObject[langKey];
                        }
                    }
                    return '';
                }
            };
        })();

        function setLanguageDropdownTextByKey(languageKey) {
            var languageText = $('#' + languageKey).text();
            $(".lang-title").text(languageText);
        }

        function setBodyLanguageAttributeByKey(languageKey) {
            $(".mainBody").attr('name', languageKey);
        }

        function setSelectedLanguageToLocalStorage(selectedLanguage) {
            localStorage.setItem('selectedLanguage', selectedLanguage);
        }

        function getSelectedLanguageFromLocalStorage() {
            return localStorage.getItem('selectedLanguage');
        }

        function changeLanguage(lang) {
            i18n.setLanguage(lang, languageLib);

            setDownloadButtonMobileText(i18n.translate('downloadButton'));
            $('.info-title').text(i18n.translate('title'));
            $('.info-subtitle').text(i18n.translate('subTitle'));
            $('.download-tip').text(i18n.translate('downloadTip'));
            $('.qr-code p').text(i18n.translate('qrCodeText'));
            $('.site-provider p').text(i18n.translate('changeProvider'));
            $('.default-download-link').text(i18n.translate('defaultDownload'));
            $('.fast .benefit-title').text(i18n.translate('fastTitle'));
            $('.fast .benefit-subtitle').text(i18n.translate('fastSubTitle'));
            $('.safety .benefit-title').text(i18n.translate('safetyTitle'));
            $('.safety .benefit-subtitle').text(i18n.translate('safetySubTitle'));
            $('.privacy .benefit-title').text(i18n.translate('privacyTitle'));
            $('.privacy .benefit-subtitle').text(i18n.translate('privacySubTitle'));
        }

        function setDownloadButtonMobileText(text) {
            var styleId = 'download-button-mobile-text-style';
            var $style = $('#' + styleId);
            if ($style.length === 0) {
                $style = $('<style id="' + styleId + '"></style>');
                $('head').append($style);
            }

            $('.download-btn').removeClass('desktop').addClass('mobile');
            $('.download-btn a').attr('data-mobile-label', text);
            $style.text([
                '.download-btn a:before { content: none !important; }',
                '.download-btn a:after { content: attr(data-mobile-label) !important; }'
            ].join('\n'));
        }

        var backup_url_key = "backup-url";
        var translate_key = "translate";

        function clearProviderList() {
            $(".backup-download-link").remove();
        }

        function spwanProviderList(providerList, languageKey) {
            var context_body = $(".provider-content").get(0);
            var currentProvider = $(".qr-code .qr-code-img").get(0).getAttribute("provider-name");

            for (var provider in providerList[backup_url_key]) {
                var newDownloadLink = document.createElement("a");
                newDownloadLink.className = "backup-download-link";
                newDownloadLink.onclick = function () { spwanQRCode(this); };
                newDownloadLink.setAttribute(download_link_attribute, providerList[backup_url_key][provider]);
                newDownloadLink.setAttribute(provider_name_key, provider);
                newDownloadLink.style.wordBreak = "keep-all";
                try { newDownloadLink.setAttribute(additional_info_attribute, providerList[additional_info_attribute][provider][languageKey]); } catch (e) { }
                newDownloadLink.innerText = providerList[translate_key][provider][languageKey];
                if (provider == currentProvider) {
                    spwanQRCode(newDownloadLink);
                }
                context_body.appendChild(newDownloadLink);
            }
        }

        function fetchProviderList(languageKey) {
            clearProviderList();
            var url = 'https://d1ko2n56twscbk.cloudfront.net/backup_url.jsonp';
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback: "getList",
                success: function (result) {
                    if (!result.hasOwnProperty(backup_url_key)) {
                        return;
                    }
                    if (!result.hasOwnProperty(translate_key)) {
                        return;
                    }
                    spwanProviderList(result, languageKey);
                }
            });
        }

        function handleLanguageChange(languageKey) {
            setLanguageDropdownTextByKey(languageKey);
            setBodyLanguageAttributeByKey(languageKey);
            changeLanguage(languageKey);
            //TODO 暫時移除部分中國地區 114 DNS 無法解析 cloudfront.net 的問題
            //fetchProviderList(languageKey);
        }

        function setDefaultLanguageByUserBrowserLanguage() {
            var selectedLanguage = getSelectedLanguageFromLocalStorage();
            var userBrowserLanguage = selectedLanguage || window.navigator.language || window.navigator.userLanguage || 'zh';
            var lowercaseUserBrowserLanguage = userBrowserLanguage.toLocaleLowerCase()
            var isChineseLanguage = lowercaseUserBrowserLanguage.indexOf('zh') !== -1;
            var isTraditionalChineseLanguage = isChineseLanguage && lowercaseUserBrowserLanguage.indexOf('tw') !== -1;
            var isEnglishLanguage = lowercaseUserBrowserLanguage.indexOf('en') !== -1;
            var isKoreanLanguage = lowercaseUserBrowserLanguage.indexOf('ko') !== -1;
            var isVietnameseLanguage = lowercaseUserBrowserLanguage.indexOf('vi') !== -1;

            if (isEnglishLanguage) {
                handleLanguageChange('en');
                return;
            }

            if (isKoreanLanguage) {
                handleLanguageChange('ko');
                return;
            }
            
            if (isVietnameseLanguage) {
                handleLanguageChange('vi')
                return;
            }

            if (isChineseLanguage) {
                if (isTraditionalChineseLanguage) {
                    handleLanguageChange('zh_tw');
                    return;
                }
                handleLanguageChange('zh_cn');
                return;
            }
        }

        $(function () {
            $(".lang-title").click(function () {
                $(".lang-group").slideToggle(300);
                $(this).toggleClass('lang-slide');
            });
            $(".lang-group a").click(function () {
                $(".lang-group").slideToggle(300);
                $(".lang-title").removeClass('lang-slide');

                var selectedLanguage = $(this).attr('id');
                handleLanguageChange(selectedLanguage);
                setSelectedLanguageToLocalStorage(selectedLanguage);
            });
            setDefaultLanguageByUserBrowserLanguage();
        });
    });
}());
