document.addEventListener("DOMContentLoaded", () => {

    const sourceText = document.querySelector(".source-text");

    if (sourceText) {
        sourceText.innerHTML = "Your new content here!";
    } else {
        console.error("Element with class 'source-text' not found");
    }

    const video = document.getElementById("myVideo");
    const pauseBtn = document.querySelector(".Pause");

    const overlay1 = document.getElementById("overlay1");
    const overlay2 = document.getElementById("overlay2");

    const shape1 = document.getElementById("shape1");
    const shape2 = document.getElementById("shape2");

    const detail1 = document.getElementById("detail1");
    const detail2 = document.getElementById("detail2");

    const confirm1 = document.getElementById("confirm1");
    const confirm2 = document.getElementById("confirm2");

    const retryBtn = document.querySelector(".retry-btn");
    
    // New Element References
    const goodReplayBtn = document.querySelector(".good-replay-btn");
    const overlayReplayBtns = document.querySelectorAll(".overlay-replay-btn");
    const sfxCorrect = document.getElementById("sfx-correct");
    const sfxWrong = document.getElementById("sfx-wrong");

    const playIcon = document.querySelector(".playicon");
    const sourceBar = document.querySelector(".source-bar");

    const triggers = document.querySelectorAll(".choice-trigger");
    const branchTriggers = document.querySelectorAll(".branch-trigger");

    let pendingVideo = "";
    let activeChoice = "";

    // ===================================================
    // CONDITIONAL LOCKOUT STATE CHECKS
    // ===================================================
    // Returns true if ANY option select UI or detail screen is currently open
    function isSelectionActive() {
        return overlay1.classList.contains("show-overlay") || 
               overlay2.classList.contains("show-overlay") ||
               detail1.classList.contains("show-detail") ||
               detail2.classList.contains("show-detail") ||
               retryBtn.classList.contains("show-retry") ||
               goodReplayBtn.classList.contains("show-retry");
    }

    // =========================
    // PLAY / PAUSE FUNCTION
    // =========================

    function toggleVideo() {
        // Prevent playing or pausing by tapping screen/button during selection states
        if (isSelectionActive()) return;

        if (video.paused) {
            video.play();
            playIcon.src = "svg button/noun-pause-button-6124856.svg";
        } else {
            video.pause();
            playIcon.src = "svg button/noun-play-button-6124838.svg";
        }
    }

    pauseBtn.addEventListener("click", toggleVideo);
    video.addEventListener("click", toggleVideo);

    // Sync button interface icon if video state is altered directly by browser native overlays
    video.addEventListener("pause", () => {
        playIcon.src = "svg button/noun-play-button-6124838.svg";
    });

    video.addEventListener("play", () => {
        if (isSelectionActive()) {
            video.pause();
            return;
        }
        playIcon.src = "svg button/noun-pause-button-6124856.svg";
    });

    // =========================
    // SFX HELPER FUNCTION
    // =========================
    function triggerSFX(verdictText) {
        if (verdictText === "BETUL!") {
            sfxCorrect.currentTime = 0;
            sfxCorrect.play().catch(e => console.log("SFX play prevented:", e));
        } else if (verdictText === "SALAH!") {
            sfxWrong.currentTime = 0;
            sfxWrong.play().catch(e => console.log("SFX play prevented:", e));
        }
    }

    // =========================
    // DETAIL PANEL HELPER
    // =========================

    function fillDetail(panel, trigger) {

        panel.querySelector(".detail-text").textContent =
            trigger.dataset.text;

        const verdict =
            panel.querySelector(".detail-verdict");

        verdict.textContent =
            trigger.dataset.verdict;

        verdict.className =
            "detail-verdict " +
            trigger.dataset.verdictColor;

        panel.querySelector(".detail-img1").src =
            trigger.dataset.explain1;

        panel.querySelector(".detail-img2").src =
            trigger.dataset.explain2;
            
        // Fire SFX based on data-verdict string
        triggerSFX(trigger.dataset.verdict);
    }

    // =========================
    // HOVER IMAGE SWAP
    // =========================

    function addHover(triggerList) {

        triggerList.forEach(trigger => {

            const img =
                trigger.querySelector("img");

            trigger.addEventListener("mouseenter", () => {

                img.src =
                    trigger.dataset.hover;
            });

            trigger.addEventListener("mouseleave", () => {

                img.src =
                    trigger.dataset.idle;
            });
        });
    }

    addHover(triggers);
    addHover(branchTriggers);

    // =========================
    // VIDEO END EVENTS
    // =========================

    video.addEventListener("ended", () => {

        video.pause();
        playIcon.src = "svg button/noun-play-button-6124838.svg";

        if (activeChoice === "") {
            // first ending selection screen
            overlay1.classList.add("show-overlay");

        } else if (activeChoice === "choice2") {
            // branch point selection screen
            overlay2.classList.add("show-overlay");

        } else if (activeChoice === "choice4") {
            // bad ending reached
            overlay2.style.display = "none";
            retryBtn.classList.add("show-retry");
            
        } else if (activeChoice === "choice1" || activeChoice === "choice3") {
            // Good endings reached! Show the Good Replay button
            goodReplayBtn.classList.add("show-retry");
        }
    });

    // =========================
    // FIRST CHOICE BUTTONS
    // =========================

    triggers.forEach(trigger => {

        trigger.addEventListener("click", (e) => {

            e.preventDefault();

            pendingVideo =
                trigger.dataset.video;

            activeChoice =
                trigger.dataset.choice;

            fillDetail(detail1, trigger);

            sourceText.innerHTML =
                trigger.dataset.source;

            sourceBar.classList.add("show-source");

            shape1.classList.add("show-shape");

            detail1.classList.add("show-detail");
        });
    });

    // =========================
    // FIRST CONFIRM BUTTON
    // =========================

    confirm1.addEventListener("click", () => {

        detail1.classList.remove("show-detail");
        overlay1.classList.remove("show-overlay");
        shape1.classList.remove("show-shape");
        sourceBar.classList.remove("show-source");

        video.src = pendingVideo;
        video.load();
        video.play().catch(err => {
            console.error("video play failed:", err);
        });
    });

    // =========================
    // SECOND CHOICE BUTTONS
    // =========================

    branchTriggers.forEach(trigger => {

        trigger.addEventListener("click", (e) => {

            e.preventDefault();

            pendingVideo =
                trigger.dataset.video;

            activeChoice =
                trigger.dataset.choice;

            fillDetail(detail2, trigger);

            sourceText.innerHTML =
                trigger.dataset.source;

            sourceBar.classList.add("show-source");

            shape2.classList.add("show-shape");

            detail2.classList.add("show-detail");
        });
    });

    // =========================
    // SECOND CONFIRM BUTTON
    // =========================

    confirm2.addEventListener("click", () => {

        detail2.classList.remove("show-detail");
        overlay2.classList.remove("show-overlay");
        shape2.classList.remove("show-shape");
        sourceBar.classList.remove("show-source");

        video.src = pendingVideo;
        video.load();
        video.play().catch(err => {
            console.error("video play failed:", err);
        });
    });

    // ===================================================
    // UNIFIED FULL GAME RESET SYSTEM (For Selection Screen & Good Endings)
    // ===================================================
    function resetToGlobalStart() {
        // Clear all active tracking variables
        activeChoice = "";
        pendingVideo = "";

        // Hide all custom dynamic scene UI objects
        overlay1.classList.remove("show-overlay");
        overlay2.classList.remove("show-overlay");
        detail1.classList.remove("show-detail");
        detail2.classList.remove("show-detail");
        shape1.classList.remove("show-shape");
        shape2.classList.remove("show-shape");
        sourceBar.classList.remove("show-source");
        retryBtn.classList.remove("show-retry");
        goodReplayBtn.classList.remove("show-retry");
        
        overlay2.style.display = "";

        // Restore base interactive state configuration back to introduction sequence
        video.src = "render/Story 3 General Scenario.mp4";
        video.load();
        playIcon.src = "svg button/noun-play-button-6124838.svg";
    }

    // Attach full game reset listener triggers to Selection screen buttons and Good Ending screen buttons
    goodReplayBtn.addEventListener("click", resetToGlobalStart);
    overlayReplayBtns.forEach(btn => {
        btn.addEventListener("click", resetToGlobalStart);
    });

    // =========================
    // ORIGINAL RETRY BUTTON (Handles Branch Backtracking for Choice 4 Only)
    // =========================

    retryBtn.addEventListener("click", (e) => {

        if (
            !e.target.closest("img") &&
            !e.target.closest("span")
        ) return;

        retryBtn.classList.remove("show-retry");
        overlay2.style.display = "";
        activeChoice = "choice2";

        video.src = "render/Story 3 Branch.mp4";
        video.load();

        video.addEventListener(
            "canplay",
            function seekToEnd() {

                video.currentTime =
                    video.duration - 0.1;

                video.pause();

                video.removeEventListener(
                    "canplay",
                    seekToEnd
                );

                overlay2.classList.add("show-overlay");
            }
        );
    });

});