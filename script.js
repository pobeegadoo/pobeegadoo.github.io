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
    "Software Developer",
    "Future Penetration Tester",
    "Web Developer"
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
   QUICK QUESTIONS
========================================= */

function botQuestion(type) {

    let question = "";
    let answer = "";


    /* WHO */

    if (type === "who") {

        question =
            "Who is Parlan?";

        answer = `
            🕵️ <strong>IDENTITY SCAN COMPLETE</strong>
            <br><br>

            Parlan Obeegadoo is a cybersecurity
            professional from Mauritius. 🔐

            <br><br>

            He has a Master's degree in
            <strong>Cyber Security & Penetration Testing</strong>.

            <br><br>

            Basically... he spends his time
            convincing computers that he's the boss. 😂
        `;

    }


    /* SKILLS */

    else if (type === "skills") {

        question =
            "What are Parlan's skills?";

        answer = `
            💻 <strong>SKILL DATABASE LOADED</strong>
            <br><br>

            🔐 Cybersecurity<br>
            🕵️ Threat Detection<br>
            🛡️ SOC / Security Analysis<br>
            🌐 Network Security<br>
            🐍 Python<br>
            ☕ JavaScript<br>
            🐧 Linux<br>
            🔎 Log Analysis<br>
            🐝 Honeypots
            <br><br>

            POB says: <strong>not bad. 😎</strong>
        `;

    }


    /* EXPERIENCE */

    else if (type === "experience") {

        question =
            "What experience does Parlan have?";

        answer = `
            💼 <strong>EXPERIENCE DATABASE ACCESSED</strong>
            <br><br>

            Parlan has professional experience
            in cybersecurity and security analysis.

            <br><br>

            He has worked with technologies
            including SIEM, EDR and endpoint
            security tools.

            <br><br>

            For the full details, check the
            <strong>Timeline</strong> section.
        `;

    }


    /* EDUCATION */

    else if (type === "education") {

        question =
            "What did Parlan study?";

        answer = `
            🎓 <strong>EDUCATION RECORD FOUND</strong>
            <br><br>

            <strong>
            MSc Cyber Security & Penetration Testing
            </strong>

            <br><br>

            He focused his studies on
            cybersecurity, penetration testing
            and threat detection.

            <br><br>

            And yes...

            <strong>
            he survived the dissertation. 😂
            </strong>
        `;

    }


    /* HONEYPOT */

    else if (type === "honeypot") {

        question =
            "Tell me about the Honeypot Project.";

        answer = `
            🐝 <strong>HONEYPOT DETECTED</strong>
            <br><br>

            Parlan developed a honeypot environment
            to study malicious activity,
            attack patterns and intrusion behaviour.

            <br><br>

            The project combines
            <strong>
            honeypot technology,
            threat detection and machine learning
            </strong>.

            <br><br>

            POB's professional opinion:

            <br><br>

            <strong>
            Why wait for attackers when you
            can build something for them to attack? 😂
            </strong>
        `;

    }


    /* HIRE */

    else if (type === "hire") {

        question =
            "Why should someone hire Parlan?";

        answer = `
            🚀 <strong>HIRING ANALYSIS</strong>
            <br><br>

            Parlan combines academic cybersecurity
            knowledge with practical experience
            and hands-on projects.

            <br><br>

            He's curious, technical and willing
            to learn new technologies.

            <br><br>

            Most importantly...

            <strong>
            he actually likes cybersecurity. 🔐
            </strong>

            <br><br>

            POB recommends:
            <strong>INTERVIEW HIM. 😎</strong>
        `;

    }


    /* JOKE */

    else if (type === "joke") {

        question =
            "Tell me a cybersecurity joke.";

        answer = `
            😂 <strong>POB JOKE DATABASE</strong>
            <br><br>

            Why did the hacker break up with
            their password?

            <br><br>

            Because it wasn't
            <strong>strong enough.</strong> 💀😂
        `;

    }


    addMessage(question, "user");


    botReply(answer);
}


/* =========================================
   USER MESSAGE
========================================= */

function sendMessage() {

    const input =
        document.getElementById("chatbotInput");

    if (!input) return;


    const message =
        input.value.trim();


    if (!message) return;


    addMessage(message, "user");


    input.value = "";


    const lower =
        message.toLowerCase();


    let response = `
        🤔 Hmm...

        <br><br>

        POB's tiny AI brain couldn't
        find that in my database. 😂

        <br><br>

        Try asking about:

        <strong>
        Parlan, skills, experience,
        education, projects, hiring,
        jokes or cybersecurity.
        </strong>
    `;


    /* =========================================
       GREETINGS
    ========================================= */

    if (
        lower.includes("hello") ||
        lower.includes("hi") ||
        lower.includes("hey")
    ) {

        response = `
            👋 <strong>HELLO HUMAN.</strong>

            <br><br>

            I am <strong>POB</strong>,
            Parlan's highly sophisticated
            digital assistant.

            <br><br>

            Sophisticated...

            <br>

            ...most of the time. 😂

            <br><br>

            What do you want to know?
        `;

    }


    /* =========================================
       NAME
    ========================================= */

    else if (
        lower.includes("who is parlan") ||
        lower.includes("who is pob") ||
        lower.includes("who are you") ||
        lower.includes("your name")
    ) {

        response = `
            🤖 <strong>IDENTITY CONFIRMED</strong>

            <br><br>

            My name is <strong>POB</strong>.

            <br><br>

            I'm Parlan's digital sidekick,
            portfolio guardian and
            professional nonsense generator. 😂
        `;

    }


    /* =========================================
       SKILLS
    ========================================= */

    else if (
        lower.includes("skill") ||
        lower.includes("technology") ||
        lower.includes("technologies") ||
        lower.includes("what can he do")
    ) {

        response = `
            💻 <strong>SKILLS FOUND</strong>

            <br><br>

            Cybersecurity 🔐<br>
            Threat Detection 🕵️<br>
            Network Security 🌐<br>
            Python 🐍<br>
            JavaScript ☕<br>
            Linux 🐧<br>
            Log Analysis 🔎<br>
            Honeypots 🐝

            <br><br>

            Want the full list?

            <br>

            Check the
            <strong>Skills</strong> section.
        `;

    }


    /* =========================================
       EXPERIENCE
    ========================================= */

    else if (
        lower.includes("experience") ||
        lower.includes("work") ||
        lower.includes("job")
    ) {

        response = `
            💼 <strong>EXPERIENCE FOUND</strong>

            <br><br>

            Parlan has experience in
            cybersecurity, security analysis,
            software development and technical
            projects.

            <br><br>

            Want the detailed timeline?

            <br>

            POB recommends checking
            <strong>Experience & Achievements</strong>.
        `;

    }


    /* =========================================
       EDUCATION
    ========================================= */

    else if (
        lower.includes("education") ||
        lower.includes("degree") ||
        lower.includes("master") ||
        lower.includes("study")
    ) {

        response = `
            🎓 <strong>EDUCATION DATABASE</strong>

            <br><br>

            MSc in
            <strong>
            Cyber Security & Penetration Testing
            </strong>.

            <br><br>

            He also has an undergraduate degree
            and focused his postgraduate studies
            on cybersecurity.

            <br><br>

            Dissertation status:

            <strong>
            SURVIVED. 😂
            </strong>
        `;

    }


    /* =========================================
       PROJECT
    ========================================= */

    else if (
        lower.includes("project") ||
        lower.includes("honeypot")
    ) {

        response = `
            🐝 <strong>PROJECT DETECTED</strong>

            <br><br>

            The Honeypot project studies
            malicious activity, attack patterns
            and intrusion behaviour.

            <br><br>

            It combines honeypot technology,
            cybersecurity monitoring and
            machine learning.

            <br><br>

            POB translation:

            <br>

            <strong>
            "Come attack my fake server." 😂
            </strong>
        `;

    }


    /* =========================================
       HIRE
    ========================================= */

    else if (
        lower.includes("hire") ||
        lower.includes("employ") ||
        lower.includes("good candidate")
    ) {

        response = `
            🚀 <strong>HIRING MODE ACTIVATED</strong>

            <br><br>

            Parlan has cybersecurity knowledge,
            practical experience and a willingness
            to learn.

            <br><br>

            POB's recommendation:

            <br><br>

            <strong>
            At least give him an interview. 😎
            </strong>
        `;

    }


    /* =========================================
       JOKE
    ========================================= */

    else if (
        lower.includes("joke") ||
        lower.includes("funny")
    ) {

        response = `
            😂 <strong>POB JOKE ENGINE</strong>

            <br><br>

            Why don't cybersecurity experts
            trust stairs?

            <br><br>

            Because they're always
            <strong>up to something.</strong> 💀😂
        `;

    }


    /* =========================================
       PASSWORD
    ========================================= */

    else if (
        lower.includes("password") ||
        lower.includes("secret")
    ) {

        response = `
            🔐 <strong>SECURITY ALERT</strong>

            <br><br>

            Nice try.

            <br><br>

            POB does not know Parlan's
            passwords.

            <br><br>

            And even if I did...

            <strong>
            I wouldn't tell you. 😂
            </strong>
        `;

    }


    /* =========================================
       HACK
    ========================================= */

    else if (
        lower.includes("hack") ||
        lower.includes("attack")
    ) {

        response = `
            🚨 <strong>INTRUSION DETECTED</strong>

            <br><br>

            Nice try, hacker. 👀

            <br><br>

            POB is a portfolio chatbot,
            not your personal hacking assistant.

            <br><br>

            But I can tell you about
            Parlan's cybersecurity projects. 🔐
        `;

    }


    /* =========================================
       COFFEE EASTER EGG
    ========================================= */

    else if (
        lower.includes("coffee")
    ) {

        response = `
            ☕ <strong>COFFEE PROTOCOL ACTIVATED</strong>

            <br><br>

            Scanning caffeine levels...

            <br><br>

            ☕ Coffee<br>
            ☕ More coffee<br>
            ☕ Emergency coffee

            <br><br>

            <strong>
            STATUS: CAFFEINATED 🟢
            </strong>

            <br><br>

            POB strongly recommends
            more coffee. 😂
        `;

    }


    /* =========================================
       MATRIX EASTER EGG
    ========================================= */

    else if (
        lower.includes("matrix") ||
        lower.includes("neo")
    ) {

        response = `
            🟢 <strong>WAKE UP, NEO...</strong>

            <br><br>

            The Matrix has been detected
            inside this portfolio. 👀

            <br><br>

            Unfortunately, POB is still
            looking for the red pill.

            💊😂
        `;

    }


    /* =========================================
       SUDO EASTER EGG
    ========================================= */

    else if (
        lower === "sudo" ||
        lower.includes("sudo")
    ) {

        response = `
            💻 <strong>ROOT ACCESS REQUESTED</strong>

            <br><br>

            Checking privileges...

            <br>

            Checking credentials...

            <br>

            Checking vibes...

            <br><br>

            ❌ <strong>ACCESS DENIED</strong>

            <br><br>

            Nice try. 😂
        `;

    }


    /* =========================================
       HANDSOME EASTER EGG
    ========================================= */

    else if (
        lower.includes("parlan") &&
        (
            lower.includes("handsome") ||
            lower.includes("good looking") ||
            lower.includes("hot")
        )
    ) {

        response = `
            😎 <strong>OBJECTIVE INFORMATION DETECTED</strong>

            <br><br>

            POB can neither confirm nor deny
            this highly important information.

            <br><br>

            ...

            <br>

            But POB approves. 😂
        `;

    }


    /* =========================================
       SEND RESPONSE
    ========================================= */

    setTimeout(function () {

        addMessage(response, "bot");

    }, 500);

}


/* =========================================
   FAKE SECURITY SCAN
========================================= */

function securityScan() {

    addMessage(
        "🔍 Scan Site",
        "user"
    );


    setTimeout(function () {

        addMessage(`
            🔍 <strong>POB SECURITY SCANNER</strong>

            <br><br>

            Initializing scan...

            <br>

            [████░░░░░░] 40%

            <br>

            Checking HTML...

            <br>

            [███████░░░] 70%

            <br>

            Checking CSS...

            <br>

            [██████████] 100%

            <br><br>

            🟢 HTML: CLEAN

            <br>

            🟢 CSS: CLEAN

            <br>

            🟢 JavaScript: SUSPICIOUSLY FUN

            <br><br>

            <strong>
            No threats detected.

            Probably. 😂
            </strong>
        `, "bot");

    }, 700);

}


/* =========================================
   FAKE HONEYPOT ATTACK
========================================= */

function simulateAttack() {

    addMessage(
        "🐝 Attack Honeypot",
        "user"
    );


    setTimeout(function () {

        addMessage(`
            🐝 <strong>HONEYPOT ATTACK SIMULATION</strong>

            <br><br>

            Attacker detected...

            <br>

            IP: 127.0.0.1

            <br>

            Threat level: 🤨

            <br><br>

            Deploying countermeasures...

            <br>

            ██████████ 100%

            <br><br>

            🚨 ATTACKER CAUGHT

            <br><br>

            Wait...

            <br>

            It's you. 😂

            <br><br>

            <strong>
            Honeypot successfully defended itself.
            </strong>
        `, "bot");

    }, 900);

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
