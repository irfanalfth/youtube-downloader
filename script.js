document
  .getElementById("byNumber")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const button = document.getElementById("prosesButton");
    const youtubeLink = document.getElementById("youtubeLink").value;

    document.getElementById("detailVideo").style.display = "hidden";

    button.disabled = true;
    button.textContent = "Tunggu";

    fetch("https://master-cdn.dl-api.com/api/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Origin: "https://y2meta.mobi",
        Referer: "https://y2meta.mobi/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        ftype: "mp4",
        url: youtubeLink,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const result = data;
        const jwt = result.jwt;
        const hash = result.tasks[0].hash;

        return fetch("https://master-cdn.dl-api.com/api/json", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Origin: "https://y2meta.mobi",
            Referer: "https://y2meta.mobi/",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          },
          body: JSON.stringify({
            jwt: jwt,
            hash: hash,
          }),
        });
      })
      .then((response) => response.json())
      .then((secondData) => {
        const result = secondData;
        const taskId = result.taskId;

        const poll = setInterval(() => {
          fetch("https://master-cdn.dl-api.com/api/json/task", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Origin: "https://y2meta.mobi",
              Referer: "https://y2meta.mobi/",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            },
            body: JSON.stringify({
              taskId: taskId,
            }),
          })
            .then((response) => response.json())
            .then((thirdData) => {
              const downloadProgress = thirdData.download_progress || 0;
              button.textContent = `Memuat ${Math.round(downloadProgress)}%`;

              if (downloadProgress === 100) {
                document.getElementById("detailVideo").style.display = "block";

                document.getElementById("titleVideo").textContent =
                  thirdData.title || "Title not found";
                document.getElementById("downloadVideo").href =
                  thirdData.download || "#";
                document.getElementById("qualityVideo").textContent =
                  thirdData.quality || "Quality not found";
                document.getElementById("sizeVideo").textContent =
                  thirdData.filesize || "Size not found";
                document.getElementById(
                  "imgVideo"
                ).src = `https://i.ytimg.com/vi/${thirdData.videoId}/mqdefault.jpg`;

                clearInterval(poll);
                button.disabled = false;
                button.textContent = "Proses";
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              clearInterval(poll);
              button.disabled = false;
              button.textContent = "Proses";
            });
        }, 5000);
      })
      .catch((error) => {
        console.error("Error:", error);
        button.disabled = false;
        button.textContent = "Proses";
      });
  });
