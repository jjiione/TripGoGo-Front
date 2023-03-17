// curl -X GET "https://dapi.kakao.com/v2/local/search/category.json?category_group_code=MT1&page=1&size=15&sort=accuracy" \
// 	-H "Authorization: KakaoAK {REST_API_KEY}"

// 검색 버튼을 누르면
// 지역, 유형, 검색어 얻기
// 위 데이터를 가지고 공공데이터에 요청
// 받은 데이터를 이용하여 화면 구성


var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(37.5013068, 127.0396597), // 지도의 중심좌표
        level: 8 // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

fetch("../json/korea-administrative-district.json")
.then(response => {
  return response.json();
})
  .then(jsondata => console.log(jsondata));


// 공공데이터에서 지역구 가져오기
var serviceKey = "yEDlTnRgLJ6TyA%2B5%2FJVGel5GPAULuQKSnfZzzxUgCdlvG%2BfnI8wYyOfYvmMZMjpFHF%2FlhvqHyavoqE5eWqqjgw%3D%3D";
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
  

// 카테고리로 검색

var imageSrc = '../images/location-dot-solid.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(20, 30), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

// var map = new kakao.maps.Map(mapContainer, mapOption);
document.getElementById("btn-search").addEventListener("click", () => {
  // window.location.reload();
  let category = document.getElementById("search-type").value;

  var infowindow = new kakao.maps.InfoWindow({zIndex:1});

  
  // 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map); 

// 카테고리로 은행을 검색합니다
ps.categorySearch(category, placesSearchCB, {useMapBounds:true}); 

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
        for (var i=0; i<data.length; i++) {
            displayMarker(data[i]);    
        }       
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

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, 'click', function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
        infowindow.open(map, marker);
    });
}

  
});

