async function fetchTime() {
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", async function (event) {
      event.preventDefault();

      let selectedLocation = this.getAttribute("data-location");
      try {
        document.getElementById("today").innerHTML += "";
        const response = await fetch(
          `https://third-of-the-night.vercel.app/?location=${selectedLocation}`
        );
        const data = await response.json();

        const tableBody = document.getElementById("prayerTableBody");
        tableBody.innerHTML = data.prayTime.prayerTimes
          .map(
            (pt) => ` <tr>
                <td>${pt.prayer}</td>
                <td>${pt.time}</td>
            </tr>`
          )
          .join("");

        document.getElementById("night").innerHTML = data.prayTime.secondNight;
        document.getElementById("night2").innerHTML = data.prayTime.thirdNight;
        let todayElement = document.getElementById("today");
        if (!todayElement.innerHTML.includes(data.prayTime.dateText)) {
          todayElement.innerHTML += data.prayTime.dateText;
        }
      } catch (error) {
        console.error("Error fetching times:", error);
      }
    });
  });
}

fetchTime();
