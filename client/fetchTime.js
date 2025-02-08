async function fetchTime() {
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", async function (event) {
      event.preventDefault();

      let selectedLocation = this.getAttribute("data-location");
      try {
        document.getElementById("today").innerHTML += "";
        const response = await fetch(
          `https://third-of-the-night.vercel.app/
?location=${selectedLocation}`
        );
        const data = await response.json();

        document.getElementById("night").innerHTML = data.prayTime.secondNight;
        document.getElementById("night2").innerHTML = data.prayTime.thirdNight;
        let todayElement = document.getElementById("today");
        if (!todayElement.innerHTML.includes(data.prayTime.today)) {
          todayElement.innerHTML += data.prayTime.today; // Append with a line break
        }
      } catch (error) {
        console.error("Error fetching times:", error);
      }
    });
  });
}

fetchTime();
