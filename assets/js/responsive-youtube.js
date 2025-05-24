function createYouTubeAudioPlayer(containerId, iconMarginTop) {
    const container = document.getElementById(containerId);

    const icon = document.createElement("img");
    icon.id = "youtube-icon";
    icon.style.cssText = `
        cursor: pointer;
        height: 60px;
        margin-left: auto;
        margin-right: auto;
        margin-top: ${iconMarginTop}px;
    `;
    container.appendChild(icon);

    const playerDiv = document.createElement("div");
    playerDiv.id = "youtube-player";
    container.appendChild(playerDiv);

    function updateIcon(isPlaying) {
        const iconSrc = isPlaying ? "pause.png" : "play.png";
        icon.setAttribute("src", "/" + iconSrc);
    }

    container.onclick = function () {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
            player.pauseVideo();
            updateIcon(false);
        } else {
            player.playVideo();
            updateIcon(true);
        }
    };

    const player = new YT.Player("youtube-player", {
        height: "0",
        width: "0",
        videoId: container.dataset.video,
        playerVars: {
            autoplay: container.dataset.autoplay,
            loop: container.dataset.loop,
        },
        events: {
            onReady: function () {
                player.setPlaybackQuality("small");
                updateIcon(player.getPlayerState() !== YT.PlayerState.CUED);
            },
            onStateChange: function (e) {
                if (e.data === YT.PlayerState.ENDED) {
                    updateIcon(false);
                }
            }
        }
    });
}

// Media breakpoint logic
const mediaBreakpointSize = 600;
window.onYouTubeIframeAPIReady = function () {
    if (document.documentElement.clientWidth < mediaBreakpointSize) {
        createYouTubeAudioPlayer("youtube-audio1", 10);
    } else {
        createYouTubeAudioPlayer("youtube-audio2", 20);
    }
};

console.log("Responsive YouTube audio script loaded.");

