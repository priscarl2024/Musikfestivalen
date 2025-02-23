const containerLineUp = document.querySelector(".container-lineUp");

const baseUrl = "https://cdn.contentful.com/spaces/";
const apiURL = `${baseUrl}r4n29c9w5edo/entries?access_token=HOUWZG6vybQ5Hwy7bA-YtTeNZ6bK_FoSlS9VG0eUv0w&content_type=artist`;

let lineUpInfo = [];

const populateFilters = (filterId, options) => {
  const filterElement = document.getElementById(filterId);

  options.forEach((option) => {
    const optElement = document.createElement("option");
    optElement.value = option.toLowerCase();
    optElement.textContent = option;
    filterElement.appendChild(optElement);
  });
};

const fetchData = async () => {
  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("HTTP-fel! Något gick snett i förfrågan.");
    }

    const data = await response.json();

    lineUpInfo = data.items.map((show) => {
      const dayId = show.fields.day.sys.id;
      const day = data.includes.Entry.find((entry) => entry.sys.id === dayId);
      const stageId = show.fields.stage.sys.id;
      const stage = data.includes.Entry.find(
        (entry) => entry.sys.id === stageId
      );
      const genreId = show.fields.genre.sys.id;
      const genre = data.includes.Entry.find(
        (entry) => entry.sys.id === genreId
      );

      return {
        artist: show.fields.name,
        artistInfo: show.fields.description,
        day: day.fields.description,
        date: day.fields.date,
        stage: stage.fields.name,
        stageInfo: stage.fields.description,
        genre: genre.fields.name,
      };
    });

    const uniqueDays = [...new Set(lineUpInfo.map((show) => show.day))];
    const uniqueStages = [...new Set(lineUpInfo.map((show) => show.stage))];
    const uniqueGenres = [...new Set(lineUpInfo.map((show) => show.genre))];

    populateFilters("dayFilter", uniqueDays);
    populateFilters("stageFilter", uniqueStages);
    populateFilters("genreFilter", uniqueGenres);

    renderLineUp(lineUpInfo);

    applyFilters(lineUpInfo);

    renderLineUp(lineUpInfo);
  } catch (error) {
    containerLineUp.innerHTML = `<p>Hoppsan! Något gick snett, det går inte att hämta data</p>`;
  }
};

const renderLineUp = (data) => {
  const lineUp = data.map((show) => {
    return `<div class="lineUp" data-day="${show.day}" data-stage="${show.stage}" data-genre="${show.genre}">
              <div class="artist-name"> 
                  <h2>${show.artist}</h2>
              </div>
              <div class="artist-info">
                <div class="artist-details">
                  <p>${show.day}</p>
                  <p>${show.stage}</p>
                  <p>${show.genre}</p>  
                </div>
                <p>${show.artistInfo}</p>
              </div>
            </div>`;
  });
  containerLineUp.innerHTML = lineUp.join("");
};

const applyFilters = (lineUpInfo) => {
  const dayFilter = document.getElementById("dayFilter");
  const stageFilter = document.getElementById("stageFilter");
  const genreFilter = document.getElementById("genreFilter");

  const filterLineUp = () => {
    const selectedDay = dayFilter.value;
    const selectedStage = stageFilter.value;
    const selectedGenre = genreFilter.value;

    const filteredLineUp = lineUpInfo.filter((show) => {
      return (
        (selectedDay === "all" || show.day.toLowerCase() === selectedDay) &&
        (selectedStage === "all" ||
          show.stage.toLowerCase() === selectedStage) &&
        (selectedGenre === "all" || show.genre.toLowerCase() === selectedGenre)
      );
    });

    renderLineUp(filteredLineUp);
  };

  dayFilter.addEventListener("change", filterLineUp);
  stageFilter.addEventListener("change", filterLineUp);
  genreFilter.addEventListener("change", filterLineUp);
};

fetchData();
