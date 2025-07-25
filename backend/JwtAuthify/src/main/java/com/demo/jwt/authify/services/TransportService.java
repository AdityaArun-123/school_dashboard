package com.demo.jwt.authify.services;

import com.demo.jwt.authify.entity.TransportEntity;
import com.demo.jwt.authify.io.TransportRequest;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface TransportService {
    void addTransport(TransportRequest transportRequest);
    Page<TransportEntity> getAllTransports(int page, int size, String sortBy, String sortDir);
    Optional<TransportEntity> getTransport(Long id);
    void updateTransport(TransportRequest transportRequest, Long id);
    void deleteTransport(Long id);
    Page<TransportEntity> searchTransports(String busNo, String routeNumber, String driverName, Long phoneNumber, int page, int size, String sortBy, String sortDir);
}
