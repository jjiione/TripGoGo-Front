var mapContainer1 = document.getElementById("map1"), // 지도를 표시할 div
  mapOption1 = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map1 = new kakao.maps.Map(mapContainer1, mapOption1); // 지도를 생성합니다

// 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
var linePath = [
  //   new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
  //   new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
  //   new kakao.maps.LatLng(33.45178067090639, 126.5726886938753),
];

// 지도에 표시할 선을 생성합니다
var polyline = new kakao.maps.Polyline({
  path: linePath, // 선을 구성하는 좌표배열 입니다
  strokeWeight: 5, // 선의 두께 입니다
  strokeColor: "#FFAE00", // 선의 색깔입니다
  strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
  strokeStyle: "solid", // 선의 스타일입니다
});

// 지도에 선을 표시합니다
polyline.setMap(map1);

var mapContainer0 = document.getElementById("map0"), // 지도를 표시할 div
  mapOption0 = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3, // 지도의 확대 레벨
  };

var map1 = new kakao.maps.Map(mapContainer0, mapOption1); // 지도를 생성합니다

// 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
var linePath = [
  //   new kakao.maps.LatLng(33.452344169439975, 126.56878163224233),
  //   new kakao.maps.LatLng(33.452739313807456, 126.5709308145358),
  //   new kakao.maps.LatLng(33.45178067090639, 126.5726886938753),
];

// 지도에 표시할 선을 생성합니다
var polyline = new kakao.maps.Polyline({
  path: linePath, // 선을 구성하는 좌표배열 입니다
  strokeWeight: 5, // 선의 두께 입니다
  strokeColor: "#FFAE00", // 선의 색깔입니다
  strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
  strokeStyle: "solid", // 선의 스타일입니다
});

// 지도에 선을 표시합니다
polyline.setMap(map0);
