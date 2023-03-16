//index page 로딩 후 전국의 시도 설정
let serviceKey = "09a53d4cf09cbe89a1f8ed92cb9a32d8";
let areaUrl =
  "https://dapi.kakao.com/v2/local/search/keyword.json?page=1&size=5&sort=accuracy&query=신림역";

// 비동기
let prom = fetch(areaUrl, {
  method: "GET",
  headers: {
    Authorization: "KakaoAK " + serviceKey,
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// 검색 버튼을 누르면
// 지역, 유형, 검색어 얻기
// 위 데이터를 가지고 공공데이터에 요청
// 받은 데이터를 이용하여 화면 구성
document.getElementById("btn-search").addEventListener("click", function () {
  let searchUrl = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=yEDlTnRgLJ6TyA%2B5%2FJVGel5GPAULuQKSnfZzzxUgCdlvG%2BfnI8wYyOfYvmMZMjpFHF%2FlhvqHyavoqE5eWqqjgw%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A`;
  let area = document.getElementById("search-area").value;
  let contentTypeId = document.getElementById("search-content-id").value;
  let keyword = document.getElementById("search-keyword").value;
  if (parseInt(area)) searchUrl += `&areaCode=${area}`;
  if (parseInt(contentTypeId)) contentTypeId += `&contentTypeId=${contentTypeId}`;
  if (!keyword) {
    alert("검색어 입력 필수!!");
    return;
  } else {
    searchUrl += `&keyword=${keyword}`;
  }
  fetch(searchUrl)
    .then((response) => response.json())
    .then((data) => makeList(data));
});
