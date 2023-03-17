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