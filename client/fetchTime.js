async function fetchTime() {
  try {
    const response = await fetch("https://third-of-the-night.vercel.app/");
    const data = await response.json();

    document.getElementById("night").innerHTML = data.prayTime.secondNight;
    document.getElementById("night2").innerHTML = data.prayTime.thirdNight;
  } catch (error) {
    console.error("Error fetching times:", error);
  }
}

fetchTime();
