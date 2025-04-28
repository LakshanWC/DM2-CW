package com.example.Supplier.config;

import org.hibernate.boot.MetadataBuilder;
import org.hibernate.boot.spi.MetadataBuilderContributor;
import org.hibernate.dialect.function.StandardSQLFunction;
import org.springframework.context.annotation.Configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StoredProcedureConfig implements MetadataBuilderContributor {

    @Override
    public void contribute(MetadataBuilder metadataBuilder) {
        // Register  order procedures with exact database names
        metadataBuilder.applySqlFunction(
                "ACCEPT_ORDER",
                new StandardSQLFunction("SYSTEM.accept_order")
        );

        metadataBuilder.applySqlFunction(
                "CANCELLED_ORDER",
                new StandardSQLFunction("SYSTEM.cancelled_order")
        );

        metadataBuilder.applySqlFunction(
                "UPDATE_ORDER_STATUS",
                new StandardSQLFunction("SYSTEM.update_order_status")
        );

        metadataBuilder.applySqlFunction(
                "GET_PAYMENT_HISTORY",
                        new StandardSQLFunction("SYSTEM.get_payment_history")
        );
    }
    @Configuration
    public class CorsConfig {
        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("http://localhost:3000") // React default port
                            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                            .allowedHeaders("*")
                            .allowCredentials(true);
                }
            };
        }
    }
}