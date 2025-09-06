package com.ntt.elogistics.services;

import com.ntt.elogistics.dtos.responses.LoginResponse;
import com.ntt.elogistics.exceptions.CustomException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class JwtService {
    @Value("${app.jwt.secret}")
    private String jwtSecret;
    @Value("${app.jwt.expiration}")
    private long jwtExpirationsMs;
    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpirationsMs;

    private static final String TOKEN_PREFIX = "Bearer ";

    public String generateAccessToken(Authentication authentication) {
        return generateToken(authentication, jwtExpirationsMs, new HashMap<>());
    }

    public LoginResponse generateLoginResponse(Authentication authentication){
        String accessToken = generateAccessToken(authentication);
        return LoginResponse.builder()
                .accessToken(accessToken).build();
    }

    public String generateRefreshToken(Authentication authentication) {
        Map<String, String> claims = new HashMap<>();
        claims.put("tokenType", "refresh");
        return generateToken(authentication, refreshExpirationsMs, claims);
    }

    public String generateToken(Authentication authentication, long expirationsMs, Map<String, String> claims) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();

        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationsMs);

        return Jwts.builder()
                .header()
                .add("typ","JWT")
                .and()
                .subject(userPrincipal.getUsername())
                .claims(claims)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSignInKey())
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isValidToken(String token,UserDetails userDetails){
        final String username = extractUsernameFromToken(token);

        if(!username.equals(userDetails.getUsername())){
            return false;
        }

        try{
            Jwts.parser()
                    .verifyWith((SecretKey) getSignInKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        }catch (SignatureException e){
            throw new CustomException("Chữ ký JWT không hợp lệ", HttpStatus.UNAUTHORIZED);
        } catch (MalformedJwtException e){
            throw new CustomException("Token không hợp lệ", HttpStatus.BAD_REQUEST);
        }catch (ExpiredJwtException e){
            throw new CustomException("Token đã hết hạn", HttpStatus.UNAUTHORIZED);
        }catch (UnsupportedJwtException e){
            throw new CustomException("Token không được hỗ trợ", HttpStatus.BAD_REQUEST);
        }catch (IllegalArgumentException e){
            throw new CustomException("Token rỗng hoặc không hợp lệ", HttpStatus.BAD_REQUEST);
        }
    }


    public boolean isRefreshToken(String token){
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return "refresh".equals(claims.get("tokenType"));
    }

    public String extractUsernameFromToken(String token){
//        try{
//            return Jwts.parser()
//                    .verifyWith((SecretKey) getSignInKey())
//                    .build()
//                    .parseSignedClaims(token)
//                    .getPayload()
//                    .getSubject();
//        }
//        catch (ExpiredJwtException ex){
//            throw new CustomException("Token đã hết hạn", HttpStatus.UNAUTHORIZED);
//        }

        return Jwts.parser()
                .verifyWith((SecretKey) getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();

    }

}
