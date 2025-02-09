async function fetchTime() {

  const translationMap = {
    "Fajr": "الفجر",
    "Sunrise": "الشروق",
    "Dhuhr": "الظهر",
    "Asr": "العصر",
    "Maghrib": "المغرب",
    "Isha": "العشاء"
};

let currentLang = document.documentElement.lang === "ar" ? "ar" : "en";

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
          .map((pt) =>{ 
            let prayerName = currentLang === "ar" ? translationMap[pt.prayer] || pt.prayer : pt.prayer;

            return` <tr>
                <td>${prayerName}</td>
                <td>${pt.time}</td>
            </tr>`}
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
