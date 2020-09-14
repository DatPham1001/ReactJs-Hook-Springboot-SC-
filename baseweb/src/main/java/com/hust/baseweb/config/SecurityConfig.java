package com.hust.baseweb.config;

import com.hust.baseweb.entity.UserLogin;
import com.hust.baseweb.service.BaseWebUserDetailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@AllArgsConstructor(onConstructor = @__(@Autowired))
@EnableGlobalMethodSecurity(securedEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private BaseWebUserDetailService userDetailsService;
    private BasicAuthenticationEndPoint basicAuthenticationEndPoint;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.userDetailsService).passwordEncoder(UserLogin.PASSWORD_ENCODER);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/order/**").hasAnyRole("ADMIN", "WAREHOUSE_MANAGER", "COORDINATOR")
                .antMatchers("/product/**").permitAll()
                .antMatchers("/category/**").hasAnyRole("ADMIN","WAREHOUSE_MANAGER", "WAREHOUSE_STAFF")
                .antMatchers("/supplier/**").hasAnyRole("ADMIN", "WAREHOUSE_MANAGER", "COORDINATOR")
                .anyRequest()
                .authenticated()
                .and()
                .httpBasic()
                .authenticationEntryPoint(basicAuthenticationEndPoint)
                .and()
                .csrf()
                .disable()
                .logout()
                .logoutSuccessUrl("/");
    }


    @Bean
    @SuppressWarnings("unchecked")
    public FilterRegistrationBean corsFilterRegistrationBean() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}
