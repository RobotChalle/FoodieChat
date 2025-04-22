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
        (store) => !!store.real_address && store.real_address.trim().length > 1
      );
      if (filteredStores.length === 0) return;

      const container = document.getElementById("map");
      const geocoder = new window.kakao.maps.services.Geocoder();
      const bounds = new window.kakao.maps.LatLngBounds();

      // 첫 가게 주소를 기준으로 중심 좌표 설정
      geocoder.addressSearch(filteredStores[0].real_address, (result, status) => {
        let centerCoords = new window.kakao.maps.LatLng(37.5665, 126.9780); // fallback (서울 시청)

        if (status === window.kakao.maps.services.Status.OK) {
          centerCoords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
        }

        const map = new window.kakao.maps.Map(container, {
          center: centerCoords,
          level: 5,
        });

        let markerCount = 0;

        filteredStores.forEach((store) => {
          geocoder.addressSearch(store.real_address, (result, status) => {
            console.log(`📍 주소 검색 결과 [${store.name}]`, store.real_address, status, result);

            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
              bounds.extend(coords);

              const marker = new window.kakao.maps.Marker({
                map,
                position: coords,
              });

              const info = new window.kakao.maps.InfoWindow({
                content: `
                  <div style="padding:10px;font-size:14px;line-height:1.6;max-width:200px;word-break:break-word;">
                    <div style="font-weight:bold;font-size:15px;">📍 ${store.name}</div>
                    <div style="margin-top:4px;color:#444;">
                      ⭐ ${store.rating || "0.0"}점 · ${store.review || "리뷰 없음"}
                    </div>
                    <a href="${store.url}" target="_blank"
                       style="display:inline-block;margin-top:6px;color:#2b6cb0;font-weight:bold;text-decoration:none;">
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
              if (markerCount === filteredStores.length) {
                map.setBounds(bounds); // 모든 마커 범위 맞춤
              }
            }
          });
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
