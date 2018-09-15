document.addEventListener("DOMContentLoaded", function DOMReady() {
    const inputLogin = $("#inputLogin");

    $("#formulaireLogin").on("submit", function (event) {
        event.preventDefault();
        const login = inputLogin.val();console.log(login);
        $.post("/login", { login }, function(data){
            console.log(data);
            if (data.error) {
                window.location.reload();
                return;
            }
            window.location.href = "/create";
        }).fail(function (){
            alert("error");
        }); 
    });
});
