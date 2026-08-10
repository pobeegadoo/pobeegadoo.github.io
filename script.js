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
