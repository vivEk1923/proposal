document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const proposalScreen = document.getElementById('proposal-screen');
    const loveRevealScreen = document.getElementById('love-reveal-screen');
    const shayariText = document.getElementById('shayari-text');
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    bgMusic.volume = 0.3; // Set volume to 30%

    // --- Audio Handling & Start Screen ---
    const startScreen = document.getElementById('start-screen');
    let isPlaying = false;

    // Function to play music
    function playMusic() {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicBtn.textContent = '🔇';
        }).catch(e => {
            console.log("Audio play failed (waiting for interaction):", e);
            isPlaying = false;
            musicBtn.textContent = '🎵';
        });
    }

    // 1. Explicit Start Screen Interaction
    if (startScreen) {
        startScreen.addEventListener('click', () => {
            playMusic();

            // Hide Overlay
            startScreen.style.opacity = '0';
            setTimeout(() => {
                startScreen.classList.add('hidden');
                startScreen.remove(); // Remove from DOM entirely
            }, 1000);
        });
    }

    // 2. Music Toggle Button
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.textContent = '🎵';
            isPlaying = false;
        } else {
            playMusic();
        }
    });

    // 3. Fallback: Try to play on ANY body click if not playing
    document.body.addEventListener('click', () => {
        if (!isPlaying && !startScreen) { // Only if start screen is gone
            playMusic();
        }
    }, { once: true });

    // "NO" Button Interaction
    const noMessages = [
        "Are you sure? 🥺",
        "It will break my heart 💔",
        "Think again... 😔",
        "Last chance 😢",
        "Please? 🎀",
        "You can't do this! 😭",
        "I'll be so sad... 😿"
    ];

    let messageIndex = 0;
    let yesScale = 1;

    noBtn.addEventListener('click', () => {
        // Play NO sound
        document.getElementById('no-sound').play();

        // 1. Change Text
        noBtn.textContent = noMessages[messageIndex];
        messageIndex = (messageIndex + 1) % noMessages.length;

        // 2. Increase YES button size
        yesScale += 0.2;
        yesBtn.style.transform = `scale(${yesScale})`;

        // 3. Move NO button randomly (small shifts)
        const maxShift = 50;
        const randomX = Math.random() * maxShift - (maxShift / 2);
        const randomY = Math.random() * maxShift - (maxShift / 2);
        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

        // Make Yes button redder
        yesBtn.style.backgroundColor = `hsl(${340 - yesScale * 10}, 100%, 60%)`;
    });

    // "YES" Button Interaction
    yesBtn.addEventListener('click', () => {
        // Play YES sound
        document.getElementById('yes-sound').play();

        // Transition to Love Reveal Screen
        proposalScreen.style.opacity = '0';

        setTimeout(() => {
            proposalScreen.classList.add('hidden');
            loveRevealScreen.classList.remove('hidden');
            loveRevealScreen.style.opacity = '1';

            // Start Typewriter Effect
            typeWriterEffect();

            // Start Background Hearts
            createFloatingHearts();

            // Start Slideshow
            startSlideshow();
        }, 1000); // Wait for fade out
    });

    // Slideshow Logic
    function startSlideshow() {
        const photos = [
            "couple2.jpeg", // Start with this one
            "couple.jpeg",
            "couple1.jpeg"
        ];
        let photoIndex = 0;
        const photoElement = document.getElementById('couple-photo');

        setInterval(() => {
            photoIndex = (photoIndex + 1) % photos.length;

            // Fade out
            photoElement.style.opacity = 0;

            setTimeout(() => {
                // Change source and fade in
                photoElement.src = photos[photoIndex];
                photoElement.style.opacity = 1;
            }, 500); // Wait for fade out transition

        }, 3000); // Change every 3 seconds
    }

    // Typewriter Effect
    const shayari = "You are my sun, my moon,\nand all my stars. ✨";
    let charIndex = 0;

    function typeWriterEffect() {
        if (charIndex < shayari.length) {
            const currentChar = shayari.charAt(charIndex);
            if (currentChar === '\n') {
                shayariText.innerHTML += '<br>';
            } else {
                shayariText.innerHTML += currentChar;
            }
            charIndex++;
            setTimeout(typeWriterEffect, 100); // Typing speed
        }
    }

    // Floating Hearts Animation
    function createFloatingHearts() {
        setInterval(() => {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.innerHTML = '❤️'; // Or use an SVG/Image

            // Random Position & Size
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.animationDuration = Math.random() * 3 + 2 + 's';
            heart.style.fontSize = Math.random() * 20 + 10 + 'px';

            document.querySelector('.background-animation').appendChild(heart);

            // Cleanup
            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, 300);
    }
});
