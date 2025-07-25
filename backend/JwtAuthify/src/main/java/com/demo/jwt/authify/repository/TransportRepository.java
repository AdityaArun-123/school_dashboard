package com.demo.jwt.authify.repository;

import com.demo.jwt.authify.entity.TransportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRepository extends JpaRepository<TransportEntity, Long> {
}
