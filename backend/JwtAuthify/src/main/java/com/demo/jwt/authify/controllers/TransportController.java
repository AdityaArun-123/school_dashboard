package com.demo.jwt.authify.controllers;

import com.demo.jwt.authify.entity.TransportEntity;
import com.demo.jwt.authify.io.ApiResponse;
import com.demo.jwt.authify.io.TransportRequest;
import com.demo.jwt.authify.services.TransportServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/transport")
@RequiredArgsConstructor
public class TransportController {

    private final TransportServiceImpl transportService;

    @PostMapping("/add-transport")
    public ResponseEntity<ApiResponse<Object>> addTransport(@RequestBody TransportRequest transportRequest) {
        transportService.addTransport(transportRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Transport added successfully.."));
    }

    @GetMapping("/fetch-all-transports")
    public ResponseEntity<ApiResponse<Page<TransportEntity>>> fetchAllTransports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transportId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<TransportEntity> transport = transportService.getAllTransports(page, size, sortBy, sortDir);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(transport, ""));
    }

    @GetMapping("/fetch-transport")
    public ResponseEntity<ApiResponse<Optional<TransportEntity>>> fetchTransport(@RequestParam(value = "id") Long transportId) {
        Optional<TransportEntity> transport = transportService.getTransport(transportId);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(transport, "Successfully fetched the transport details.."));
    }

    @PostMapping("/update-transport")
    public ResponseEntity<ApiResponse<Object>> updateTransport(@RequestParam(value = "id") Long transportId,
                                                             @RequestBody TransportRequest transportRequest) {
        transportService.updateTransport(transportRequest, transportId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(null, "Record updated successfully.."));
    }

    @DeleteMapping("/delete-transport")
    public ResponseEntity<ApiResponse<Object>> deleteTransport(@RequestParam(value = "id") Long transportId) {
        transportService.deleteTransport(transportId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.success(null, "Record deleted successfully.."));
    }

    @GetMapping("/search-transport")
    public ResponseEntity<ApiResponse<Page<TransportEntity>>> searchTransports(
            @RequestParam(required = false) String busNo,
            @RequestParam(required = false) String routeNumber,
            @RequestParam(required = false) String driverName,
            @RequestParam(required = false) Long phoneNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "transportId") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Page<TransportEntity> students = transportService.searchTransports(
                busNo, routeNumber, driverName, phoneNumber, page, size, sortBy, sortDir
        );
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(students, ""));
    }
}
