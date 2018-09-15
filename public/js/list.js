document.addEventListener("DOMContentLoaded", function DOMReady() {

    $("#deco").on("click", function (event) {
        
        $.post("/logout", function (data) { 
            if (data.error) {
                return;
            }
        });
        location.reload();
    });

    $("#addArticle").on("click", function addArticel() {
        window.location.href = "/create";
    });
});
