// curl -X GET "https://dapi.kakao.com/v2/local/search/category.json?category_group_code=MT1&page=1&size=15&sort=accuracy" \
// 	-H "Authorization: KakaoAK {REST_API_KEY}"

// 검색 버튼을 누르면
// 지역, 유형, 검색어 얻기
// 위 데이터를 가지고 공공데이터에 요청
// 받은 데이터를 이용하여 화면 구성


var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.5013068, 127.0396597), // 지도의 중심좌표
        level: 5 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

var area1 = "";
var area2 = "";

// 공공데이터에서 지역구 가져오기
var serviceKey = "z3vgw8Qjex43dubAYmTKS%2BYTCarK5JjMqfW6Da3cYCNTdA2FqJThjd15mnJY6lqmPFSCIehjR2Jex%2F71IGfBvw%3D%3D";
let areaUrl = "https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=" +
  serviceKey + "&numOfRows=20&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json";


  fetch(areaUrl, { method: "GET" })
  .then((response) => response.json())
  .then((data) => makeOption(data));

  function makeOption(data) {
    let areas = data.response.body.items.item;
    console.log(data);
    let sel = document.getElementById("search-area1");
    areas.forEach((area) => {
      let opt = document.createElement("option");
      opt.setAttribute("value", area.code);
      opt.appendChild(document.createTextNode(area.name));
  
      sel.appendChild(opt);
    });
} 

// 세부 지역 검색
document.getElementById("search-area1").addEventListener("change", () => {
  let areaCode = document.getElementById("search-area1").value;
  let areaUrlDetail = `https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=` +
    serviceKey + `&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&areaCode=${areaCode}&_type=json`;
  
    fetch(areaUrlDetail, { method: "GET" })
  .then((response) => response.json())
    .then((data) => makeOption(data));
  
    function makeOption(data) {
      let areas = data.response.body.items.item;
      console.log(data);
      let sel = document.getElementById("search-area2");
      sel.innerHTML = ``;
      areas.forEach((area) => {
        let opt = document.createElement("option");
        opt.setAttribute("value", area.code);
        opt.appendChild(document.createTextNode(area.name));
    
        sel.appendChild(opt);
      });
  }
});

// 카테고리로 검색

var imageSrc = '../images/location-dot-solid.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(20, 30), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

var markerList = [];
var printList = [];

// var map = new kakao.maps.Map(mapContainer, mapOption);
document.getElementById("btn-search").addEventListener("click", () => {
  let areaCode = document.getElementById("search-area1").value;
  let categoryCode = document.getElementById("search-type").value;
  if (areaCode == 0) {
    alert("지역을 선택하세요");
  } else if(categoryCode == 0){
    alert("유형을 선택하세요");
  } else {
    let category = document.getElementById("search-type").value;
  
    // console.log("start :: 0");
    document.getElementById('placesList').replaceChildren();
    // console.log("remove child :: 1");
  for (var i = 0; i < markerList.length; i++){
    markerList[i].setMap(null);
    }
    
    // console.log("remove marker :: 2");

  var infowindow = new kakao.maps.InfoWindow({zIndex:1});

  
  // 장소 검색 객체를 생성합니다
  let ps = new kakao.maps.services.Places(map);
  
  let location = $("#search-area1 option:checked").text() + $("#search-area2 option:checked").text();
  
  console.log(location);

  // 키워드로 장소를 검색합니다

  let serviceKey = "09a53d4cf09cbe89a1f8ed92cb9a32d8";
    let searchUrl =
      "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=";
  searchUrl += `${location}`;
  console.log(searchUrl);
  fetch(searchUrl, {
    method: "GET",
    headers: {
      Authorization: "KakaoAK " + serviceKey,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.documents[0].x);
      console.log(data.documents[0].y);
      var bounds = new kakao.maps.LatLngBounds();

      
      bounds.extend(new kakao.maps.LatLng(data.documents[0].y, data.documents[0].x));
      map.setBounds(bounds);
      map.setLevel(9);
    });


// 카테고리로 검색합니다
ps.categorySearch(category, placesSearchCB, {useMapBounds:true}); 

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    var listEl = document.getElementById('placesList'),
    menuEl = document.getElementById('menu_wrap'),
      fragment = document.createDocumentFragment();
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    // removeAllChildNods(listEl);

    if (data.length == 0) { // 데이터가 없을 때
      
    }
    
    printList = [];
    for (var i = 0; i < data.length; i++){
      displayMarker(data[i]);
      itemEl = getListItem(i, data[i]);
      printList.push(data[i].place_name);
      fragment.appendChild(itemEl);
      } 
    console.log(printList);        
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
    }
  }
  

// 지도에 마커를 표시하는 함수입니다
function displayMarker(place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
      position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage
    });
  
  markerList.push(marker);
  

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
  }

  // 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

  var el = document.createElement('li'),
  itemStr = '<div>' +
              '   <div class="list-title">' + places.place_name + '</div>';

  if (places.road_address_name) {
      itemStr += '    <div class="list-content">' + places.road_address_name + '</div>' +
                  '   <div class="list-content">' +  places.address_name  + '</div>';
  } else {
      itemStr += '    <div class="list-content">' +  places.address_name  + '</div>'; 
  }
            
    itemStr += '  <div class="list-content">' + places.phone  + '</div>' +
              '</div>';           
  console.log("item :: " + itemStr);
  el.innerHTML = itemStr;
  // el.className = 'item';

  return el;
}
  }


  
  
});

