// 검색 버튼을 누르면
// 지역, 유형, 검색어 얻기
// 위 데이터를 가지고 공공데이터에 요청
// 받은 데이터를 이용하여 화면 구성
document.getElementById("btn-search").addEventListener("click", function () {
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
    .then((data) => makeList(data));
});

function makeList(data) {
  console.log(data);
  let trips = data.documents;
  console.log(trips);
  let tripList = ``;
  document.getElementById("kakaolist").innerHTML = ``;
  trips.forEach((area) => {
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("class", "btn btn-light");
    button.appendChild(document.createTextNode(area.place_name));
    document.getElementById("kakaolist").appendChild(button);

    button.addEventListener("click", function () {
      console.log(area.x);
      console.log(area.y);
    });
  });
}
