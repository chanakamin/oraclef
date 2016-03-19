$(document).ready(function () {
    $(document).ready(function () {
        $("#welcomeMenu").mmenu({
            extensions: ["theme-dark", "border-full", "multiline", "pagedim-white"],
            offCanvas: {
                position: "right",
                zposition: "front"
            }
        });

        $("#productMenu").mmenu({
            extensions: ["theme-dark", "border-full", "multiline", "pagedim-white"],
            offCanvas: {
                position: "right",
                zposition: "front"
            }
        });
        $("#calculatorMenu").mmenu({
            extensions: ["theme-dark", "border-full", "multiline", "pagedim-white"],
            offCanvas: {
                position: "right",
                zposition: "front"
            }
        });


        var n = document.getElementById("notChrome");
        if (n !== null)
            n.style.display = "none";
        var isChromium = window.chrome,
        vendorName = window.navigator.vendor,
        isOpera = window.navigator.userAgent.indexOf("OPR") > -1,
        isIEedge = window.navigator.userAgent.indexOf("Edge") > -1;
        if (isChromium !== null && isChromium !== undefined && vendorName === "Google Inc." && isOpera == false && isIEedge == false) {
            // is Google chrome
        } else {
            // not Google chrome
            document.getElementById("notChrome").style.display = "block";
        }
    });
});
