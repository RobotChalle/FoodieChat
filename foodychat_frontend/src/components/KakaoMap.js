import React, { useEffect } from 'react';
import './css/kakaomap.css';

export default function KakaoMap({ stores }) {
  console.log("📦 전달된 stores:", stores);
  stores.forEach(store => console.log("📍 주소 확인:", store.real_address));

  useEffect(() => {
    const loadKakaoMapScript = () => {
      if (window.kakao && window.kakao.maps) {
        console.log("✅ 이미 kakao 객체 있음");
        window.kakao.maps.load(initMap);
        return;
      }

      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?appkey=cdcb36f7c5dbf63f04c19c92959118ca&autoload=false&libraries=services";
      script.async = true;

      script.onload = () => {
        console.log("✅ Kakao SDK 스크립트 로딩 완료");
        window.kakao.maps.load(() => {
          console.log("✅ kakao.maps.load 완료됨", window.kakao);
          initMap();
        });
      };

      script.onerror = () => {
        console.error("❌ Kakao SDK 로딩 실패 - 키 또는 도메인 확인 필요");
      };

      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!stores || stores.length === 0) return;

      const filteredStores = stores.filter(
        (store) => store.real_address && store.real_address.trim().length > 5
      );

      console.log("🗺️ 필터된 stores (주소 있는 것만):", filteredStores);
      if (filteredStores.length === 0) return;

      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 초기 중심 (서울 시청)
        level: 5,
      };
      const map = new window.kakao.maps.Map(container, options);
      const geocoder = new window.kakao.maps.services.Geocoder();

      const bounds = new window.kakao.maps.LatLngBounds(); // ✅ 모든 마커 범위

      let markerCount = 0;

      filteredStores.forEach((store) => {
        geocoder.addressSearch(store.real_address, function (result, status) {
          console.log(
            `📍 주소 검색 결과 [${store.name}]`,
            store.real_address,
            status,
            result
          );

          if (status === window.kakao.maps.services.Status.OK) {
            const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
            bounds.extend(coords); // ✅ 마커 범위 추가

            const marker = new window.kakao.maps.Marker({
              map: map,
              position: coords,
            });

            const info = new window.kakao.maps.InfoWindow({
                content: `
                  <div style="
                    padding:10px;
                    font-size:14px;
                    line-height:1.6;
                    max-width:200px;
                    word-break:break-word;
                  ">
                    <div style="font-weight:bold; font-size:15px;">📍 ${store.name}</div>
                    <div style="margin-top:4px; color:#444;">
                      ⭐ ${store.rating || "0.0"}점 · ${store.review || "리뷰 없음"}
                    </div>
                    <a href="${store.url}" target="_blank"
                       style="display:inline-block; margin-top:6px; color:#2b6cb0; font-weight:bold; text-decoration:none;"
                       onmouseover="this.style.color='#1a4e8a'"
                       onmouseout="this.style.color='#2b6cb0'">
                      🔗 자세히 보기
                    </a>
                  </div>
                `,
              });

            marker.setMap(map);
            window.kakao.maps.event.addListener(marker, "click", () => {
              info.open(map, marker);
            });

            markerCount++;
            // ✅ 모든 마커 생성 후 지도 범위 설정
            if (markerCount === filteredStores.length) {
              map.setBounds(bounds);
            }
          }
        });
      });
    };

    loadKakaoMapScript();
  }, [stores]);

  return (
    <div
      id="map"
      style={{ width: "100%", height: "400px", marginTop: "20px" }}
    />
  );
}
