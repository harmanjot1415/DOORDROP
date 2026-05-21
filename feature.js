
document.addEventListener("DOMContentLoaded", function () {
    updateActiveNav();
    setupNewsletter();
    startCounters();
});


function updateActiveNav() {


    let currentPage = window.location.pathname.split("/").pop();

    let links = document.querySelectorAll(".nav-links a");
    links.forEach(function (link) {

        link.classList.remove("active");


        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

function rotateCard(card) {
    card.style.transform = "translateY(-8px)";
}

function resetCard(card) {
    card.style.transform = "translateY(0)";
}


function setupNewsletter() {

    let emailInput = document.getElementById("newsletterEmail");

    emailInput.addEventListener("input", function () {
        emailInput.style.border = "1px solid #ccc";
    });
}

function subscribeNewsletter() {

    let emailInput = document.getElementById("newsletterEmail");

    let email = emailInput.value;

    if (email.includes("@") && email.includes(".")) {

        emailInput.style.border = "2px solid green";
        emailInput.value = "";
        emailInput.placeholder = "Subscribed Successfully";

    } else {

        emailInput.style.border = "2px solid red";
        emailInput.value = "";
        emailInput.placeholder = "Enter Valid Email";
    }
}

function setCounter(id, endValue, speed) {

    let count = 0;

    let counter = document.getElementById(id);

    let interval = setInterval(function () {

        count = count + speed;

        // Decimal value ke liye
        if (id === "rating") {
            counter.innerText = count.toFixed(1);
        } else {
            counter.innerText = Math.floor(count);
        }

        // Stop counter
        if (count >= endValue) {

            counter.innerText = endValue;

            clearInterval(interval);
        }

    }, 20);
}
