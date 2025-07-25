package com.demo.jwt.authify.filter;

import com.demo.jwt.authify.config.CustomAuthenticationEntryPoint;
import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.services.UserDetailsServiceImpl;
import com.demo.jwt.authify.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private static final List<String> PUBLIC_URLS =
        List.of("/auth/login",
                "/profile/register",
                "/auth/send-password-reset-otp",
                "/auth/verify-password-reset-otp",
                "/auth/reset-password",
                "/auth/send-verify-otp",
                "/auth/verify-email",
                "/auth/logout",
                "/auth/refresh-token",
                "/uploads/**");
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI().substring(request.getContextPath().length());

        if(isPublicEndPoint(path)){
            filterChain.doFilter(request, response);
            return;
        }
        String email = null;
        String jwtToken = null;

        // 1. Check the Authorization Header if the token is not saved in cookie
        final String authorizationHeader = request.getHeader("Authorization");
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
        }

        // 2. If not found in header then check cookie
        if(jwtToken == null) {
            Cookie[] cookies = request.getCookies();
            if(cookies != null) {
                for (Cookie cookie : cookies) {
                    if("accessToken".equals(cookie.getName())) {
                        jwtToken = cookie.getValue();
                        break;
                    }
                }
            }
        }

        // 3. validate the token and set the security context
        try{
            if(jwtToken != null) {
                email = jwtUtil.extractEmail(jwtToken);
                if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    if(jwtUtil.validateToken(jwtToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        }catch (ExpiredJwtException ex) {
            sendErrorResponse(response, "Access token expired");
        } catch (Exception ex) {
            sendErrorResponse(response, "Invalid token");
        }
    }
    private boolean isPublicEndPoint(String path) {
        for (String publicPath : PUBLIC_URLS) {
            if (pathMatcher.match(publicPath, path)) {
                return true;
            }
        }
        return false;
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        ApiResponse<Void> errorResponse = ApiResponse.error(message);
        response.getWriter().write(new ObjectMapper().writeValueAsString(errorResponse));
    }
}
