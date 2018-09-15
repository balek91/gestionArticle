document.addEventListener("DOMContentLoaded", function DOMReady() {
    // const test = document.getElementById("test");
    function request(url = "/saveFormEveryMin") { 
        const name = $("#inputName").val(),
            prix = $("#inputPrix").val(),
            desc = $("#description").val();
        const form = {};
        form.name = name;
        form.prix = prix;
        form.desc = desc;
        const strForm = JSON.stringify(form);
        console.log(form);
        $.post(url, form, function(data){
            if (data.error) {
                return;
            }
            if (url === "/save") {
                window.location.href = "/list";
            }
        }).fail(function (){
            console.log("fail");
        });
    }
    // sauvegarde automatique toutes les minutes
    let indx = 1;
    setInterval(() => {
        console.log("rafaichissement : %s", indx);
        request();
        indx++;
    }, 60000);

    $("#formCreateArticle").on("submit", function (event) {
        event.preventDefault();
        request("/save");
    });

    $("#cancel").on("click", function (event) {
        event.preventDefault();
        window.location.href = "list";
    });
});
