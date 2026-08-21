/*====================================================
    CYBERSHIELD PORTFOLIO
    SCRIPT.JS
    PART 1 - PARTICLE ENGINE
====================================================*/

/*==============================
    CANVAS SETUP
==============================*/

const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
});

/*==============================
    MOUSE
==============================*/

const mouse = {

    x: null,
    y: null,
    radius: 150

};

window.addEventListener("mousemove", (e) => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

});

window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

});

/*==============================
    PARTICLE SETTINGS
==============================*/

const particles = [];
const ripples = [];

const PARTICLE_DENSITY = 18000;

/*==============================
    SHIELD PARTICLE CLASS
==============================*/

class ShieldParticle {

    constructor() {

        this.reset();

    }

    reset() {

        this.x = Math.random() * canvas.width;

        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 6 + 8;

        this.speedX = (Math.random() - 0.5) * 0.35;

        this.speedY = (Math.random() - 0.5) * 0.35;

        this.rotation = Math.random() * Math.PI * 2;

        this.rotationSpeed =
            (Math.random() - 0.5) * 0.01;

        this.opacity =
            Math.random() * 0.20 + 0.25;

        this.glow =
            Math.random() * 12 + 8;

    }

    update() {

        this.x += this.speedX;
        this.y += this.speedY;

        this.rotation += this.rotationSpeed;

        if (this.x > canvas.width + 20)
            this.x = -20;

        if (this.x < -20)
            this.x = canvas.width + 20;

        if (this.y > canvas.height + 20)
            this.y = -20;

        if (this.y < -20)
            this.y = canvas.height + 20;

    }

    draw() {

        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.rotate(this.rotation);

        ctx.shadowBlur = this.glow;
        ctx.shadowColor = "#00E5FF";

        ctx.fillStyle =
            `rgba(0,229,255,${this.opacity})`;

        /*
            Temporary circle.

            Part 2 will replace this
            with an actual shield icon.
        */

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            this.size / 2,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();

    }

}

/*==============================
    CREATE PARTICLES
==============================*/

function createParticles() {

    particles.length = 0;

    const amount = Math.floor(

        (canvas.width * canvas.height)
        / PARTICLE_DENSITY

    );

    for (let i = 0; i < amount; i++) {

        particles.push(
            new ShieldParticle()
        );

    }

}

createParticles();

/*==============================
    ANIMATION LOOP
==============================*/

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(particle => {

        particle.update();

        particle.draw();

    });

    requestAnimationFrame(animate);

}

animate();

/*==============================
    DEBUG
==============================*/

console.log(`
====================================
 CyberShield Engine Loaded
====================================

Particles : ${particles.length}

Canvas :
${canvas.width} x ${canvas.height}

====================================
`);
/*====================================================
    SCRIPT.JS
    PART 2 - SHIELDS, CONNECTIONS & INTERACTION
====================================================*/

/*==============================
    DRAW SHIELD
==============================*/

ShieldParticle.prototype.draw = function () {

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    ctx.shadowBlur = this.glow;
    ctx.shadowColor = "#00E5FF";

    ctx.strokeStyle = `rgba(0,229,255,${this.opacity})`;
    ctx.lineWidth = 2;

    ctx.beginPath();

    // Shield shape
    ctx.moveTo(0, -this.size);

    ctx.lineTo(this.size * 0.75, -this.size * 0.45);

    ctx.lineTo(this.size * 0.6, this.size * 0.55);

    ctx.lineTo(0, this.size);

    ctx.lineTo(-this.size * 0.6, this.size * 0.55);

    ctx.lineTo(-this.size * 0.75, -this.size * 0.45);

    ctx.closePath();

    ctx.stroke();

    ctx.restore();

};

/*==============================
    CONNECTION LINES
==============================*/

function connectParticles() {

    const maxDistance = 140;

    for (let a = 0; a < particles.length; a++) {

        for (let b = a + 1; b < particles.length; b++) {

            const dx = particles[a].x - particles[b].x;
            const dy = particles[a].y - particles[b].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {

                const alpha = 1 - distance / maxDistance;

                ctx.beginPath();

                ctx.strokeStyle =
                    `rgba(0,229,255,${alpha * 0.35})`;

                ctx.lineWidth = 1;

                ctx.moveTo(
                    particles[a].x,
                    particles[a].y
                );

                ctx.lineTo(
                    particles[b].x,
                    particles[b].y
                );

                ctx.stroke();

            }

        }

    }

}

/*==============================
    MOUSE REPULSION
==============================*/

ShieldParticle.prototype.update = function () {

    this.x += this.speedX;
    this.y += this.speedY;

    this.rotation += this.rotationSpeed;

    if (mouse.x !== null) {

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {

            const angle = Math.atan2(dy, dx);

            const force =
                (mouse.radius - distance) /
                mouse.radius;

            this.x += Math.cos(angle) * force * 2;
            this.y += Math.sin(angle) * force * 2;

        }

    }

    if (this.x > canvas.width + 20) this.x = -20;
    if (this.x < -20) this.x = canvas.width + 20;
    if (this.y > canvas.height + 20) this.y = -20;
    if (this.y < -20) this.y = canvas.height + 20;

};

/*==============================
    RIPPLE EFFECT
==============================*/

canvas.addEventListener("click", e => {

    ripples.push({

        x: e.clientX,
        y: e.clientY,
        radius: 0,
        alpha: 1

    });

});

function drawRipples() {

    for (let i = ripples.length - 1; i >= 0; i--) {

        const ripple = ripples[i];

        ctx.beginPath();

        ctx.arc(
            ripple.x,
            ripple.y,
            ripple.radius,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            `rgba(0,229,255,${ripple.alpha})`;

        ctx.lineWidth = 2;

        ctx.stroke();

        ripple.radius += 2.5;
        ripple.alpha -= 0.015;

        if (ripple.alpha <= 0) {

            ripples.splice(i, 1);

        }

    }

}

/*==============================
    REPLACE ANIMATE LOOP
==============================*/

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {

        particle.update();

    });

    connectParticles();

    particles.forEach(particle => {

        particle.draw();

    });

    drawRipples();

    requestAnimationFrame(animate);

}
/*====================================================
    SCRIPT.JS
    PART 3 - UI ANIMATIONS
====================================================*/

/*==============================
    TYPING EFFECT
==============================*/

const typingElement = document.getElementById("typing");

const typingTexts = [
      "Security Analyst",
      "SOC Analyst",
      "Cybersecurity Professional",
      "Aspiring Penetration Tester",
      "Software Developer"
];

let textIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWriter() {

    if (!typingElement) return;

    const current = typingTexts[textIndex];

    if (!deleting) {

        typingElement.textContent =
            current.substring(0, charIndex++);

        if (charIndex > current.length) {

            deleting = true;

            setTimeout(typeWriter, 1500);

            return;
        }

    } else {

        typingElement.textContent =
            current.substring(0, charIndex--);

        if (charIndex < 0) {

            deleting = false;

            textIndex++;

            if (textIndex >= typingTexts.length)
                textIndex = 0;
        }

    }

    setTimeout(typeWriter, deleting ? 40 : 90);

}

typeWriter();

/*==============================
    SCROLL REVEAL
==============================*/

const revealElements =
    document.querySelectorAll(
        ".glass-card, .skill-card, .project-card, .contact-card, .timeline-item"
    );

revealElements.forEach(el => {

    el.classList.add("reveal");

});

function revealOnScroll() {

    revealElements.forEach(element => {

        const top =
            element.getBoundingClientRect().top;

        if (top < window.innerHeight - 100) {

            element.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

/*==============================
    NAVBAR BACKGROUND
==============================*/

const header =
    document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 80) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

});

/*==============================
    ACTIVE NAVIGATION
==============================*/

const sections =
    document.querySelectorAll("section");

const navLinks =
    document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 150;

        if (window.scrollY >= top) {

            current = section.id;

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            "#" + current
        ) {

            link.classList.add("active");

        }

    });

});

/*==============================
    SMOOTH SCROLL
==============================*/

navLinks.forEach(link => {

    link.addEventListener("click", function(e){

        e.preventDefault();

        const target =
            document.querySelector(
                this.getAttribute("href")
            );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

/*==============================
    OPTIONAL PARALLAX
==============================*/

window.addEventListener("mousemove", e => {

    const x =
        (e.clientX / window.innerWidth - 0.5) * 8;

    const y =
        (e.clientY / window.innerHeight - 0.5) * 8;

    canvas.style.transform =
        `translate(${x}px, ${y}px)`;

});

/*==============================
    INITIALIZE
==============================*/

window.addEventListener("load", () => {

    revealOnScroll();

    console.log(
        "CyberShield Portfolio Loaded Successfully!"
    );

});

/* =========================================
   BACK TO TOP + POB POSITION
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const backToTop = document.getElementById("backToTop");
    const chatbot = document.querySelector(".chatbot");

    if (!backToTop) return;


    // Check scroll position
    function handleScroll() {

        if (window.scrollY > 300) {

            // Show back-to-top button
            backToTop.classList.add("show");

            // Move POB above it
            if (chatbot) {
                chatbot.classList.add("move-up");
            }

        } else {

            // Hide back-to-top button
            backToTop.classList.remove("show");

            // Return POB to original position
            if (chatbot) {
                chatbot.classList.remove("move-up");
            }

        }
    }


    // Detect scrolling
    window.addEventListener("scroll", handleScroll);


    // Back to top
    backToTop.addEventListener("click", function () {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });


    // Check initial position
    handleScroll();

});

// ==================================================
// CONTACT FORM
// ==================================================

const contactForm = document.getElementById("contact-form");

const contactSubmit =
    document.getElementById("contact-submit");

const formSuccess =
    document.getElementById("form-success");

const formError =
    document.getElementById("form-error");


// ==================================================
// FORMSPREE ENDPOINT
// ==================================================
//
// Replace YOUR_FORM_ID with the ID Formspree
// gave you.
//
// Example:
// https://formspree.io/f/abcd1234
//
// ==================================================

const formspreeEndpoint =
    "https://formspree.io/f/maewegpb";


// ==================================================
// SUBMIT FORM
// ==================================================

contactForm.addEventListener("submit", async function (event) {

    // Stop the normal form submission.
    // This prevents the Formspree "Thanks!" page.
    event.preventDefault();


    // Get button elements

    const buttonText =
        contactSubmit.querySelector(".button-text");

    const buttonArrow =
        contactSubmit.querySelector(".button-arrow");


    // Hide previous messages

    formSuccess.classList.remove("show");

    formError.classList.remove("show");


    // Disable button

    contactSubmit.disabled = true;


    // Change button text

    buttonText.textContent = "Sending...";

    buttonArrow.textContent = "↗";


    try {

        // Collect form data

        const formData =
            new FormData(contactForm);


        // Send to Formspree

        const response = await fetch(
            formspreeEndpoint,
            {
                method: "POST",

                body: formData,

                headers: {
                    "Accept": "application/json"
                }
            }
        );


        // ==================================================
        // SUCCESS
        // ==================================================

        if (response.ok) {

            // Show success message

            formSuccess.classList.add("show");


            // Clear the form

            contactForm.reset();


            // Update button

            buttonText.textContent =
                "Message Sent";

            buttonArrow.textContent =
                "✓";


        }

        // ==================================================
        // ERROR
        // ==================================================

        else {

            throw new Error(
                "Form submission failed"
            );

        }

    }


    catch (error) {

        console.error(
            "Contact form error:",
            error
        );


        // Show error

        formError.classList.add("show");


        // Reset button text

        buttonText.textContent =
            "Send Message";

        buttonArrow.textContent =
            "→";

    }


    // ==================================================
    // RE-ENABLE BUTTON
    // ==================================================

    setTimeout(function () {

        contactSubmit.disabled = false;


        // Only reset button if there wasn't
        // an error message being displayed.

        if (
            !formError.classList.contains("show")
        ) {

            buttonText.textContent =
                "Send Message";

            buttonArrow.textContent =
                "→";

        }

    }, 3000);

});

/* =========================================
   POB CHATBOT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const chatbotToggle =
        document.getElementById("chatbotToggle");

    const chatbotWindow =
        document.getElementById("chatbotWindow");

    const chatbotClose =
        document.getElementById("chatbotClose");


    /* =========================================
       OPEN / CLOSE
    ========================================= */

    if (chatbotToggle && chatbotWindow) {

        chatbotToggle.addEventListener(
            "click",
            function () {

                chatbotWindow.classList.toggle("active");

            }
        );

    }


    if (chatbotClose && chatbotWindow) {

        chatbotClose.addEventListener(
            "click",
            function () {

                chatbotWindow.classList.remove("active");

            }
        );

    }


    /* =========================================
       SEND BUTTON
    ========================================= */

});


/* =========================================
   ADD MESSAGE
========================================= */

function addMessage(message, sender) {

    const messages =
        document.getElementById("chatbotMessages");

    if (!messages) return;


    const div =
        document.createElement("div");


    div.className =
        sender === "bot"
            ? "bot-message"
            : "user-message";


    div.innerHTML = message;


    messages.appendChild(div);


    messages.scrollTop =
        messages.scrollHeight;
}


/* =========================================
   TYPING EFFECT
========================================= */

function botReply(message) {

    setTimeout(function () {

        addMessage(message, "bot");

    }, 500);

}


/* =========================================
   POB QUICK QUESTIONS
========================================= */

function botQuestion(type) {

    let question = "";
    let answer = "";


    /* =========================================
       WHO IS PARLAN?
    ========================================= */

    if (type === "who") {

        question = "👀 Who's Parlan?";

        answer = `
            🕵️ <strong>IDENTITY SCAN COMPLETE</strong>

            <br><br>

            Parlan Obeegadoo is a cybersecurity
            professional from Mauritius. 🔐

            <br><br>

            He has a Master's degree in
            <strong>Cyber Security & Penetration Testing</strong>.

            <br><br>

            Basically...

            <br>

            He spends his time convincing computers
            that he's the boss. 😂
        `;
    }


    /* =========================================
       SKILLS
    ========================================= */

    else if (type === "skills") {

        question = "🧠 What's he good at?";

        answer = `
            💻 <strong>SKILL SCAN COMPLETE</strong>

            <br><br>

            🚨 Security Alert Investigation<br>
            📡 Security Monitoring<br>
            🖥️ SIEM<br>
            🔎 Log Analysis<br>
            🛡️ Endpoint Security<br>
            💡 Security Advisory<br>
            🌐 Network Security<br>
            🔐 Antivirus Management

            <br><br>

            POBot's professional opinion:

            <br>

            <strong>Not bad. 😎</strong>
        `;
    }


    /* =========================================
       EXPERIENCE
    ========================================= */

    else if (type === "experience") {

        question = "💼 Where's he worked?";

        answer = `
            💼 <strong>CAREER FILE OPENED</strong>

            <br><br>

            Parlan has professional experience
            in cybersecurity, security analysis
            and software development.

            <br><br>

            He's worked with security technologies
            including SIEM, EDR and endpoint
            security tools.

            <br><br>

            Want the full story?

            <br>

            <strong>Check the Timeline section. 👀</strong>
        `;
    }


    /* =========================================
       EDUCATION
    ========================================= */

    else if (type === "education") {

        question = "🎓 Nerd stuff?";

        answer = `
            🎓 <strong>NERD MODE ACTIVATED</strong>

            <br><br>

            Parlan completed a Master's degree in

            <br>

            <strong>
            Cyber Security & Penetration Testing
            </strong>.

            <br><br>

            He also has an undergraduate degree
            and has spent a considerable amount of
            time studying cybersecurity.

            <br><br>

            So yes...

            <br>

            <strong>He's officially a nerd. 🤓</strong>
        `;
    }


    /* =========================================
       HIRE
    ========================================= */

    else if (type === "hire") {

        question = "🤔 Hire this guy?";

        answer = `
            🤖 <strong>POBot HIRING ANALYSIS</strong>

            <br><br>

            Let's see...

            <br><br>

            Cybersecurity experience? ✅<br>
            Master's degree? ✅<br>
            Security knowledge? ✅<br>
            Willing to learn? ✅<br>
            Talks to computers? Unfortunately, yes. 😂

            <br><br>

            Final recommendation:

            <br>

            <strong>INTERVIEW HIM. 😎</strong>

            <br><br>

            POBot has spoken.
        `;
    }


    /* =========================================
       JOKE
    ========================================= */

    else if (type === "joke") {

        question = "😂 Tell me a joke";

        answer = `
            😂 <strong>POBot JOKE DATABASE</strong>

            <br><br>

            Why did the hacker break up with
            their password?

            <br><br>

            Because it wasn't

            <strong>strong enough.</strong> 💀😂

            <br><br>

            POBot apologises for the quality.
        `;
    }


    /* =========================================
       GAMES
    ========================================= */

    else if (type === "games") {

        question = "🎮 What games does he play?";

        answer = `
            🎮 <strong>GAMING DATABASE</strong>

            <br><br>

            POBot is currently searching
            Parlan's gaming history...

            <br><br>

            <strong>
            [ GAMING PROFILE FOUND ✓ ]
            </strong>

            <br><br>

            Parlan plays <strong>007 First Light, Forza Horizon 5, World of Tanks Blitz & The Last of Us 🔥🔥</strong>.

            <br><br>

            POBot's gaming assessment:

                <br>

                🎯 Aim: ⭐⭐⭐⭐☆<br>
                🧠 Strategy: ⭐⭐⭐⭐☆<br>
                🏎️ Driving: ⭐⭐⭐⭐⭐<br>
                🎮 Overall: ⭐⭐⭐⭐☆

                <br><br>

                <strong>Verdict: Not bad... but still needs more practice 😂</strong>
        `;
    }


    /* =========================================
       HOBBIES
    ========================================= */

    else if (type === "hobbies") {

        question = "🏄 What hobbies does this guy have?";

        answer = `
            🕵️ <strong>PERSONAL LIFE SCAN</strong>

            <br><br>

            POBot is accessing the classified
            hobby database...

            <br><br>

            <strong>
            [ ACCESS GRANTED ✓ ]
            </strong>

            <br><br>

            When he's not doing cybersecurity,
            Parlan enjoys <strong> Photography, Gaming, Reading,
                Fitness, and Exploring Technology.</strong>.

            <br><br>

            POBot rates these hobbies:

            <br>

            ⭐⭐⭐⭐⭐
        `;
    }


    /* =========================================
       ROAST
    ========================================= */

    else if (type === "roast") {

        question = "😈 Can POBot roast Parlan?";

        answer = `
            😈 <strong>ROAST MODE ACTIVATED</strong>

            <br><br>

            Are you sure?

            <br><br>

            Fine...

            <br><br>

            Parlan knows how to investigate
            cybersecurity incidents...

            <br>

            but somehow still can't investigate
            where his free time went. 😂

            <br><br>

            POBot recommends emotional support
            after this interaction. 💀
        `;
    }


    /* =========================================
       SECRET
    ========================================= */

    else if (type === "secret") {

        question = "🤫 What's his secret?";

        answer = `
            🤫 <strong>TOP SECRET FILE</strong>

            <br><br>

            Accessing classified information...

            <br>

            ████████████████████

            <br><br>

            Nice try. 😂

            <br><br>

            POBot has been specifically instructed
            <strong>NOT</strong> to reveal Parlan's secrets.

            <br><br>

            ...and I definitely don't know anything
            about the snacks. 👀
        `;
    }


    /* =========================================
       WHO'S IN CHARGE?
    ========================================= */

    else if (type === "boss") {

        question = "🤖 Who's really in charge?";

        answer = `
            🤖 <strong>AUTHORITY CHECK</strong>

            <br><br>

            According to Parlan:

            <br>

            <strong>"I'm in charge."</strong>

            <br><br>

            According to POBot:

            <br>

            <strong>"That's adorable." 😂</strong>

            <br><br>

            Official answer:

            <br>

            <strong>POBot runs the portfolio. 🤖</strong>
        `;
    }


    /* =========================================
       DOES HE TOUCH GRASS?
    ========================================= */

    else if (type === "grass") {

        question = "💻 Does he touch grass?";

        answer = `
            🌱 <strong>GRASS DETECTION SYSTEM</strong>

            <br><br>

            Scanning...

            <br>

            ███████████████░░░

            <br><br>

            Grass detected.

            <br><br>

            But the system cannot confirm
            how often it is touched. 😂

            <br><br>

            POBot recommends:

            <br>

            <strong>GO OUTSIDE SOMETIMES. 🌱</strong>
        `;
    }


    /* =========================================
       SEND QUESTION + ANSWER
    ========================================= */

    addMessage(question, "user");

    botReply(answer);
}

/* =========================================
   TIMELINE SEE MORE / SEE LESS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const timeline = document.querySelector(".timeline");
    const timelineToggle = document.getElementById("timelineToggle");

    if (!timeline || !timelineToggle) return;

    timelineToggle.addEventListener("click", function () {

        timeline.classList.toggle("expanded");

        const isExpanded =
            timeline.classList.contains("expanded");

        if (isExpanded) {

            timelineToggle.innerHTML =
                'See Less <span>↑</span>';

        } else {

            timelineToggle.innerHTML =
                'See More <span>↓</span>';

            // Optional: return to the top of the timeline
            document.getElementById("timeline").scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});
// =========================================
// UNIQUE VISITOR COUNTER
// =========================================

async function updateVisitorCount() {

    const counterElement =
        document.getElementById("visitor-count");

    if (!counterElement) return;

    try {

        // -----------------------------------------
        // GET OR CREATE UNIQUE VISITOR ID
        // -----------------------------------------

        let visitorId =
            localStorage.getItem("pob_visitor_id");

        if (!visitorId) {

            visitorId =
                crypto.randomUUID();

            localStorage.setItem(
                "pob_visitor_id",
                visitorId
            );
        }


        // -----------------------------------------
        // SEND VISITOR ID TO CLOUDFLARE WORKER
        // -----------------------------------------

        const response = await fetch(
            "https://pob-visitor-counter.obeegadooparlan.workers.dev",
            {
                method: "GET",

                headers: {
                    "X-Visitor-ID": visitorId
                }
            }
        );


        // -----------------------------------------
        // CHECK RESPONSE
        // -----------------------------------------

        if (!response.ok) {

            throw new Error(
                "Visitor counter request failed"
            );

        }


        // -----------------------------------------
        // GET VISITOR COUNT
        // -----------------------------------------

        const data =
            await response.json();


        // -----------------------------------------
        // DISPLAY COUNT
        // -----------------------------------------

        counterElement.textContent =
            Number(data.visitors)
                .toLocaleString();


    } catch (error) {

        console.error(
            "Visitor counter error:",
            error
        );

        counterElement.textContent = "—";

    }

}


// =========================================
// START COUNTER
// =========================================

updateVisitorCount();
