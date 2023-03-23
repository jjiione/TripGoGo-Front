// 검색 버튼을 누르면
// 지역, 유형, 검색어 얻기
// 위 데이터를 가지고 공공데이터에 요청
// 받은 데이터를 이용하여 화면 구성

var departureX;
var departureY;
var arrivalX;
var arrivalY;

document.getElementById("btn-search-departures").addEventListener("click", function () {
  //index page 로딩 후 전국의 시도 설정
  let serviceKey = "4d808b2eea3ad1fde7f7c7e442ca91fc";
  let searchUrl =
    "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=";
  let keyword = document.getElementById("search-departures").value;
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
    .then((data) => makeList(data, "departures-list", "search-departures"));
});

document.getElementById("btn-search-arrivals").addEventListener("click", function () {
  //index page 로딩 후 전국의 시도 설정
  let serviceKey = "4d808b2eea3ad1fde7f7c7e442ca91fc";
  let searchUrl =
    "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=";
  let keyword = document.getElementById("search-arrivals").value;
  if (!keyword) {
    alert("검색어 입력 필수!!");
    return;
  } else {
    searchUrl += `${keyword}`;
  }

  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: "KakaoAK " + serviceKey,
    },
  })
    .then((response) => response.json())
    .then((data) => makeList(data, "arrivals-list", "search-arrivals"));
});

function makeList(data, idname, inputname) {
  console.log(data);
  let trips = data.documents;
  console.log(trips);
  let tripList = ``;
  document.getElementById(idname).innerHTML = ``;
  trips.forEach((area) => {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn-select");
    button.setAttribute(
      "style",
      "width:100%; font-weight:bold; color:white; background-color:transparent"
    );
    button.appendChild(document.createTextNode(area.place_name));
    document.getElementById(idname).appendChild(button);

    button.addEventListener("click", function () {
      if (idname == "departures-list") {
        departureX = area.x;
        departureY = area.y;
      } else {
        arrivalX = area.x;
        arrivalY = area.y;
      }
      document.getElementById(inputname).value = area.place_name;
      document.getElementById(idname).innerHTML = ``;
    });
  });
}

document.getElementById("btn-search-route").addEventListener("click", function () {
  console.log("departure : " + departureX + " , " + departureY);
  console.log("arrival : " + arrivalX + " , " + arrivalY);

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      appKey: "C8v8OqOyyW5b9aCzvpYGu6T9Fdi4oU9Z2ErTwEJF",
    },
    body: JSON.stringify({
      startX: departureX,
      startY: departureY,
      endX: arrivalX,
      endY: arrivalY,
      lang: 0,
      format: "json",
      count: 10,
    }),
  };

  fetch("https://apis.openapi.sk.com/transit/routes", options)
    .then((response) => response.json())
    .then((data) => makeRouteList(data))
    .then(map.relayout())
    .catch((err) => console.error(err));
});

function makeRouteList(data) {
  // while (document.getElementById("route-result").childElementCount > 1) {
  //   document
  //     .getElementById("route-result")
  //     .removeChild(document.getElementById("route-result").lastChild);
  // }
  // document.getElementById("route-result").innerHTML = ``;
  console.log(data);
  console.log(data.metaData.plan);
  let trips = data.metaData.plan.itineraries;
  // fa-bus-simple
  for (trip of trips) {
    let route = `
    <div class="tab-content shadow-lg w-100 mb-3" style="background-color:rgb(255, 255, 255)">
      <div class="w-100 d-flex align-items-center mb-3">`;
    let desc = ``;
    let totalTime = trip.totalTime;
    let totalFare = trip.fare.regular.totalFare;
    let legs = trip.legs;
    for (leg of legs) {
      if (leg.mode == "WALK") {
        route += `<span class="fa-stack fa-1x">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-person-walking fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${
          (leg.sectionTime * 100) / totalTime
        }%; border:5px solid black;"></hr>`;
      } else if (leg.mode == "TRANSFER") {
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid gray;"></hr>`;
      } else if (leg.mode == "BUS") {
        route += `<span class="fa-stack fa-1x" style="color:#${leg.routeColor}">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-bus-simple fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid #${leg.routeColor};"></hr>`;
      } else if (leg.mode == "SUBWAY") {
        route += `<span class="fa-stack fa-1x" style="color:#${leg.routeColor}">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-bus-simple fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid #${leg.routeColor};"></hr>`;
      }
    }
    route += `</div>`;
    route += `<div class="mt-1">${Math.ceil(totalTime / 60)}분<div><div>${totalFare}원 환승 | ${
      trip.transferCount
    }번 | 도보 ${Math.ceil(trip.walkTime / 60)}분</div>`;
    route += `</div>`;
    document.getElementById("route-result").innerHTML += route;
    document.getElementById("route-result").style.display = "block";
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption);
  }
}
