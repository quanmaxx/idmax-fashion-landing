(function () {
    "use strict";

    var config = window.IDMAX_CONFIG || {};
    var formSelector = "[data-lead-form]";
    var attributionKeys = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
        "fbclid",
        "gclid"
    ];

    function isConfigured(value) {
        return Boolean(value) &&
            value.indexOf("PASTE_") === -1 &&
            value.indexOf("_HERE") === -1;
    }

    function loadMetaPixel() {
        var pixelId = String(config.metaPixelId || "").trim();

        if (!/^[0-9]+$/.test(pixelId)) {
            return;
        }

        !function (f, b, e, v, n, t, s) {
            if (f.fbq) {
                return;
            }
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) {
                f._fbq = n;
            }
            n.push = n;
            n.loaded = true;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

        window.fbq("init", pixelId);
        window.fbq("track", "PageView");
    }

    function getStoredValue(key) {
        try {
            return sessionStorage.getItem("idmax_" + key) || "";
        } catch (error) {
            return "";
        }
    }

    function storeValue(key, value) {
        try {
            sessionStorage.setItem("idmax_" + key, value);
        } catch (error) {
            // Session storage may be blocked by browser privacy settings.
        }
    }

    function fillAttributionFields(form) {
        var params = new URLSearchParams(window.location.search);

        attributionKeys.forEach(function (key) {
            var currentValue = params.get(key) || getStoredValue(key);
            var field = form.elements.namedItem(key);

            if (params.get(key)) {
                storeValue(key, params.get(key));
            }

            if (field) {
                field.value = currentValue;
            }
        });

        if (form.elements.namedItem("landing_page")) {
            form.elements.namedItem("landing_page").value = window.location.href;
        }
        if (form.elements.namedItem("referrer")) {
            form.elements.namedItem("referrer").value = document.referrer || "";
        }
        if (form.elements.namedItem("user_agent")) {
            form.elements.namedItem("user_agent").value = navigator.userAgent || "";
        }
    }

    function showStatus(status, message, color) {
        if (!status) {
            return;
        }
        status.textContent = message;
        status.classList.remove("hidden");
        status.style.color = color;
    }

    function trackLead() {
        if (typeof window.fbq === "function") {
            window.fbq("track", "Lead", {
                content_name: config.formName || "IDMAX Fashion Logo Consultation",
                content_category: "Logo design"
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        loadMetaPixel();

        var form = document.querySelector(formSelector);
        if (!form) {
            return;
        }

        var endpoint = String(config.googleAppsScriptUrl || "").trim();
        var frame = document.getElementById("lead-response-frame");
        var status = document.getElementById("form-status");
        var submitButton = form.querySelector("button[type=submit]");
        var originalButtonLabel = submitButton ? submitButton.innerHTML : "";
        var pending = false;

        fillAttributionFields(form);

        if (frame) {
            frame.addEventListener("load", function () {
                if (!pending) {
                    return;
                }

                pending = false;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonLabel;
                }

                form.reset();
                fillAttributionFields(form);
                trackLead();
                showStatus(
                    status,
                    "Đã nhận thông tin. IDMAX sẽ liên hệ với bạn để trao đổi trước khi báo giá.",
                    "#A7F3D0"
                );
            });
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            fillAttributionFields(form);

            var formData = new FormData(form);
            var phone = String(formData.get("phone") || "").replace(/[^0-9]/g, "");
            var honeypot = String(formData.get("website") || "").trim();

            if (honeypot) {
                return;
            }

            if (phone.length < 8) {
                showStatus(status, "Vui lòng kiểm tra lại số điện thoại hoặc Zalo.", "#FCA5A5");
                return;
            }

            if (!isConfigured(endpoint)) {
                showStatus(
                    status,
                    "Form chưa được kết nối. Hãy điền URL Google Apps Script trong assets/js/marketing-config.js.",
                    "#FCA5A5"
                );
                return;
            }

            if (!frame) {
                showStatus(status, "Không tìm thấy vùng nhận phản hồi của form.", "#FCA5A5");
                return;
            }

            form.action = endpoint;
            pending = true;

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = "Đang gửi thông tin...";
            }

            HTMLFormElement.prototype.submit.call(form);
        });
    });
}());
