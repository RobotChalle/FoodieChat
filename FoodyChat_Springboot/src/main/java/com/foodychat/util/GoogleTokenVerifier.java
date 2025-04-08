package com.foodychat.util;

import java.util.Collections;

import com.foodychat.user.vo.GoogleUserInfo;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

public class GoogleTokenVerifier {

    private static final String CLIENT_ID = "758964500028-3l2f9avbost20tq4ri7nr4nfed4fd2l3.apps.googleusercontent.com"; // 실제 값으로 교체

    public static GoogleUserInfo verify(String tokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance()
            ).setAudience(Collections.singletonList(CLIENT_ID)).build();

            GoogleIdToken idToken = verifier.verify(tokenString);
            if (idToken != null) {
                Payload payload = idToken.getPayload();

                GoogleUserInfo userInfo = new GoogleUserInfo();
                userInfo.setEmail(payload.getEmail());
                userInfo.setName((String) payload.get("name"));
                userInfo.setGoogleId(payload.getSubject());
                return userInfo;
            } else {
                throw new RuntimeException("Invalid ID Token");
            }

        } catch (Exception e) {
            throw new RuntimeException("Token verification failed", e);
        }
    }
}
