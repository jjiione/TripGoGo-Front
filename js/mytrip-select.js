var mapContainer = document.getElementById("map"), // 지도를 표시할 div
  mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 아래 코드는 지도 위의 마커를 제거하는 코드입니다
// marker.setMap(null);

var spotX;
var spotY;

function searchSpot(event) {
  const code = event.code;
  if (code == "Enter") {
    let serviceKey = "4d808b2eea3ad1fde7f7c7e442ca91fc";
    let searchUrl =
      "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=";
    let keyword = document.getElementById("select-spot").value;
    if (!keyword) {
      alert("검색어 입력 필수!!");
      return;
    } else {
      searchUrl += `${keyword}`;
      console.log(searchUrl);
    }
    fetch(searchUrl, {
      method: "GET",
      headers: {
        Authorization: "KakaoAK " + serviceKey,
      },
    })
      .then((response) => response.json())
      .then((data) => makeList(data));
  }
}

function makeList(data) {
  console.log(data);
  let trips = data.documents;
  console.log(trips);
  let tripList = ``;
  document.getElementById("trip-select-list").innerHTML = ``;
  trips.forEach((area) => {
    let item = document.createElement("div");
    item.setAttribute("class", "trip-select-item");
    let content = document.createElement("div");
    content.setAttribute("class", "trip-select-content");
    let title = document.createElement("span");
    title.setAttribute("class", "title");
    title.appendChild(document.createTextNode(area.place_name));
    let info = document.createElement("div");
    info.setAttribute("class", "trip-select-info");
    let date = document.createElement("span");
    date.setAttribute("class", "date");
    date.appendChild(document.createTextNode(area.category_group_name));
    info.appendChild(date);
    content.appendChild(title);
    content.appendChild(info);
    item.appendChild(content);
    document.getElementById("trip-select-list").appendChild(item);
    console.log(item);
    item.addEventListener("click", function () {
      spotX = area.x;
      spotY = area.y;
      document.getElementById("select-spot").value = area.place_name;
      document.getElementById("trip-select-list").innerHTML = ``;
      makeMarker();
    });
  });
}

function makeMarker() {
  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(spotY, spotX);
  var moveLatLon = new kakao.maps.LatLng(spotY, spotX);
  // 마커를 생성합니다
  var marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  map.setCenter(moveLatLon);
  marker.setMap(map);
}
