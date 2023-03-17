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
  let serviceKey = "09a53d4cf09cbe89a1f8ed92cb9a32d8";
  let searchUrl =
    "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=";
  let keyword = document.getElementById("search-departures").value;
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
    .then((data) => makeList(data, "departures-list", "search-departures"));
});

document.getElementById("btn-search-arrivals").addEventListener("click", function () {
  //index page 로딩 후 전국의 시도 설정
  let serviceKey = "09a53d4cf09cbe89a1f8ed92cb9a32d8";
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
    button.setAttribute("class", "btn btn-light");
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
    .catch((err) => console.error(err));
});

function makeRouteList(data) {
  document.getElementById("route-result").innerHTML = ``;
  console.log(data);
  console.log(data.metaData.plan);
  let trips = data.metaData.plan.itineraries;
  // fa-bus-simple
  for (trip of trips) {
    let route = `
    <div class="tab-content shadow-lg w-100 mb-5" style="background-color:rgb(255, 255, 255)">
      <div class="w-100 d-flex align-items-center mb-3">`;
    let desc = ``;
    let totalTime = trip.totalTime;
    let totalFare = trip.fare.regular.totalFare;
    let legs = trip.legs;
    for (leg of legs) {
      if (leg.mode == "WALK") {
        route += `<span class="fa-stack fa-2x">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-person-walking fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${
          (leg.sectionTime * 100) / totalTime
        }%; border:5px solid black;"></hr>`;
        desc += `<div class="mt-1">
      <i class="fa-solid fa-person-walking"></i>
      <span>도보${Math.ceil(leg.sectionTime / 60)}분</span></div>`;
      } else if (leg.mode == "TRANSFER") {
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid gray;"></hr>`;
      } else if (leg.mode == "BUS") {
        route += `<span class="fa-stack fa-2x" style="color:#${leg.routeColor}">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-bus-simple fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid #${leg.routeColor};"></hr>`;
      } else if (leg.mode == "SUBWAY") {
        route += `<span class="fa-stack fa-2x" style="color:#${leg.routeColor}">
        <i class="fa-solid fa-circle fa-stack-2x"></i>
        <i class="fa-solid fa-bus-simple fa-stack-1x fa-inverse"></i>
      </span>`;
        route += `<hr style="width:${Math.ceil(
          (leg.sectionTime * 100) / totalTime
        )}%; border:5px solid #${leg.routeColor};"></hr>`;
        desc += `<div class="mt-1">
          <i class="fa-solid fa-train-subway"></i>
          <span>지하철 ${Math.ceil(leg.sectionTime / 60)}분</span></div>`;
      }
    }
    route += `</div>`;
    route += `<div class="mt-1">${Math.ceil(totalTime / 60)}분<div><div>${totalFare}원 환승 | ${
      trip.transferCount
    }번 | 도보 ${Math.ceil(trip.walkTime / 60)}분</div>`;
    route += `</div>`;
    document.getElementById("route-result").innerHTML += route;
    document.getElementById("route-result").style.display = "block";
  }
}
