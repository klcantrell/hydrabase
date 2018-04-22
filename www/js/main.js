function html(literals, ...customs) {
  let result = "";
  customs.forEach((custom, i) => {
    const lit = literals[i];
    if (Array.isArray(custom)) {
      custom = custom.join("");
    }
    result += lit;
    result += custom;
  });
  result += literals[literals.length - 1];
  return result;
}

function delay(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

function hydrantInfoTemplate(hydrantData) {
  return html`
    <div class="hydrant-info">
      <div class="info-header"><span><i class="fa fa-check-square-o" aria-hidden="true"></i></span> Status</div>
        <div class="hydrant-info__head">                    
          <img class="hydrant-info__img" src="${hydrantData.img}" alt="">
          <div class="hydrant-info__data">
            <ul class="hydrant-info__list">
              <li><span class="title">Hydrant ID:</span> ${
                hydrantData.hydrant_id
              }</li>
              <li><span class="title">Top Color:</span> ${
                hydrantData.top_color
              }</li>
              <li><span class="title">Body Color:</span> ${
                hydrantData.body_color
              }</li>
              <li><span class="title">Type:</span> ${hydrantData.type}</li>
              <li><span class="title">Hose Size:</span> ${
                hydrantData.hose_size
              }</li>
              <li><span class="title">Storz:</span> ${hydrantData.storz}</li>
              <li><span class="title">Thread Type:</span> ${
                hydrantData.thread_type
              }</li>
            </ul>
          </div>
        </div>
        <div class="hydrant-info__btns">
          <button class="hydrant-info__edit-btn hydrant-info__btn"><i class="fa fa-edit"></i> Edit</button>
          <button class="hydrant-info__report-btn hydrant-info__btn">Report Problem</button>
        </div>
    </div>
  `;
}

let activeInfoWindow = null;

function initMap() {
  const mapEl = document.getElementById("map-canvas");
  const problemView = document.querySelector(".problemPage");
  const addHydrantBtn = document.querySelector(".add-hydrant");
  const addHydrantForm = document.querySelector(".add-hydrant-content");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      var lat = position.coords.latitude;
      var lang = position.coords.longitude;
      var myLatlng = new google.maps.LatLng(lat, lang);
      var fishersLatLong = new google.maps.LatLng(39.978075, -85.983247);
      var mapOptions = { zoom: 13.3, center: fishersLatLong };
      var map = new google.maps.Map(mapEl, mapOptions);
      var marker = new google.maps.Marker({ position: myLatlng, map: map });
      var searchInput = document.getElementById("searchInput");
      var searchBox = new google.maps.places.SearchBox(searchInput);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

      var hydrants = placeHydrants(map);

      bindEvents();
    },
    onError,
    { timeout: 30000 }
  );

  function onError(error) {
    alert("code: " + error.code + "\n" + "message: " + error.message + "\n");
  }

  function handleReportBtnClick() {
    mapEl.addEventListener("click", e => {
      if (e.target.classList.contains("hydrant-info__report-btn")) {
        problemView.classList.remove("el--hidden");
      }
    });
  }

  function handleProblemViewCloseClick() {
    problemView.addEventListener("click", e => {
      if (e.target.classList.contains("closebtn")) {
        problemView.classList.add("el--hidden");
      }
    });
  }

  function handleAddHydrantClick() {
    addHydrantBtn.addEventListener("click", e => {
      addHydrantForm.classList.add("fadeIn");
      addHydrantForm.classList.remove("el--hidden", "fadeOut");
    });
  }

  function handleHydrantFormCloseClick() {
    addHydrantForm.addEventListener("click", e => {
      if (e.target.classList.contains("closebtn")) {
        addHydrantForm.classList.add("fadeOut");
        delay(800).then(() => {
          addHydrantForm.classList.remove("fadeIn");
          addHydrantForm.classList.add("el--hidden");
        });
      }
    });
  }

  function bindEvents() {
    handleReportBtnClick();
    handleProblemViewCloseClick();
    handleAddHydrantClick();
    handleHydrantFormCloseClick();
  }
}

function placeHydrants(map) {
  return fireData.map((hydrant, i) => {
    var image = {
      url: "img/hydrant.png",
      scaledSize: new google.maps.Size(34, 34)
    };
    var position = new google.maps.LatLng(hydrant.lat, hydrant.lon);

    // create the custom hydrant marker
    var hydrantMarker = new google.maps.Marker({
      position,
      icon: image,
      map,
      title: `Hydrant ${hydrant.hydrant_id}`
    });

    // attach the info popup to the hydrant marker
    const infowindow = new google.maps.InfoWindow({
      content: hydrantInfoTemplate(hydrant),
      maxWidth: 400
    });

    // close previous hydrant when opening a new one
    hydrantMarker.addListener("click", function() {
      activeInfoWindow && activeInfoWindow.close();
      infowindow.open(map, hydrantMarker);
      activeInfoWindow = infowindow;
    });
  });
}
