document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("myVideo");
    const pauseBtn = document.querySelector(".Pause");
    const overlay = document.querySelector(".ending-overlay");
    const triggers = document.querySelectorAll(".choice-trigger");
    const shape = document.querySelector(".overlay-shape");
    const detailPanel = document.querySelector(".detail-panel");
    const detailText = document.querySelector(".detail-text");
    const detailConfirm = document.querySelector(".detail-confirm");
    const retryBtn = document.querySelector(".retry-btn");
    const goodEndBtn = document.getElementById("goodEndBtn");
    const replayOnChoice = document.getElementById("replayOnChoice");
    const playIcon = document.querySelector(".playicon");
    const sourceBar = document.querySelector(".source-bar");
    const sourceText = document.querySelector(".source-text");
    const playIndicator = document.getElementById("playIndicator");
    const sfxCorrect = document.getElementById("sfxCorrect");
    const sfxWrong = document.getElementById("sfxWrong");

    let pendingVideo = "";
    let activeChoice = "";
    let indicatorTimeout = null;
    let onSelectionScreen = false;

    function showPlayIndicator() {
        playIndicator.classList.add("visible");
        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            playIndicator.classList.remove("visible");
        }, 600);
    }

    function toggleVideo() {
        // block play/pause when on selection screen
        if (onSelectionScreen) return;

        if (video.paused) {
            video.play();
            playIcon.src = "svg button/noun-pause-button-6124856.svg";
        } else {
            video.pause();
            playIcon.src = "svg button/noun-play-button-6124838.svg";
            showPlayIndicator();
        }
    }

    pauseBtn.addEventListener("click", toggleVideo);
    video.addEventListener("click", toggleVideo);

    video.addEventListener("ended", () => {
        video.pause();
        playIcon.src = "svg button/noun-play-button-6124838.svg";

        if (activeChoice === "choice2") {
            // bad ending
            overlay.style.display = "none";
            retryBtn.classList.add("show-retry");
            onSelectionScreen = false;
        } else if (activeChoice === "choice1") {
            // good ending
            goodEndBtn.classList.add("show-good-end");
            onSelectionScreen = false;
        } else if (activeChoice === "") {
            // main video ended, show choices
            overlay.classList.add("show-overlay");
            onSelectionScreen = true;
        }
    });

    // replay from choice selection screen
    replayOnChoice.addEventListener("click", () => {
        overlay.classList.remove("show-overlay");
        shape.classList.remove("show-shape");
        onSelectionScreen = false;
        activeChoice = "";

        video.src = "render2/Story 1 General Scenario.mp4";
        video.load();
        video.play().then(() => {
            playIcon.src = "svg button/noun-pause-button-6124856.svg";
        }).catch(err => console.error(err));
    });

    triggers.forEach(trigger => {
        const img = trigger.querySelector("img");

        trigger.addEventListener("mouseenter", () => { img.src = trigger.dataset.hover; });
        trigger.addEventListener("mouseleave", () => { img.src = trigger.dataset.idle; });

        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            pendingVideo = trigger.dataset.video;
            activeChoice = trigger.dataset.choice;

            if (trigger.dataset.verdictColor === "green") {
                sfxCorrect.currentTime = 0;
                sfxCorrect.play().catch(() => {});
            } else {
                sfxWrong.currentTime = 0;
                sfxWrong.play().catch(() => {});
            }

            detailText.textContent = trigger.dataset.text;

            const verdict = detailPanel.querySelector(".detail-verdict");
            verdict.textContent = trigger.dataset.verdict;
            verdict.className = "detail-verdict " + trigger.dataset.verdictColor;

            detailPanel.querySelector(".detail-img1").src = trigger.dataset.explain1;
            detailPanel.querySelector(".detail-img2").src = trigger.dataset.explain2;

            sourceText.innerHTML = trigger.dataset.source;
            sourceBar.classList.add("show-source");

            shape.classList.add("show-shape");
            detailPanel.classList.add("show-detail");
        });
    });

    detailConfirm.addEventListener("click", () => {
        detailPanel.classList.remove("show-detail");
        overlay.classList.remove("show-overlay");
        shape.classList.remove("show-shape");
        sourceBar.classList.remove("show-source");
        onSelectionScreen = false;

        video.src = pendingVideo;
        video.load();

        video.play().then(() => {
            playIcon.src = "svg button/noun-pause-button-6124856.svg";
        }).catch((err) => {
            console.error("video play failed:", err);
        });
    });

    // bad ending retry
    retryBtn.addEventListener("click", (e) => {
        if (!e.target.closest("img") && !e.target.closest("span")) return;

        retryBtn.classList.remove("show-retry");
        overlay.style.display = "";
        activeChoice = "";

        video.src = "render2/Story 1 General Scenario.mp4";
        video.load();

        video.addEventListener("canplay", function seekToEnd() {
            video.currentTime = video.duration - 0.1;
            video.pause();
            video.removeEventListener("canplay", seekToEnd);
            overlay.classList.add("show-overlay");
            onSelectionScreen = true;
        });
    });

    // good ending replay — replays from beginning
    goodEndBtn.addEventListener("click", (e) => {
        if (!e.target.closest("img") && !e.target.closest("span")) return;

        goodEndBtn.classList.remove("show-good-end");
        activeChoice = "";

        video.src = "render2/Story 1 General Scenario.mp4";
        video.load();

        video.play().then(() => {
            playIcon.src = "svg button/noun-pause-button-6124856.svg";
        }).catch(err => console.error(err));
    });

});