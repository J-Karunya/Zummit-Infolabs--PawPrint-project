const showPassword = document.getElementById("show-Password");
const passwordInput = document.getElementById("password");

showPassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showPassword.classList.remove("fa-eye");
        showPassword.classList.add("fa-eye-slash"); // Change to eye-slash icon
        } else {
            passwordInput.type = "password";
            showPassword.classList.remove("fa-eye-slash");
            showPassword.classList.add("fa-eye"); // Change back to eye icon
        }
});
